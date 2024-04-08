import Member from "@models/member";
import Trainer from "@models/trainer";
import User from "@models/users";
import { assignTrainerToMember } from "@utils/assignTrainer";
import { connectToDb } from "@utils/conntectToDb";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET);

const webhookHandler = async (req) => {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // const idempotencyKey = req.headers.get("Idempotency-Key"); // Get idempotency key from request headers
    // console.log("webhook idempotency", idempotencyKey);
    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err ? err.message : "Unknown Error";

      if (err) console.log(err);
      console.log("❌ Error Message :", errorMessage);

      return NextResponse.json(
        {
          error: {
            message: `Webhook Error : ${errorMessage}`,
          },
        },
        { status: 400 }
      );
    }

    //successfully constructed event.

    console.log("✅ Success", event.id);

    const subscription = event.data.object;
    const subscriptionId = subscription.id;

    switch (event.type) {
      case "invoice.paid":
        if (subscription.billing_reason == "subscription_create") {
          const subscription_id = subscription["subscription"];
          const payment_intent_id = subscription["payment_intent"];
          const payment_intent = await stripe.paymentIntents.retrieve(
            payment_intent_id
          );

          try {
            await stripe.subscriptions.update(subscription_id, {
              default_payment_method: payment_intent.payment_method,
            });

            try {
              console.log("subscription creating");
              await connectToDb();
              const user = await User.findOne({
                stripeCustomerId: subscription.customer,
              });
              user.isActiveMember = true;
              const subscribedUser = await user.save();
              const assignTrainer = JSON.parse(
                await assignTrainerToMember(user._id)
              );

              console.log("webhook trainer", assignTrainer);
              const member = await Member.create({
                user: user._id,
                subscriptionId: subscription_id,
                assignedTrainer: assignTrainer._id,
              });

              const trainer = await Trainer.findByIdAndUpdate(
                assignTrainer._id,
                {
                  $push: { assigned_members: user._id },
                },
                { new: true }
              );
              return NextResponse.json({ subscribedUser }, { status: 200 });
            } catch (error) {
              console.log("webhook error", error);
            }

            console.log(
              "Default payment method set for subscription:" +
                payment_intent.payment_method
            );
          } catch (err) {
            console.log(err);
            console.log(
              `⚠️  Failed to update the default payment method for subscription: ${subscription_id}`
            );
          }
        }
        break;

      case "customer.subscription.created":
        break;

      case "customer.subscription.deleted":
        await connectToDb();
        const user = await User.findOne({
          stripeCustomerId: subscription.customer,
        });
        user.isActiveMember = false;
        await user.save();
        break;

      default:
        console.warn(`🤷‍♂️ unhandled event type: ${event.type}`);
        break;
    }

    // Return a response to acknowledge receipt of the event.
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({
      error: {
        message: "Method not Allowed.",
      },
    });
  }
};

export { webhookHandler as POST };
