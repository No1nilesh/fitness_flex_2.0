"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MembershipPlanCard from "./membership-plan-card";
import MembershipPlanModal from "./MembershipPlanModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDialog } from "@ZustandStore/useDialog";
import useMembershipPlanFormDataStore from "@ZustandStore/useMembershipPlanFormDataStore";

const MembershipPlanContainer = ({ memPlan, setMemPlan }) => {
  // fetching the Membership data from the api.
  const { onClose, onOpen } = useDialog();
  const setMemPlanFormData = useMembershipPlanFormDataStore(
    (state) => state.setMemPlanFormData
  );

  useEffect(() => {
    const fetchMemPlan = async () => {
      const response = await fetch("/api/admin/membership_plan");
      const data = await response.json();
      setMemPlan(data);
    };
    fetchMemPlan();
  }, []);

  // Handling the Edit Membership part

  const handleEdit = async (plan) => {
    setMemPlanFormData(plan);
    onOpen();
  };

  // Delete Membership
  const handleDelete = async (plan) => {
    const hasConfirmed = confirm("Are you sure ?");
    if (hasConfirmed) {
      const res = await fetch(`/api/admin/membership_plan/${plan._id}`, {
        method: "DELETE",
      });

      const filteredData = memPlan.filter((p) => p._id !== plan._id);
      setMemPlan(filteredData);
    }
  };

  return (
    <>
      <MembershipPlanModal memPlan={memPlan} setMemPlan={setMemPlan} />
      <div className="membership_lists flex-1 bg-background rounded-md  md:overflow-hidden w-full max-h-[100%] ">
        <h1 className="small_head_text text-center py-3 w-full z-40 bg-background drop-shadow-sm sticky top-0">
          Membership Plans
        </h1>
        <ScrollArea className="h-full w-full rounded-md border p-4">
          <div className="flex flex-col items-center gap-2 mb-16">
            {memPlan?.map((plan) => {
              return (
                <MembershipPlanCard
                  key={plan._id}
                  plan={plan}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default MembershipPlanContainer;
