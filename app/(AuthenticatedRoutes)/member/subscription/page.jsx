"use client";
// Import required modules
import Loader from "@components/UiComponents/Loader";
import { getPlan } from "@utils/getPlan";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CurrentPlan from "./currentPlan";
import { useMembershipPlan } from "@Hooks/useMembershipPlan";
import UpdatePlans from "./UpdatePlans";
import { Card } from "@components/ui/card";
import { CircleAlert } from "lucide-react";
const Page = () => {
  const { data: session } = useSession();
  const [invoiceSubData, setInvoiceSubData] = useState(null);
  const [subData, setSubData] = useState(null);
  const [invoicePdfUrl, setInvoicePdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [planName, setPlanName] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(false);
  const { memPlans } = useMembershipPlan();

  useEffect(() => {
    const fetchSub = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/member/subscription`);
        const { subscription, invoice, success, message } =
          await response.json();
        setMessage(message);
        if (!success) return;
        setSuccess(success);
        setSubData(subscription);
        setInvoiceSubData(invoice.lines.data[0]);
        setInvoicePdfUrl(invoice.invoice_pdf);
        await getPlanDetails(subscription.data[0].plan.product);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSub();
  }, []);

  const getPlanDetails = async (planId) => {
    try {
      const plan = JSON.parse(await getPlan(planId));
      setPlanName(plan.name);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="p-2">
      <h1 className="text-3xl text-center font-semibold mb-4">
        Subscription Details
      </h1>
      <div className="flex gap-2 flex-col md:flex-row ">
        {success ? (
          <CurrentPlan
            planName={planName}
            invoicePdfUrl={invoicePdfUrl}
            subData={subData}
          />
        ) : (
          <Card className="flex-1 flex flex-col items-center">
            <h1 className="text-2xl text-center p-2">{message}</h1>
            <CircleAlert className="text-destructive size-20 " />
          </Card>
        )}

        <UpdatePlans
          memPlans={memPlans}
          planId={subData?.data[0].plan.id ?? ""}
        />
      </div>
    </div>
  );
};

export default Page;
