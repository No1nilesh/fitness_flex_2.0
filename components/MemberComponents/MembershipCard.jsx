import { HiCheckBadge } from "react-icons/hi2";
import "@styles/mebershipcard.css";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";

const MembershipCard = ({ plan }) => {
  const router = useRouter();

  const handleCreateCheckoutSession = (priceId) => {
    router.push(`/member/checkout?operation=create&priceId=${priceId}`);
  };

  return (
    plan.isActive && (
      <Card className="bg-secondary flex flex-col justify-between">
        <CardHeader className="text-primary">
          <span className="text-4xl font-bold">{plan.name}</span>
          <span className="text-5xl text-secondary-foreground">
            {plan.price}₹
          </span>
        </CardHeader>
        <CardContent className="">
          {plan.description}
          <ul className="lists">
            {plan.features.map((feat, index) => (
              <li className="list" key={index}>
                <HiCheckBadge />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="">
          <Button
            onClick={() => handleCreateCheckoutSession(plan.planId)}
            className="flex-1"
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>
    )
  );
};

export default MembershipCard;
