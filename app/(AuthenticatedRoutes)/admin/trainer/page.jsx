"use client";
import { useState, useEffect } from "react";
import TrainerCard from "@app/(AuthenticatedRoutes)/admin/trainer/TrainerCard";
import { DataTable } from "@components/UiComponents/data-table";
import { columns } from "./columns";
const Trainer = () => {
  const [trainerData, setTrainerData] = useState([]);

  useEffect(() => {
    const fetchTrainer = async () => {
      const res = await fetch("/api/admin/trainers");
      const data = await res.json();
      setTrainerData(data);
    };

    fetchTrainer();
  }, []);

  const handleUpdateTrainerStatus = (trainerId, newValue) => {
    // Update the trainer object in the state
    setTrainerData((prevTrainers) =>
      prevTrainers.map((trainer) =>
        trainer._id === trainerId ? { ...trainer, verified: newValue } : trainer
      )
    );
  };

  const handleDelete = async (trainerId) => {
    const hasConfirmed = confirm("Are you sure ?");
    if (hasConfirmed) {
      const res = await fetch(`/api/admin/trainers/${trainerId}`, {
        method: "DELETE",
      });

      const cdata = trainerData.filter((trainer) => trainer._id !== trainerId);
      setTrainerData(cdata);
    }
  };

  const handleDeleteSelected = async (selectedIds) => {
    console.log(selectedIds);
    const hasConfirmed = confirm("Are you sure ?");
    if (hasConfirmed) {
      try {
        await Promise.all(
          selectedIds.map(async (id) => {
            const res = await fetch(`/api/admin/trainers/${id}`, {
              method: "DELETE",
            });

            if (!res.ok) {
              console.error(`failed to delete row with id: ${id}`);
            }

            const updatedTrainerData = trainerData.filter(
              (trainer) => !selectedIds.includes(trainer._id)
            );
            setTrainerData(updatedTrainerData);
          })
        );
      } catch (error) {
        console.error("Error occurred while deleting rows:", error);
      }
    }
  };

  // const handleDeleteWithCheck=async()=>{

  // }

  return (
    <div className=" rounded-md">
      {/* <h1 className=" text-3xl text-center py-2 w-full xl:hidden fixed top-0 bg-primary-foreground drop-shadow-sm text-primary">
        Trainers
      </h1> */}
      {/* <TrainerTable
        handleDelete={handleDelete}
        handleUpdateTrainerStatus={handleUpdateTrainerStatus}
        trainerData={trainerData}
      /> */}
      <div className="max-w-full md:max-w-[76rem] h-full w-screen  px-2 table-container mt-10 md:mt-0">
        <DataTable
          columns={columns(handleUpdateTrainerStatus, handleDeleteSelected)}
          data={trainerData}
          setTrainerData={setTrainerData}
        />
      </div>

      {/* <div className="md:hidden grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mx-2 mt-14">
        <TrainerCard
          trainerData={trainerData}
          handleDelete={handleDelete}
          handleUpdateTrainerStatus={handleUpdateTrainerStatus}
        />
      </div> */}
    </div>
  );
};

export default Trainer;

// Trainer Verification Select Button
export const TrainerVerificationButton = ({ trainer, onUpdate }) => {
  const handleStatusChange = async (trainerId, newValue) => {
    console.log(trainerId);
    console.log(newValue);

    try {
      const res = await fetch(`/api/admin/trainers/${trainerId}`, {
        method: "PATCH",
        body: JSON.stringify({
          verifiedOption: newValue,
        }),
      });

      if (res.ok) {
        // Update the trainer object in the parent component with the new value
        onUpdate(trainerId, newValue);
      } else {
        console.error("Failed to update trainer status");
      }
    } catch (error) {
      console.error("Error occurred while updating trainer status:", error);
    }
  };

  return (
    <select
      value={trainer?.verified ? "verified" : "not_verified"}
      onChange={(e) =>
        handleStatusChange(trainer._id, e.target.value === "verified")
      }
      className="block w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="verified">Yes</option>
      <option value="not_verified">No</option>
    </select>
  );
};
