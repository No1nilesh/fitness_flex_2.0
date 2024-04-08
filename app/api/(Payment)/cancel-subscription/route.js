import { isLogedIn } from "@utils/isLogedIn";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET);
export async function POST(req) {
  isLogedIn();
  try {
    const { subscriptionId } = await req.json();
    const deleteSubscription = await stripe.subscriptions.cancel(
      subscriptionId
    );

    return NextResponse.json(
      { success: true, deleteSubscription },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server error", success: false },
      { status: 500 }
    );
  }
}
