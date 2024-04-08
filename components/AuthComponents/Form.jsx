"use client";
import SearchableSelect from "@components/UiComponents/SearchableSeclect";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

const Form = ({
  handleSubmit,
  headerLabel,
  error,
  submitting,
  handleChange,
  setFormData,
  submitted,
  setSubmitted,
  endSubmit,
}) => {
  const pathname = usePathname();

  // Select input Specialties
  const [selectedSpecialtiesData, setSelectedSpecialtiesData] = useState([]);
  // Define a function to receive selected options data
  const handleSpecialtiesSelect = (selectedOptions) => {
    setSelectedSpecialtiesData(selectedOptions);
  };

  const Specialties = [
    "Weight Loss",
    "Weight Gain",
    "Diet Plans",
    "Power Lifting",
    "Heavy Workouts",
  ];

  // SelectInput Availability
  const [selectAvailabilityData, setSelectAvailability] = useState([]);

  //Define a function to receive selected options data,
  const handleAvailabilitySelect = useMemo(
    () => (selectOptions) => {
      setSelectAvailability(selectOptions);
    },
    [setSelectAvailability]
  );

  const Availability = ["morning", "evening", "afternoon", "night"];

  useEffect(() => {
    setFormData((prevformdata) => ({
      ...prevformdata,
      specialties: [...selectedSpecialtiesData],
    }));

    setFormData((prevfromdata) => ({
      ...prevfromdata,
      availability: [...selectAvailabilityData],
    }));
  }, [selectedSpecialtiesData, selectAvailabilityData]);

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col gap-2"
    >
      <div className="small_head_text  text-center">{headerLabel}</div>
      {pathname === "/signup" || pathname === "/trainer_register" ? (
        <label>
          Name
          <Input
            type="text"
            className=""
            name="name"
            onChange={handleChange}
            required
            placeholder="eg : Name"
          />
        </label>
      ) : null}

      <label>
        {" "}
        Email
        <Input
          type="email"
          className=""
          onChange={handleChange}
          name="email"
          required
          placeholder="eg : ambani@gmail.com"
        />
      </label>
      <label>
        {" "}
        Password
        <Input
          type="password"
          placeholder="*********"
          onChange={handleChange}
          name="password"
          required
        />
      </label>
      {/* trainer Registration inputs */}
      {pathname === "/trainer_register" && (
        <>
          {/* <label>Photo
       <input type="file" className="form_input" 
       onChange={handleChange} 
       name="experience"
        required
       />
       </label> */}

          <label>
            {" "}
            Experience
            <Input
              type="number"
              className=""
              onChange={handleChange}
              name="experience"
              required
              placeholder="Value in Years eg: 2 or 3"
            />
          </label>
          <label>Specialties</label>
          <SearchableSelect
            option={Specialties}
            onSelect={handleSpecialtiesSelect}
            label={"Specialties"}
            submitted={submitted}
            setSubmitted={setSubmitted}
          />
          <label>Availability</label>
          <SearchableSelect
            option={Availability}
            onSelect={handleAvailabilitySelect}
            label={"Availability"}
            submitted={submitted}
            setSubmitted={setSubmitted}
          />
        </>
      )}
      {error && <span className="text-red-500 text-sm">{error}</span>}
      <Button
        disabled={submitting ? true : false}
        className={`${endSubmit ? "block" : "hidden"}`}
      >
        {submitting ? "signing in..." : "Submit"}
      </Button>
    </form>
  );
};

export default Form;
