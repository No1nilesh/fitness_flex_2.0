import Form from '@components/Form'
import Modal from '@components/Modal'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const MembershipPlanModal = ({setShowModal, showModal, onClose, planId, memplan, setmemplan}) => {

  useEffect(() => {
    const getPlanDetails = async()=>{
      const res = await fetch(`/api/admin/membership_plan/${planId}`)
      const plan = await res.json();
      setData({...plan})
    }
    if(planId) getPlanDetails();
  }, [planId])



  
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  
  const [data, setData] = useState({
    name: "",
    description: "",
    durationValue: "",
    features: [],
    durationUnit: "",
    price: "",
    stripeProductId : "",
    planId : ""
  });


  const UpdateMembershipPlan = async(e) => {
    e.preventDefault();
   setSubmitting(true)
    try {
      const response = await fetch(`/api/admin/membership_plan/${planId}`,{
        method : 'PATCH',
        body : JSON.stringify({
          name : data.name.trim(),
          description : data.description.replace(/\s+/g, ' ').trim(),
          features : data.features.filter(Boolean),
          price : data.price,
          durationValue : data.durationValue,
          durationUnit : data.durationUnit,
          stripeProductId : data.stripeProductId,
          planId : data.planId
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update membership plan');
      }
  
      // Assuming the response from the server contains the updated membership plan data
      const updatedPlan = await response.json();
         // Update the memplan state with the updated membership plan
    setmemplan(prevMemplan => {
      const updatedIndex = prevMemplan.findIndex(plan => plan._id === updatedPlan._id);
      if (updatedIndex !== -1) {
        // Replace the existing plan with the updated plan
        const updatedMemplan = [...prevMemplan];
        updatedMemplan[updatedIndex] = updatedPlan;
        return updatedMemplan;
      } else {
        // If the updated plan is not found, return the previous state
        return prevMemplan;
      }
    });

    } catch (error) {
      console.log(error);
    } finally{
      setSubmitting(false)
       router.push('/admin/membership_plans')
       setShowModal(false)
    }
 
  }


  return (
    <Modal isOpen={showModal} onClose={onClose} >
      <Form
        data={data}
        head={"Update Membership Plan"}
        type={"Update Membership Plan"}
        setData={setData}
        submitting={submitting}
        handleSubmit={UpdateMembershipPlan}
      />
    </Modal>
  )
}

export default MembershipPlanModal
