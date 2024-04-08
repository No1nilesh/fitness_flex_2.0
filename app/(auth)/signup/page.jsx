"use client";
import { CardWrapper } from "@components/AuthComponents/card-wrapper";
import Form from "@components/AuthComponents/Form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@components/UiComponents/Loader";
import { useMultipleStepFrom } from "@Hooks/useMultipleStepFrom";
import Link from "next/link";
import { Button } from "@components/ui/button";
import UserForm from "@components/AuthComponents/userForm";
import SurveyForm from "@components/AuthComponents/surveyForm";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SignUp = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  //Credential Part
  const [submitting, setSubmitting] = useState(false);
  const [endSubmit, setEndSubmit] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    goal: "",
    fitnessLevel: "",
    focusAreas: [],
    workoutFrequency: "",
    availability: [],
  });

  // console.log(formData);
  const { steps, currentStepIndex, step, next, back } = useMultipleStepFrom([
    <UserForm data={formData} setFormData={setFormData} />,
    <SurveyForm data={formData} setFormData={setFormData} />,
  ]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      if (session?.user.role == "admin") {
        router.replace("/admin/dashboard");
      } else if (session?.user.role == "trainer") {
        router.replace("/trainer/dashboard");
      } else {
        router.replace("/member");
      }
    }
  }, [sessionStatus, router]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (currentStepIndex !== steps.length - 1) return next();

    if (!formData.email || !formData.name || !formData.password) {
      setError("Must provide all credentials");
    }
    try {
      setError("");
      setSubmitting(true);

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
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
        router.replace("/login");
        console.log("user registered");
      } else {
        const errorData = await res.json();
        setError(errorData.error);
        setSubmitting(false);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  if (sessionStatus == "loading") {
    return <Loader />;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex flex-col items-center">
        <div className="flex gap-4">
          <span className={`w-40 h-1 rounded-md bg-primary`}></span>
          <span
            className={`w-40 h-1 rounded-md bg-destructive transition-colors ${
              currentStepIndex === 1 && "bg-primary"
            }`}
          ></span>
        </div>
        <CardWrapper showSocial={true}>
          <form onSubmit={handleFormSubmit}>
            {step}

            <div className="flex justify-between mt-4">
              {currentStepIndex !== 0 && (
                <Button type="button" onClick={() => back()}>
                  <ChevronLeft />
                </Button>
              )}

              <Button disabled={submitting ? true : false}>
                {currentStepIndex === steps.length - 1 ? (
                  submitting ? (
                    "submitting"
                  ) : (
                    "Finish"
                  )
                ) : (
                  <ChevronRight />
                )}
              </Button>
            </div>
          </form>
        </CardWrapper>
        <Link
          className="text-primary text-lg hover:underline mt-4 absolute bottom-2 right-6"
          href={"/trainer_register"}
        >
          Trainer Registration
        </Link>
      </div>
    )
  );
};

export default SignUp;
