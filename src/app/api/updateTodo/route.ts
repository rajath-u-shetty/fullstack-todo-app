import { db } from "@/lib/db";
import { TodoValidator } from "@/lib/validators/todoValidator";
import { z } from "zod";

export async function POST(req: Request) {
    try {

        const body = await req.json()
        const { title } = TodoValidator.parse(body);

        const todoExists = await db.todo.findFirst({
            where: {
                title,
            }
        })

        if(todoExists){
            return new Response("Todo already exists", { status: 401 })
        }

        const createTodo = await db.todo.create({
            data: {
                title,
                isCompleted: true,
            }
        })
    
        return new Response(createTodo.title)
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response(error.message, { status: 422 } )
        }

        return new Response("Something unexpected happened", { status: 500 })
        
    }
}


export async function GET() {
    try {
        const todos = await db.todo.findMany({
            orderBy: {
                id: 'asc' 
            }
        })
        
        return new Response(JSON.stringify(todos));
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response(error.message, { status: 422 } )
        }

        return new Response("Something unexpected happened", { status: 500 })
    }
}