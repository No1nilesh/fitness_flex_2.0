'use client'
import { useEffect, useState } from "react";
import "@styles/home.css";
import Loader from "@components/Loader";
import Banner from "@components/member/Banner";
import MembershipCard from "@components/member/MembershipCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [memplans, setMemplans] = useState([]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      if (session?.user.role == "admin") {
        router.replace("/admin/dashboard");
      } else if (session?.user.role == "trainer") {
        router.replace("/trainer/dashboard");
      } else if (session?.user.role == "user") {
        router.replace("/member");
      }
    } else {
      router.replace("/");
    }
  }, [sessionStatus, router]);


  
  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        const res = await fetch("/api/membership_plans");
        const data = await res.json();
        setMemplans(data);
      } catch (error) {
        console.error("Error fetching membership plans:", error);
      } 
    };

    fetchMembershipPlans();
  }, []);

  if (sessionStatus === "loading") {
    return <Loader />;
  }

  return (
    <>
      <div className=" container mx-auto px-4 py-8">
        <Banner />

        <div className="flex justify-center gap-20 mt-10">
          {memplans.map((plan) => (
            <MembershipCard key={plan._id} plan={plan} />
          ))}
        </div>
      </div>
    </>
  );
}
