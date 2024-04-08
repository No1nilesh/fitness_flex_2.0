"use client";
import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@components/ui/button";
import { useSearchParams } from "next/navigation";

const SubscriptionForm = () => {
  const params = useSearchParams();
  const priceId = params.get("priceId");
  const operation = params.get("operation");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        handleError(submitError);
        return;
      }

      const res = await fetch(`/api/${operation}-subscription`, {
        method: "POST",
        body: JSON.stringify({ priceId: priceId }),
      });

      const { type, clientSecret } = await res.json();
      const confirmIntent =
        type === "setup" ? stripe.confirmSetup : stripe.confirmPayment;

      const { error } = await confirmIntent({
        elements,
        clientSecret,
        confirmParams: {
          return_url: "http://localhost:3000/member/payment-success",
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }

      setTimeout(() => {
        setLoading(false);
      }, 5000);

      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center flex-col h-full w-full ">
      <h1 className=" px-10 text-lg">Payment Details</h1>
      <form onSubmit={handleSubmit} className=" lg:w-96 h-96">
        <PaymentElement />
        <div className="Error text-destructive">*{errorMessage}</div>
        <Button className="w-full" type="submit" disabled={!stripe || loading}>
          {loading ? "Processing..." : "Subscribe"}
        </Button>
        <p>{errorMessage}</p>
      </form>
    </div>
  );
};

export default SubscriptionForm;
