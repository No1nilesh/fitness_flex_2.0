import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TrainerVerificationButton } from "@app/(AuthenticatedRoutes)/admin/trainer/page";

const TrainerCard = ({
  trainerData,
  handleUpdateTrainerStatus,
  handleDelete,
}) => {
  return trainerData?.map((trainer) => {
    return (
      <Card className="border-l-4 border-l-primary" key={trainer._id}>
        <CardHeader>
          <CardTitle className="text-center">{trainer.userId.name}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col justify-center gap-2">
          <Label className="flex gap-2">
            Email
            <p className="text-black/70">{trainer.email}</p>
          </Label>

          <Label className="flex gap-2">
            Experience
            <p className="text-black/70">{trainer.experience + " Years"}</p>
          </Label>
          <Label className="flex gap-2">
            Hourly Rate
            <p className="text-black/70">{trainer.hourlyRate || "N/A"}</p>
          </Label>
          <Label className="flex gap-2">
            Specialties
            <p className="text-black/70">{trainer.specialties.join(", ")}</p>
          </Label>
          <Label className="flex gap-2">
            Availability
            <p className="text-black/70">{trainer.availability.join(", ")}</p>
          </Label>
          <Label className="flex gap-2 items-center">
            Verified
            <span className="w-20">
              <TrainerVerificationButton
                trainer={trainer}
                onUpdate={handleUpdateTrainerStatus}
              />
            </span>
          </Label>
        </CardContent>
        <CardFooter className="flex justify-center border-t mx-2 py-2">
          <div className="flex-center gap-4  ">
            <p className="font-inter text-sm green_gradient cursor-pointer">
              Edit
            </p>

            <p
              className="font-inter text-sm orange_gradient cursor-pointer"
              onClick={() => handleDelete(trainer._id)}
            >
              Delete
            </p>
          </div>
        </CardFooter>
      </Card>
    );
  });
};

export default TrainerCard;
