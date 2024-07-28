"use client";
import Form from "@components/UiComponents/Form";
import { useState } from "react";
import { useSession } from "next-auth/react";
import MembershipPlanContainer from "./membership-plan-container";
import { IoIosCreate } from "react-icons/io";
import Modal from "@components/UiComponents/Modal";

const MembershipPlans = () => {
  const [memPlan, setMemPlan] = useState([]);
  const { data: session } = useSession();

  // Creating MemPlans
  const [data, setData] = useState({
    name: "",
    description: "",
    features: [],
    durationUnit: "",
    price: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const CreateMembership = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/membership_plan/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          name: data.name.trim(),
          description: data.description.replace(/\s+/g, " ").trim(),
          features: data.features.filter(Boolean),
          price: data.price,
          durationUnit: data.durationUnit,
        }),
      });
      const plan = await response.json();

      // Update memPlan array with the new plan data
      setMemPlan((prevMemPlan) => [...prevMemPlan, plan]);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      setData({
        name: "",
        description: "",
        features: [],
        durationUnit: "",
        price: "",
      });
    }
  };

  const handleCancel = () => {
    setData({
      name: "",
      description: "",
      features: [],
      durationUnit: "",
      price: "",
    });
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-16 sm:gap-2">
      {/* Create button don't show  in desktop  */}
      <CreateButton />
      <div className=" hidden md:block md:overflow-y-auto flex-1 md:px-2">
        <Form
          head={""}
          data={data}
          type={"Create Membership Plan"}
          setData={setData}
          submitting={submitting}
          handleSubmit={CreateMembership}
          handleCancel={handleCancel}
        />
      </div>

      <MembershipPlanContainer memPlan={memPlan} setMemPlan={setMemPlan} />
    </div>
  );
};

export default MembershipPlans;

// Create button for Mobile

const CreateButton = () => {
  const [showModal, setShowModal] = useState(false);
  const handleCreateModal = () => {
    setShowModal(true);
  };
  const { data: session } = useSession();
  const [memPlan, setMemPlan] = useState([]);
  const [data, setData] = useState({
    name: "",
    description: "",
    features: [],
    durationUnit: "",
    price: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const CreateMembership = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/membership_plan/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          name: data.name.trim(),
          description: data.description.replace(/\s+/g, " ").trim(),
          features: data.features.filter(Boolean),
          price: data.price,
          durationUnit: data.durationUnit,
        }),
      });
      const data = await response.json();

      // Update memPlan array with the new plan data
      setMemPlan((prevMemPlan) => [...prevMemPlan, data]);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      setData({
        name: "",
        description: "",
        features: [],
        durationUnit: "",
        price: "",
      });

      setShowModal(false);
    }
  };

  const handleBack = () => {
    setShowModal(false);
  };

  return (
    <>
      <IoIosCreate
        onClick={handleCreateModal}
        className=" md:hidden fixed z-50 text-purple-800 text-2xl right-2 top-4 cursor-pointer "
      />
      <Modal isOpen={showModal}>
        <Form
          head={""}
          data={data}
          type={"Create Membership Plan"}
          setData={setData}
          submitting={submitting}
          handleSubmit={CreateMembership}
          handleCancel={handleBack}
          bgColor={"bg-white/90"}
        />
      </Modal>
    </>
  );
};

// const CreateMembershipPlanModal=()=>{
//   return(

//   )
// }
