import { ClipboardList } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "./ui/Button"

const NavBar = () => {
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-slate-900 border-b border-zinc-300 z-[10] py-2 text-white">
        <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">

        <Link href={'/'} className="flex gap-3">
             <ClipboardList className="h-6 w-6" />
             Todo-List
        </Link >
        
        <Link href={'/'} className={buttonVariants({
            variant: 'ghost'
        })}>
            SignIn
        </Link>
        </div>
    </div>
  )
}

export default NavBar
