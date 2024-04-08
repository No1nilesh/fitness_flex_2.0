import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectToDb } from "@utils/conntectToDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import MembershipPlan from "@models/membershipPlans";
import Stripe from "stripe";

export async function POST(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET);

  const session = await getServerSession(authOptions);
  // Check if the user is authenticated
  if (!session) {
    return new NextResponse(null, { status: 401 }); // User is not authenticated
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== "admin") {
    return new Response(null, { status: 403 }); // User is authenticated but does not have the right permissions
  }
  const { userId, name, description, features, price, durationUnit } =
    await req.json();
  console.log("userId", userId, name);

  try {
    const product = await stripe.products.create({
      name: name,
      description: description,
    });

    const Plan = await stripe.prices.create({
      product: product.id, // ID of the product created above
      unit_amount: parseInt(price) * 100,
      currency: "inr",
      recurring: {
        interval: durationUnit, // Change this as per your requirement
      },
    });

    await connectToDb();
    const mem_plan = new MembershipPlan({
      planId: Plan.id,
      stripeProductId: product.id,
      creator: userId,
      name,
      description,
      features,
      price,
      durationUnit,
    });

    await mem_plan.save();

    return new NextResponse(JSON.stringify(mem_plan), { status: 201 });
  } catch (error) {
    console.log(error);

    return new NextResponse("Failed to create membership plan", {
      status: 500,
    });
  }
}
