import Loader from "@components/UiComponents/Loader";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { useState } from "react"; // Import useState
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UpdatePlans = ({ memPlans, planId }) => {
  const [selectedPlan, setSelectedPlan] = useState(planId || ""); // State to store selected plan
  const { data: session } = useSession();
  const router = useRouter();

  const handleRadioChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedPlan(selectedValue); // Update selected plan
  };

  // Function to handle checkout
  const handleCheckout = async () => {
    console.log(selectedPlan);
    router.push(`/member/checkout?operation=update&priceId=${selectedPlan}`);
  };

  return (
    <Card className="py-4 px-2 flex-1 flex flex-col gap-2">
      {memPlans?.map((plan) => (
        <Card
          key={plan._id}
          className={`flex-1  ${
            selectedPlan === plan.planId ? "border-green-400 bg-gray-100" : ""
          }`}
        >
          <label className="cursor-pointer size-full flex items-center relative">
            <input
              type="radio"
              name="plan"
              onChange={handleRadioChange}
              checked={selectedPlan === plan.planId}
              value={plan.planId}
              className="mx-2 invisible"
            />
            <CardContent className="p-0">
              <div className="">
                <span className="text-2xl font-semibold">{plan.name}</span>
              </div>
              <div className="">
                <span className="text-gray-500">
                  ₹{plan.price}/
                  <span className="text-sm">{plan.durationUnit}</span>
                </span>
              </div>
            </CardContent>
            {plan.planId === planId && (
              <Badge
                className={`absolute right-2 text-sm bg-transparent  hover:bg-transparent ${
                  session?.user.isActiveMember
                    ? "text-green-500"
                    : "text-destructive"
                }`}
              >
                {session?.user.isActiveMember ? "active" : "expired"}
              </Badge>
            )}
          </label>
        </Card>
      ))}

      <Button
        disabled={selectedPlan === planId && session?.user.isActiveMember}
        onClick={handleCheckout}
        className="w-full"
      >
        Update
      </Button>
    </Card>
  );
};

export default UpdatePlans;
