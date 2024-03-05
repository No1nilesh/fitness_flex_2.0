import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(req, {params}){

   const payment_intent = params.id;

   try {
    
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    return NextResponse.json({paymentIntent}, {status: 200});
   } catch (error) {
    console.error('Error retrieving PaymentIntent:', error);
    return NextResponse.json({error : 'Error retrieveing paymentIntent' },{status : 500})
   }

}