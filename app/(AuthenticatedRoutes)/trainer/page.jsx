"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TabComponent from "@components/UiComponents/Tabs";
import Students from "./Students";
import Schedule from "./Schedule";
const TrainerDashboard = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session, update, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated" && !isInitialized) {
      update();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const tabs = [
    {
      label: "Schedule",
      Component: <Schedule />,
    },
    {
      label: "Students",
      Component: <Students />,
    },
  ];

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <div className="text-4xl font-bold  text-gray-500 justify-start mt-6 md:my-2">
        Trainer Dashboard
      </div>
      <div className="space-y-2 ">
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
          <div className="rounded-xl  bg-card text-card-foreground "></div>
          <div className="rounded-xl  bg-card text-card-foreground "></div>
          <div className="rounded-xl  bg-card text-card-foreground "></div>
          <div className="rounded-xl  bg-card text-card-foreground "></div>
        </div> */}

        <TabComponent tabs={tabs} defaultValue={"Schedule"} />
        {/* <div className="rounded-md  bg-card text-card-foreground  col-span-4"></div>
          <div className="max-w-[76rem] h-full w-screen md:w-full md:max-h-96 table-container col-span-3 ">
            <DataTable columns={columns()} data={assignedMemberData} />
          </div> */}
      </div>
    </div>
  );
};

export default TrainerDashboard;
