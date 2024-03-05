'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const params = useSearchParams();
  const clientSecret = params.get("payment_intent");
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        if (!clientSecret) {
          setMessage('Error: Payment Intent Client Secret is missing.');
          return;
        }
        
        const res = await fetch(`/api/stripe/paymnet-intent/${clientSecret}`,{
          method : 'POST'
        });

        const {paymentIntent} = await res.json();

        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Success! Payment received.');
            break;
      
          case 'processing':
            setMessage("Payment processing. We'll update you when payment is received.");
            break;
      
          case 'requires_payment_method':
            setMessage('Payment failed. Please try another payment method.');
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            break;
      
          default:
            setMessage('Something went wrong.');
            break;
        }
      } catch (error) {
        console.error('Error retrieving PaymentIntent:', error);
        setMessage('Error retrieving PaymentIntent. Please try again later.' + error.message);
      }
    };

    fetchPaymentIntent();
  }, [clientSecret]);

  return (
    <div className="h-full w-full flex-center">
      <h1 className="text-4xl">{message}</h1>
    </div>
  );
};

export default Page;
