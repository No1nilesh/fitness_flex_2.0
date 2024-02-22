'use client'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Member = () => {
  const router = useRouter();
const handleSignOut=()=>{
  signOut({ redirect: false }).then(() => {
    router.push("/"); // Redirect to the dashboard page after signing out
});
}
  return (
    <div>
      <button className='black_btn' onClick={handleSignOut}>Signout</button>
    </div>
  )
}

export default Member
