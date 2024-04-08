"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionForm from "@components/StripeComponents/SubscriptionForm";
import { useState, useEffect } from "react";
const stripePromise = loadStripe(process.env.stripe_public_key);

function CheckoutPage({ params }) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    setClientSecret(sessionStorage.getItem("clientSecret"));
  }, [sessionStorage.getItem("clientSecret")]);

  const options = {
    clientSecret: clientSecret,
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
  };
  return (
    <div>
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <SubscriptionForm priceId={priceId} clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}

export default CheckoutPage;
