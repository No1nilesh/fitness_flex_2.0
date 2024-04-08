import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(req, { params }) {
  const payment_intent = params.id;
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  console.log(type);
  try {
    let paymentIntent;
    if (type === "setup_intent") {
      paymentIntent = await stripe.setupIntents.retrieve(payment_intent);
    } else if (type === "payment_intent") {
      paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
    }

    return NextResponse.json({ paymentIntent }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving PaymentIntent:", error);
    return NextResponse.json(
      { error: "Error retrieving paymentIntent" },
      { status: 500 }
    );
  }
}
