"use client"
import { usePathname } from "next/navigation";

 const Form =({handleSubmit, headerLabel, formData, setFormData, error, submitting, handleChange})=>{
    const pathname = usePathname();
return(
    <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-2">
    <div className="small_head_text text-white text-center">{headerLabel}</div>

    {pathname==="/signup" ?    <label> Name 
       <input type="text" className="form_input"
       name="name"
        onChange={handleChange}
        required
       /></label> : null}
    
       <label> Email 
       <input type="email" className="form_input"
       onChange={handleChange}  
       name="email"
       required
        />
       </label>
       <label> Password 
       <input type="password" className="form_input" 
       onChange={handleChange} 
       name="password"
        required
       />
       </label>
       {error && <span className="text-red-500 text-sm">{error}</span>}
       <button className="submit_btn" disabled={submitting ? true : false}>{submitting ? "signing in..." : "Submit"}</button>
    </form>
)
}

export default Form;