"use client";
import React, { useMemo } from "react";
import { Input } from "@components/ui/input";
import { useState, useEffect } from "react";
import FromWrapper from "./from-wraper";
import { Label } from "@components/ui/label";
import SearchableSelect from "@components/UiComponents/SearchableSeclect";
const SurveyForm = ({ setFormData, data }) => {
  const [FocusArea, setFocusArea] = useState([]);
  const [Availability, setSelectAvailability] = useState([]);
  const focusArea = [
    "Back",
    "leg",
    "chest",
    "thigh",
    // "abc",
    // "efg",
    // "hij",
    // "klm",
    // "nop",
    // "qrs",
    // "tuv",
    // "wxy",
  ];
  const availability = ["morning", "afternoon", "evening", "night"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: [...FocusArea],
      availability: [...Availability],
    }));
  }, [FocusArea, Availability]);

  const handleFocusAreaSelect = useMemo(
    () => (selectOptions) => {
      setFocusArea(selectOptions);
    },
    [setFocusArea]
  );
  const handleAvailabilitySelect = useMemo(
    () => (selectOptions) => {
      setSelectAvailability(selectOptions);
    },
    [setSelectAvailability]
  );

  return (
    <FromWrapper header={"Survey Form"}>
      <div className="flex flex-col gap-2">
        <Label>Goal</Label>
        <Input
          type="text"
          name="goal"
          value={data.goal}
          onChange={handleChange}
        />

        <div>
          <Label>Fitness Level</Label>
          <Input
            type="text"
            name="fitnessLevel"
            value={data.fitnessLevel}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Workout Frequency</Label>
          <Input
            type="text"
            name="workoutFrequency"
            value={data.workoutFrequency}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Focus Areas</Label>
          <SearchableSelect
            option={focusArea}
            value={data.focusAreas}
            onSelect={handleFocusAreaSelect}
          />
        </div>

        <div>
          <Label>Availability</Label>
          <SearchableSelect
            option={availability}
            value={data.availability}
            onSelect={handleAvailabilitySelect}
          />
        </div>
      </div>
    </FromWrapper>
  );
};

export default SurveyForm;
