"use client";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const Page = () => {
  const router = useRouter();
  const { update } = useSession();
  const [message, setMessage] = useState("");
  const params = useSearchParams();
  const payment_intent = params.get("payment_intent");
  const setup_intent = params.get("setup_intent");
  const afterPaymentSuccess = () => {
    setMessage("Payment Successful");
    update();
    setTimeout(() => {
      router.push("/member");
    }, 5000);
  };

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        if (!payment_intent && !setup_intent) {
          setMessage("Error: Payment Intent Client Secret is missing.");
          return;
        }

        const res = await fetch(
          `/api/stripe/paymnet-intent/${setup_intent || payment_intent}?type=${
            payment_intent ? "payment_intent" : "setup_intent"
          }`,
          {
            method: "POST",
          }
        );

        const { paymentIntent } = await res.json();

        switch (paymentIntent.status) {
          case "succeeded":
            afterPaymentSuccess();
            break;

          case "processing":
            setMessage(
              "Payment processing. We'll update you when payment is received."
            );
            break;

          case "requires_payment_method":
            setMessage("Payment failed. Please try another payment method.");
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            break;

          default:
            setMessage("Something went wrong.");
            break;
        }
      } catch (error) {
        console.error("Error retrieving PaymentIntent:", error);
        setMessage(
          "Error retrieving PaymentIntent. Please try again later." +
            error.message
        );
      }
    };

    fetchPaymentIntent();
  }, [payment_intent, setup_intent]);

  return (
    <div className="h-full w-full flex-center">
      <h1 className="text-4xl">Payment Successful</h1>
      <div>{message}</div>
    </div>
  );
};

export default Page;
