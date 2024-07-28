"use client";
import { useEffect } from "react";
import "@styles/home.css";
import Loader from "@components/UiComponents/Loader";
import Banner from "@components/MemberComponents/Banner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      if (session?.user.role == "admin") {
        router.replace("/admin/dashboard");
      } else if (session?.user.role == "trainer") {
        router.replace("/trainer/dashboard");
      } else if (session?.user.role == "user") {
        router.replace("/member/dashboard");
      }
    } else {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  if (session && sessionStatus === "loading") {
    return <Loader />;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className=" container mx-auto px-4 py-8">
        <Banner />
      </div>
    )
  );
}
