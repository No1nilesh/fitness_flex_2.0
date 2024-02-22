"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CardWrapper } from "@components/auth/card-wrapper";
import  Form  from "@components/auth/Form";
import Link from "next/link";
import {signIn} from "next-auth/react"
import Loader from "@components/Loader";


const page = () => {

  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const {data : session , status : sessionStatus} = useSession()
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email : "",
    password : ""
  })

  //checking and routing according to their role.
  useEffect(() => {
    if(sessionStatus === "authenticated"){
      if(session?.user.role == "admin"){
        router.replace("/admin/dashboard")
      }else if(session?.user.role == "trainer"){
        router.replace("/trainer/dashboard")
      }else{
        router.replace("/member")
      }
    }
  }, [sessionStatus , router])
  

  const handleChange=(e)=>{
    setFormData((prevFormData)=> ({
      ...prevFormData, [e.target.name] : e.target.value
    }))
  }


  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("")
    if(!formData.email || !formData.password){
      setError("Must Provide All Credentials")
    }
    console.log(formData.email, formData.password)
    try { 

    setSubmitting(true)
    const res = await signIn("credentials", {
    email : formData.email,
    password : formData.password,
    redirect : false
   })
     
      if(res.error){
        setError("Invalid Credentails")
        setSubmitting(false)
        return;
      }

      router.replace("/")

    } catch (error) {
      setError("Somethig went wrong")
    }
  };

  //show loader when status is loading
  if(sessionStatus == "loading"){
    return <Loader/>
  }

  return (
   sessionStatus !== "authenticated" && <CardWrapper headerLabel={"Log In"} showSocial={true}>
      {<Form headerLabel={"Log In"} 
             handleSubmit={handleSubmit}
             formdata={formData}
             setFormData={setFormData} 
             handleChange={handleChange}
              error={error}
             />}

      <div className="flex justify-end mt-1">
        <Link className="hover:text-blue-500" href={"/forgot-password"}>
          Forgot Password?
        </Link>
      </div>
    </CardWrapper>
  );
};

export default page;
