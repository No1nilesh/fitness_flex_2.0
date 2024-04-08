"use client";
import SurveyForm from "@components/AuthComponents/surveyForm";
import { Button } from "@components/ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@components/ui/card";
const Survey = () => {
  const { data: session, update } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    goal: "",
    fitnessLevel: "",
    focusAreas: [],
    workoutFrequency: "",
    availability: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/survey/${session?.user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: formData.goal,
          fitnessLevel: formData.fitnessLevel,
          focusAreas: formData.focusAreas,
          workoutFrequency: formData.workoutFrequency,
          availability: formData.availability,
        }),
      });

      if (res.ok) {
        setSubmitting(false);
        const form = e.target;
        form.reset();
        update();
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.error);
        setSubmitting(false);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <Card className=" max-w-[500px] flex-1 h-fit p-4  drop-shadow-md">
      <form className="" onSubmit={handleSubmit}>
        <SurveyForm data={formData} setFormData={setFormData} />
        <Button
          type="submit"
          disabled={submitting ? true : false}
          className="mt-2 w-full"
        >
          {submitting ? "submitting..." : "submit"}
        </Button>
        <span className="text-destructive">{error}</span>
      </form>
    </Card>
  );
};

export default Survey;
