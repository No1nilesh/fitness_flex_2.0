import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { authOptions } from "../../auth/[...nextauth]/route";
const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(req) {
  try {
    const { priceId } = await req.json();

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

    const subscriptions = await stripe.subscriptions.list({
      customer: session?.user.stripeCustomerId,
      status: "active",
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No active subscription found for the customer",
      });
    }

    // Update subscription to new plan with proration
    const subscription = await stripe.subscriptions.update(
      subscriptions.data[0].id,
      {
        items: [
          {
            id: subscriptions.data[0].items.data[0].id,
            deleted: true,
          },
          {
            price: priceId,
          },
        ],
        payment_behavior: "default_incomplete",
        proration_behavior: "none", // Specify proration behavior
        expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
      }
    );

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
