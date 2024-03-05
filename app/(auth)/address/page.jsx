'use client'
import { useState } from "react";
import AddressForm from "@components/auth/AddressForm";

const page = () => {
  const [formData, setFormData] = useState({
    address: "",
    country: "",
    state: "",
    district: "",
    pincode: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send data to server)
    console.log("Form submitted with data:", formData);
    setSubmitting(true);
    // Example: Submit data to backend API
    // axios.post('/api/submit', formData)
    //   .then(response => {
    //     console.log('Submission successful');
    //     setSubmitting(false);
    //   })
    //   .catch(error => {
    //     console.error('Submission failed:', error);
    //     setSubmitting(false);
    //   });
  };

  return (
    
      <AddressForm
        head="Address Form"
        type="Submit"
        data={formData}
        setData={setFormData}
        submitting={submitting}
        handleSubmit={handleSubmit}
      />
    
  );
};

export default page;
