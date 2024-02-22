"use client"
import { CardWrapper } from '@components/auth/card-wrapper'
import  Form  from '@components/auth/Form'
import { useState , useEffect} from 'react'
import { useSession } from 'next-auth/react'
import { useRouter} from 'next/navigation'
import Loader from '@components/Loader'

const SignUp = () => {

const {data : session , status : sessionStatus} = useSession();
const router = useRouter()

useEffect(() => {
  if(sessionStatus === "authenticated"){
    router.replace("/member")
  }
}, [sessionStatus , router])



   //Credentail Part
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
      name : "",
      email : "",
      password : ""
    })
const handleChange=(e)=>{
      setFormData((prevFormData)=> ({
        ...prevFormData, [e.target.name] : e.target.value
      }))
    }    
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      if(!formData.email || !formData.name || !formData.password){
        setError("Must provide all credentails")
      }
            try {
              setError("")
              setSubmitting(true);
        
              const res = await fetch("/api/signup",
              {
                method : "POST",
                headers : {
                  "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    name : formData.name,
                    email : formData.email,
                    password : formData.password
                })
              });
              if(res.ok){
                setSubmitting(false);
                const form = e.target;
                form.reset();
                router.replace("/login")
                console.log("user registered");
              }else{
                const errorData = await res.json();
                setError(errorData.message)
                setSubmitting(false)
              }
        
            } catch (error) {
              setError("Somethig went wrong")
            }
      
    };



    if(sessionStatus == "loading"){
      return <Loader/>
    }

  return (
    sessionStatus !== "authenticated" && <CardWrapper  showSocial={true}>
    {<Form
     headerLabel={"Sign Up"}
     handleSubmit={handleSubmit}
     formData={formData}
     setFormData={setFormData}
     handleChange={handleChange}
     submitting={submitting}
     error={error}
     />}
     </CardWrapper>
  )
}

export default SignUp
