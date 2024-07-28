"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import MembershipCard from "@components/MemberComponents/MembershipCard";
import Loader from "@components/UiComponents/Loader";
import Survey from "@components/MemberComponents/Survey";
import { useMembershipPlan } from "@Hooks/useMembershipPlan";
import { useSocket } from "@components/SocketProvider";
const Member = () => {
  const { data: session, update, status: sessionStatus } = useSession();
  const { memPlans, loading } = useMembershipPlan();
  const socket = useSocket();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (sessionStatus === "authenticated" && !isInitialized) {
      update();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("member:join", () => {
  //       console.log("user connected");
  //     });
  //   }
  // }, [socket]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-full w-full">
      {session?.user.isActiveMember ? (
        <ActiveMemberPage />
      ) : (
        <InActiveMemberPage memPlans={memPlans} />
      )}
    </div>
  );
};

export default Member;

export const ActiveMemberPage = () => {
  return (
    <div className="w-[90%] mx-auto  bg-secondary px-2 py-4 rounded-lg  mt-2 flex-1">
      <div className="text-center text-3xl mb-2 text-primary ">Trainers</div>
      {/* <Slider /> */}
    </div>
  );
};

export const InActiveMemberPage = ({ memPlans }) => {
  const { data: session } = useSession();
  return session?.user.isNewUser ? (
    <div className="size-full flex-center">
      <Survey />
    </div>
  ) : (
    <div className="mt-2">
      <h1 className="text-3xl md:text-4xl  font-bold text-center blue_gradient">
        Welcome To Fitness Flex
      </h1>
      <p className="text-lg md:text-xl text-gray-700 text-center mb-8 ">
        It looks like you don't have an active membership plan at the moment.
        Don't worry, we're here to help you get started on your fitness journey
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {memPlans.map((plan) => (
          <MembershipCard key={plan._id} plan={plan} />
        ))}
      </div>
    </div>
  );
};
