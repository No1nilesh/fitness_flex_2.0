import { Input } from "@components/ui/input";
import React from "react";
import FromWrapper from "./from-wraper";
import { Label } from "@components/ui/label";
const UserForm = ({ setFormData, data }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <FromWrapper header={"User Details"}>
      <Label>Name</Label>
      <Input
        type="text"
        name="name"
        onChange={handleChange}
        value={data.name}
        required
        placeholder="eg : Name"
      />

      <Label> Email</Label>
      <Input
        type="email"
        onChange={handleChange}
        name="email"
        value={data.email}
        required
        placeholder="eg : ambani@gmail.com"
      />
      <Label> Password</Label>
      <Input
        type="password"
        placeholder="*********"
        onChange={handleChange}
        value={data.password}
        name="password"
        required
      />
    </FromWrapper>
  );
};

export default UserForm;
