'use client'
import Form from '@components/Form'
import  { useState } from 'react'
import { useSession } from 'next-auth/react'
import MembershipPlanContainer from '@components/AdminComponents/MembershipPlanContainer'

const MembershipPlans = () => {
  const [memplan, setmemplan] = useState([])
  const {data : session } = useSession();

  // Creating Memplans
  const [data, setData] = useState({
    name: "",
    description: "",
    features: [],
    durationUnit: "",
    price: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const CreateMembership = async(e) => {
    setSubmitting(true)
    e.preventDefault();
    try {
      
      const response = await fetch("/api/admin/membership_plan/new", {
        method : 'POST',
        body : JSON.stringify({
          userId : session?.user.id,
          name : data.name.trim(),
          description : data.description.replace(/\s+/g, ' ').trim(),
          features : data.features.filter(Boolean),
          price : data.price,
          durationUnit : data.durationUnit
        })
        
      })
      const resdata = await response.json();

      console.log("latest" , resdata)

      // Update memplan array with the new plan data
      setmemplan(prevMemplan => [...prevMemplan, resdata]);

     
    } catch (error) {
      console.log(error)
    } finally{
      setSubmitting(false);
     setData({
      name: "",
      description: "",
      features: [],
      durationUnit: "",
      price: "",
    })
    }
  }

  return (
    <div className="w-full h-full flex  gap-2">
      <div className='overflow-y-auto flex-1 px-2'>
        <Form
          head={""}
          data={data}
          type={"Create Membership Plan"}
          setData={setData}
          submitting={submitting}
          handleSubmit={CreateMembership}
        />
      </div>

     
<MembershipPlanContainer memplan={memplan} setmemplan={setmemplan}/>

    </div>
  )
}

export default MembershipPlans
