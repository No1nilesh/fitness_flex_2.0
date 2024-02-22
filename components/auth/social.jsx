"use client"
import { FcGoogle } from "react-icons/fc"
import {FaGithub} from "react-icons/fa"
import Button from "@components/auth/Button"
import { useSession , signIn } from "next-auth/react"


export const Social =()=>{

    const {data : session} = useSession();
    const handleClick=(provider)=>{
        signIn(provider)
    }

return(
    <div className="flex items-center w-full gap-x-2">
 <Button handleClick={()=> handleClick("google")} >
<FcGoogle className="h-7 w-7"/>
 </Button>
 <Button handleClick={()=> handleClick("github")}>
<FaGithub className="h-7 w-7 "/>
 </Button>
    </div>
)
}