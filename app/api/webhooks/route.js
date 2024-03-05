import User from "@models/users";
import { connectToDb } from "@utils/conntectToDb";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET);

const webhookHandler = async (req) => {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err ? err.message : "Unkown Error";

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
        case "customer.subscription.created":
          try {
            console.log("subcription creating")
            await connectToDb();
            const exuser = await User.findOne({stripeCustomerId : subscription.customer});
            exuser.isActiveMember = true;
            exuser.subscriptionId = subscriptionId
           const subscribedUser =  await exuser.save();
           return NextResponse.json({subscribedUser},{status: 201});
          } catch (error) {
            console.log("webhook error", error)
          }
         
            break;
        case "customer.subscription.deleted":
            await connectToDb();
            const exuserr = await User.findOne({stripeCustomerId : subscription.customer});
            exuserr.isActiveMember = false;
            await exuserr.save();
            break;    
    
        default:
            console.warn(`🤷‍♂️ unhandled event type: ${event.type}`);
            break;
    }



// Return a response to acknowledge receipt of the event.
return NextResponse.json({ received: true });


  } catch (error) {
    return NextResponse.json({
        error : {
            message : "Method not Allowed."
        }
    })
  }
};


export { webhookHandler as POST };