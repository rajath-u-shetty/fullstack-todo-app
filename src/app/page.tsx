'use client'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'
import { toast } from '@/components/ui/use-toast'
import { TodoRequest } from '@/lib/validators/todoValidator'
import { Todo } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2, Trash, Trash2, Trash2Icon, TrashIcon } from 'lucide-react'
import { title } from 'process'
import React, { useState } from 'react'

const page = () => {
  const [input, setInput] = useState<string>(" ")
  const queryClient = useQueryClient();

  const {data: todos = [], isFetching} = useQuery<Todo[]>({
    queryKey: ['todo'],
    queryFn: async() => {
      const { data } = await axios.get("/api/updateTodo")
      return data
    }
  })

  const {mutate: addTodo} = useMutation({
    mutationFn: async() => {
      const payload: TodoRequest = {
        title: input,
        isCompleted: false,
      } 
      const { data } = await axios.post("/api/updateTodo", payload)
      return data as string
    },
    onSuccess: (data) => {
      setInput(" "),
      toast({
        title: "Todo addded",
        description: `${data} has been added to the List`
      }),
      queryClient.invalidateQueries({ queryKey: ['todos']} )
    },
    onError: (err) => {
      if(err instanceof AxiosError){
        if(err.response?.status === 401){
          return toast({
            title: "Todo already exists",
            description: "try again with another todo",
            variant: 'default'
          })
        }

        if(err.response?.status === 422){
          return toast({
            title: "Invalid Todo Name",
            description: "Please try another name for the todo",
            variant: 'default'
          })
        }

        return toast({
          title: "Something Unexpected happened",
          description: "Could not create a todo",
          variant: 'default'
        })
      }
    },
  })

  const {mutate: deleteTodo} = useMutation({
    mutationFn: async(id: number) => {
      await axios.delete(`/api/updateTodo/${id}`, {data: id.toString,})
      return id
    },
    onSuccess: async(data: number) => {
      queryClient.invalidateQueries({ queryKey: ['todos']} ),
      toast({
        title: "Todo Deleted",
      })
    },
    onError: (error) => {
      console.log(error);
    }
  })

  if (todos.length === 0){
    return <h1>No todos</h1>
  } 
  return (<>
    <div className="flex  flex-col gap-3 mx-32">
      <h1 className="text-4xl mt-5 mb-5 items-center">Todo - List</h1>

      <div className="flex gap-2 ">
        <Input onChange={(e) => setInput(e.target.value)} placeholder="Add Todo" className=""/>
        <Button onClick={() => addTodo()}  disabled={input.length === 0} className="" >Add Todo</Button>
      </div>

      <Separator className="my-4"/>
      
      <div className='xl:mx-32'>
        <div className='m-2 text-2xl flex flex-col gap-4  w-full'>
          {todos.length > 0 && todos.map((todo: Todo) => (
            <div key={todo.id} className=' '>
              {isFetching ? (
                <div>
                  <Loader2 className='animate-spin flex items-center' />
                </div>
              ) : (
                <div className='flex justify-between items-center border border-gray-900 rounded-md right-0 w-full ' >
                  <div className='flex items-center ml-4'>
                    <Checkbox />
                    <h1  className='p-4'>
                      {todo.title}
                    </h1>
                  </div>
                  
                  
                  <Button variant={'ghost'}>
                    <Trash2 onClick={() => deleteTodo(todo.id)} className='w-6 h-6'/>
                  </Button>
                </div>
              )}
              
            </div>
          ))}
        </div>
        
      </div>
    </div>
</>)
}

export default page
