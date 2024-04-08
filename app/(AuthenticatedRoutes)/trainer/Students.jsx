"use client";
import { DataTable } from "@components/UiComponents/data-table";
import { useState, useEffect } from "react";
import { columns } from "./columns";

const Students = () => {
  const [assignedMemberData, setAssignedMemberData] = useState([]);
  useEffect(() => {
    const fetchAssignMember = async () => {
      try {
        const res = await fetch("/api/trainer/assigned-users");
        const { assigned_members } = await res.json();
        setAssignedMemberData(assigned_members.assigned_members);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAssignMember();
  }, []);
  return (
    <div className="space-y-4 ">
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        <div className="rounded-xl  bg-card text-card-foreground "></div>
        <div className="rounded-xl  bg-card text-card-foreground "></div>
        <div className="rounded-xl  bg-card text-card-foreground "></div>
        <div className="rounded-xl  bg-card text-card-foreground "></div>
      </div> */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-7 ">
        <div className="rounded-md  bg-card text-card-foreground  col-span-4"></div>
        <div className="max-w-[76rem] h-full w-screen md:w-full md:max-h-96 table-container col-span-3 ">
          <DataTable columns={columns()} data={assignedMemberData} />
        </div>
      </div>
    </div>
  );
};

export default Students;
