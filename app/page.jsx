'use client'
import { useEffect } from "react";
import "@styles/home.css";
import Spline from "@splinetool/react-spline";
import Link from "next/link";
import Banner from "@components/member/Banner";
import MembershipCard from "@components/member/MembershipCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@components/Loader";

export default function Home() {
  const router = useRouter();
  const {data : session , status : sessionStatus} = useSession()
  useEffect(() => {
    if(sessionStatus === "authenticated"){
      if(session?.user.role == "admin"){
        router.replace("/admin/dashboard")
      }else if(session?.user.role == "trainer"){
        router.replace("/trainer/dashboard")
      }else if(session?.user.role == "user"){
        router.replace("/member")
      }
    }else{
      router.replace("/")
    }
  }, [sessionStatus , router])

  if(sessionStatus == "loading"){
    return <Loader/>
  }

  return (
    <>
      <div className=" container mx-auto px-4 py-8 ">
        <Banner />

        <div className="flex justify-center gap-20 mt-10">
        <MembershipCard/>
        <MembershipCard/>
        <MembershipCard/>
        </div>
      </div>
    </>
  );
}
