'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MembershipPlanCard from './MembershipPlanCard'
import MembershipPlanModal from './MembershipPlanModal';

const MembershipPlanContainer = ({memplan, setmemplan}) => {
    // fetching the Membership data from the api.
  


    useEffect(() => {
        const fetchMemPlan = async () => {
            const response = await fetch('/api/admin/membership_plan');
            const data = await response.json();
            setmemplan(data);
        }
        fetchMemPlan();
    }, [])


    // Handling the Edit Membership part
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get('id');

    const handleModalClose = () => {
        setShowModal(false); // Close the modal
    };

    useEffect(() => {
        if(planId){
            setShowModal(true)
        }
    }, [planId])
    

    const handleEdit = async(plan) => {
        router.push(`/admin/membership_plans?id=${plan._id}`);
    }


    // Delete Membership
    const handleDelete = async(plan)=>{
       const hasconfirmed =  confirm("Are you sure ?");
       if(hasconfirmed){
        const res = await fetch(`/api/admin/membership_plan/${plan._id}`,{
            method : 'DELETE'
          })
      
          const filteredata = memplan.filter((p)=>p._id !== plan._id);
          setmemplan(filteredata);
        }
       }
       


    return (
        <>
            <MembershipPlanModal
            showModal={showModal} 
            setShowModal={setShowModal} 
            onClose={handleModalClose} 
            planId={planId} 
            memplan={memplan}
            setmemplan={setmemplan}
            />
            <div className="membership_lists flex-1 bg-[#ffffff] rounded-md drop-shadow-md overflow-hidden">
                <h1 className='small_head_text text-center blue_gradient py-3 fixed top-0 w-full z-10 bg-white drop-shadow-sm'>Membership Plans</h1>

                <div className="overflow-auto max-h-full mt-14">
                    <div className="flex flex-col items-center gap-2 mt-4 mb-20">
                        {memplan?.map((plan) => {
                            return <MembershipPlanCard 
                            key={plan._id} plan={plan} 
                            showModal={showModal} 
                            setShowModal={setShowModal} 
                            handleEdit={handleEdit} 
                            handleDelete={handleDelete}

                            />;
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MembershipPlanContainer
