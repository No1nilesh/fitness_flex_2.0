import Form from "@components/UiComponents/Form";
import Modal from "@components/UiComponents/Modal";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomDialog } from "@components/UiComponents/custom-dialog";
import { useDialog } from "@ZustandStore/useDialog";
import useMembershipPlanFormDataStore from "@ZustandStore/useMembershipPlanFormDataStore";
const MembershipPlanModal = ({ setMemPlan }) => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { onOpen, onClose } = useDialog();
  const { memPlan } = useMembershipPlanFormDataStore();

  useEffect(() => {
    setData(memPlan);
  }, [memPlan]);

  const [data, setData] = useState({
    name: "",
    description: "",
    durationValue: "",
    features: [],
    durationUnit: "",
    price: "",
    stripeProductId: "",
    planId: "",
  });

  const UpdateMembershipPlan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/membership_plan/${memPlan._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name: data.name.trim(),
            description: data.description.replace(/\s+/g, " ").trim(),
            features: data.features.filter(Boolean),
            price: data.price,
            durationValue: data.durationValue,
            durationUnit: data.durationUnit,
            stripeProductId: data.stripeProductId,
            planId: data.planId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update membership plan");
      }

      // Assuming the response from the server contains the updated membership plan data
      const updatedPlan = await response.json();
      // Update the memPlan state with the updated membership plan
      setMemPlan((prevMemPlan) => {
        const updatedIndex = prevMemPlan.findIndex(
          (plan) => plan._id === updatedPlan._id
        );
        if (updatedIndex !== -1) {
          // Replace the existing plan with the updated plan
          const updatedMemPlan = [...prevMemPlan];
          updatedMemPlan[updatedIndex] = updatedPlan;
          return updatedMemPlan;
        } else {
          // If the updated plan is not found, return the previous state
          return prevMemPlan;
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      router.push("/admin/membership_plans");
      onClose();
    }
  };

  return (
    <CustomDialog>
      <Form
        data={data}
        head={"Update Membership Plan"}
        type={"Update Membership Plan"}
        setData={setData}
        submitting={submitting}
        handleSubmit={UpdateMembershipPlan}
        handleCancel={(e) => {
          e.preventDefault();
          onClose();
          router.back();
        }}
      />
    </CustomDialog>
  );
};

export default MembershipPlanModal;
