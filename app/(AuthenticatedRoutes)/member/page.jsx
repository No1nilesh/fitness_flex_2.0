"use client"
import { useSession} from 'next-auth/react'
import { useState, useEffect } from 'react';
import MembershipCard from '@components/member/MembershipCard';
import Loader from '@components/Loader';
const Member = () => {
 
  const {data : session, update, status : sessionStatus} = useSession();
  const [memplans, setMemplans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (sessionStatus === 'authenticated' && !isInitialized) {
      update(); // Refresh session from database on first load
      setIsInitialized(true);
    }
  }, [sessionStatus, isInitialized, setIsInitialized, update]);



  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        const res = await fetch("/api/membership_plans");
        const data = await res.json();
        setMemplans(data);
      } catch (error) {
        console.error("Error fetching membership plans:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchMembershipPlans();
  }, []);

  if(loading){
    return <Loader/>
  }
  

  return (
    <div className='h-full flex flex-col items-center'>
   <h1 className='small_head_text blue_gradient mt-4'>Welcome To Fitness Flex</h1>
     {session?.user.isActiveMember ? <>
      show content
     </> 
     : 
     <>
     <p className='text-2xl font-semibold desc'>It looks like you don't have an active membership plan at the moment. Don't worry, we're here to help you get started on your fitness journey</p>
     <div className="flex justify-center gap-20 mt-5">
          {memplans.map((plan) => (
            <MembershipCard key={plan._id} plan={plan} />
          ))}
        </div>
     </>
     
     }
    </div>
  )
}

export default Member
