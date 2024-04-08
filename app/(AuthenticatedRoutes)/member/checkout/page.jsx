"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionForm from "@components/StripeComponents/SubscriptionForm";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useMemo } from "react";
import Loader from "@components/UiComponents/Loader";
import { Label } from "@components/ui/label";
import { Card, CardContent } from "@components/ui/card";
import { getProduct } from "@utils/getProduct";

const stripePromise = loadStripe(process.env.stripe_public_key);

const SubscribePage = () => {
  const params = useSearchParams();
  const priceId = params.get("priceId");
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const product = JSON.parse(await getProduct(priceId));
      setProductDetails(product);
    };
    fetchProduct();
  }, []);

  const options = {
    mode: "subscription",
    amount: Number(productDetails?.price * 100), // Convert price to smallest currency unit
    currency: "inr",
  };

  return (
    <div className="h-full min-w-full flex flex-col lg:flex-row  bg-background py-4">
      <div className=" lg:flex-1 border-r w-full pt-6 px-2 lg:px-8">
        <Suspense fallback={<Loader />}>
          <Card>
            <CardContent className="flex items-center py-8 gap-4">
              <div className="text-center text-3xl font-semibold relative before:content-['SELECTED_PLAN'] before:text-sm  before:text-gray-500 before:absolute before:top-[-10px]">
                {productDetails?.name}
              </div>
              <div className="text-center text-3xl font-semibold relative before:content-['PRICE'] before:text-sm  before:text-gray-500 before:absolute before:top-[-10px]">
                {productDetails?.price}
              </div>
            </CardContent>
          </Card>
        </Suspense>
      </div>

      <div className="flex-1">
        {stripePromise && productDetails && (
          <Elements stripe={stripePromise} options={productDetails && options}>
            <SubscriptionForm priceId={priceId} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default SubscribePage;
