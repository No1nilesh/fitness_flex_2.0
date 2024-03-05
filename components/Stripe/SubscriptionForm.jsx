// components/SubscriptionForm.js
'use client'
import { useState } from "react";
import { CardElement, useStripe, useElements, PaymentElement, AddressElement} from "@stripe/react-stripe-js";

const SubscriptionForm = ({ customerId, priceId, clientSecret }) => {
  const [loading, setLoading] = useState(false);
  const [errormessage, setErrormessage] = useState('')
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    console.log(clientSecret)

    const {error} = await stripe.confirmPayment({
      elements,
      confirmParams : {
        return_url : 'http://localhost:3000/member/payment-sucess'
      }
    }) 

    if(error){
      setErrormessage(error.message)
      setLoading(false)
    }

    setTimeout(() => {
      setLoading(false)
    }, 5000);

  };

  return (
    <div className="flex-center h-full w-full">
      <form onSubmit={handleSubmit} className="w-96 h-96">
       <PaymentElement/>
       <AddressElement 
       onChange={(event) => {
  if (event.complete) {
    // Extract potentially complete address
    const address = event.value.address;
  }
}} 
        options={{mode : 'billing', allowedCountries : ['IN']}}
  
       />
       <div className="Error">{errormessage}</div>
        <button
          className="bg-indigo-600 rounded-md p-2 text-white w-full mt-4"
          type="submit"
          disabled={!stripe || loading}
        >
          {loading ? "Processing..." : "Subscribe"}
        </button>

      </form>
    </div>
  );
};

export default SubscriptionForm;
