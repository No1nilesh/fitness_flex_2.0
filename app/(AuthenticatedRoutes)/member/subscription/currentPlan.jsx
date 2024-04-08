import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Label } from "@components/ui/label";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const CurrentPlan = ({ planName, invoicePdfUrl, subData }) => {
  const { toast } = useToast();
  const { data: session, update } = useSession();
  const router = useRouter();
  const downloadInvoice = () => {
    // Get the URL of the invoice PDF
    const pdfUrl = invoicePdfUrl;
    // Open the PDF in a new tab/window for download
    window.open(pdfUrl, "_blank");
  };

  const handleCancelSubscription = async () => {
    try {
      const validate = confirm("Are you sure you want to cancel the plan?");
      if (!validate) return;
      const res = await fetch(`/api/cancel-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subData.data[0].id,
        }),
      });

      const { success } = await res.json();

      if (success) {
        update();
        router.replace("/member");
        toast({
          title: "Subscription Canceled Successfully",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error,
      });
    }
  };

  return (
    <Card className="p-4 flex-1">
      <CardContent className="flex flex-col gap-2 p-0">
        <div className="flex items-center border rounded-md py-4 px-3">
          <Label className="text-lg">Current Plan</Label>
          <span className="ml-2 text-gray-700">{planName}</span>
        </div>

        <div className="flex items-center border rounded-md py-4 px-3">
          <Label className="text-lg">Status</Label>
          <span
            className={`ml-2 text-gray-700 ${
              session?.user.isActiveMember
                ? "text-green-500"
                : "text-destructive"
            }`}
          >
            {session?.user.isActiveMember ? "Active" : "Expired"}
          </span>
        </div>

        <div className="flex items-center border rounded-md py-4 px-3">
          <Label className="text-lg">Start Date</Label>
          <span className="ml-2 text-gray-700">
            {new Date(
              subData.data[0].current_period_start * 1000
            ).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center border rounded-md py-4 px-3">
          <Label className="text-lg">End Date</Label>
          <span className="ml-2 text-gray-700">
            {new Date(subData.data[0].current_period_end * 1000).toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            className="bg-destructive/90 hover:bg-destructive"
            onClick={handleCancelSubscription}
          >
            Cancel Subscription
          </Button>
          <Button onClick={downloadInvoice}>Download Invoice</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPlan;
