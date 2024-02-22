'use client'
import { useSession } from "next-auth/react"

const AdminDashboard = () => {
  const { data: session } = useSession();
  
  return (
    <div className="w-full h-full ">
    <div className="text-center small_head_text blue_gradient ">Welcome {session?.user.name}</div>
    </div>
  )
}

export default AdminDashboard
