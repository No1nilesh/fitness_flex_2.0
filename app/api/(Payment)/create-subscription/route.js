import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { authOptions } from "../../auth/[...nextauth]/route";
const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(req) {
  try {
    const { priceId } = await req.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET);
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: {
            code: "no-access",
            message: "You are not signed in.",
          },
        },
        { status: 401 }
      );
    }

    const subscription = await stripe.subscriptions.create({
      customer: session?.user.stripeCustomerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
    });

    if (subscription.pending_setup_intent !== null) {
      return NextResponse.json({
        type: "setup",
        clientSecret: subscription.pending_setup_intent.client_secret,
      });
    } else {
      return NextResponse.json({
        type: "payment",
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 }
    );
  }
}
