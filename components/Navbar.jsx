"use client"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";

const Navbar = () => {
  const {data : session, status : sessionStatus} = useSession();
  //returns current pathname
  const currentPage = usePathname();
  //Defining the pathname where navbar will be shown.
  const PagesWithNavbar = ['/', '/signin' , '/login', '/forgot-password'];
  //checking whether we are on the path which is defined in the PageWithNavbar.
  const shouldShowNavbar = PagesWithNavbar.includes(currentPage);

  //Don't show navbar if pathname is not defined.
  if(!shouldShowNavbar){
    return null
  }


  return (
   <nav className="flex flex-row justify-around items-center w-full pt-3 fixed top-0 z-10">
         <Link href={"/"} className="flex gap-2 flex-center">
                <Image
                    src={"/assets/fitnesslogo.png"}
                    width={72}
                    height={32}
                    className="object-contain"
                    alt="fitness flex"
                />
            </Link>

     <div className="flex-center gap-8 text-lg">
     {/* <Link href={"/"}>Home</Link>
     <Link href={"/about"}>About</Link> */}
     {
      !session?.user ? ( <Link href={"/login"}>Sign In</Link> ) :
       (  
        <>
        <button className="outline_btn" onClick={()=> signOut()}>Log out</button> 
       
        <Image src={session?.user.image ? session?.user.image  : "/assets/Profile.png"} width={37} height={37}
                     className="rounded-full" 
                     alt="profile"/>
        </>
         )
     }
    
     
     </div>

    
    </nav>
  )
}

export default Navbar
