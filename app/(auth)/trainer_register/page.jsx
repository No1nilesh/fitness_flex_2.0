"use client";
import Form from "@components/AuthComponents/Form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@components/UiComponents/Loader";
import Link from "next/link";

const SignUp = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      switch (session?.user.role) {
        case "admin":
          router.replace("/admin/dashboard");
          break;
        case "trainer":
          router.replace("/trainer/dashboard");
        default:
          router.replace("/member");
      }
    }
  }, [sessionStatus, router]);

  //Credential Part
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    experience: "",
    specialties: [],
    availability: [],
  });

  // console.log("from data", formData);
  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const ClearFormData = () => {
    setSubmitted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.password) {
      setError("Must provide all credentials");
    }
    try {
      setError("");
      setSubmitting(true);

      const res = await fetch("/api/signup/trainer-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          experience: formData.experience,
          specialties: formData.specialties.filter(Boolean),
          availability: formData.availability.filter(Boolean),
        }),
      });
      if (res.ok) {
        setSubmitting(false);
        const form = e.target;
        form.reset();
        ClearFormData();
        router.replace("/login");
      } else {
        const errorData = await res.json();
        setError(errorData.message);
        setSubmitting(false);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  if (sessionStatus === "loading") {
    return <Loader />;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className=" h-full p-4 ">
        <Form
          headerLabel={"Trainer Registration"}
          handleSubmit={handleSubmit}
          data={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          submitting={submitting}
          error={error}
          // To clear the SearchAbleSelect
          submitted={submitted}
          setSubmitted={setSubmitted}
          endSubmit={true}
        />
      </div>
    )
  );
};

export default SignUp;
