//retrieve subscription and show details
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  try {
    const subscription = await stripe.subscriptions.list({
      customer: session?.user.stripeCustomerId,
      status: "active",
    });

    if (subscription.data.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No active subscription, Your Plan is Expired!",
      });
    }

    const invoice = await stripe.invoices.retrieve(
      subscription.data[0].latest_invoice
    );
    if (!invoice)
      NextResponse.json(
        {
          success: false,
          message: "No active invoice, Your Plan is Expired!",
        },
        { status: 404 }
      );
    return NextResponse.json(
      { success: true, subscription, invoice },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
