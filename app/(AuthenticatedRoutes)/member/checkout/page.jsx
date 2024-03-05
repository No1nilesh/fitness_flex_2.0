"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionForm from "@components/Stripe/SubscriptionForm";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const stripePromise = loadStripe(
  "pk_test_51OojDPSAF8Jk8mcaq475Tvi016VMyuhI3KND82nZL3rboSNKoudKtpnlFJAtoMjSmaN9RjY420mSV6GKxAMiDEup007Jow3Bz9"
);

const SubscribePage = () => {
  const params = useSearchParams();
  const priceId = params.get("planId");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchCreateSub = async () => {
      const res = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const { clientSecret } = await res.json();
      console.log(clientSecret);
      setClientSecret(clientSecret);
    };

    fetchCreateSub();
  }, []);

  const options = {
    clientSecret: clientSecret,
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    }
  };

  return (
    <div className="h-full">
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={options} >
          <SubscriptionForm
            priceId={priceId}
            clientSecret={clientSecret}
          />
        </Elements>
      )}
    </div>
  );
};

export default SubscribePage;
