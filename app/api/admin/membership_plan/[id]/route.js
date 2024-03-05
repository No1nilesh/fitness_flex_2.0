import { authOptions } from "@app/api/auth/[...nextauth]/route";
import MembershipPlan from "@models/membershipPlans";
import { connectToDb } from "@utils/conntectToDb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET)
// to do update the code to sync with stripe product and price //Update Done //DElete done

export async function GET(req, {params}){
    const session = await getServerSession(authOptions);
    // Check if the user is authenticated
    if (!session) {
       return new NextResponse(null, { status: 401 }); // User is not authenticated
   }
   
   // Check if the user has the 'admin' role
   if (session.user.role !== "admin") {
       return new NextResponse(null, { status: 403 }); // User is authenticated but does not have the right permissions
   }

    try {

        await connectToDb();

        const memPlan = await MembershipPlan.findById(params.id).populate('creator');
        if(!memPlan){
            return new NextResponse("No Plan Exists", {status : 404});
        }

        return new NextResponse(JSON.stringify(memPlan), {status : 201});
        
    } catch (error) {
        return new NextResponse("Failed to Load MembershipPlans", {status : 500});
    }

}



export async function PATCH(req, {params}){
    const session = await getServerSession(authOptions);
 // Check if the user is authenticated
 if (!session) {
    return new NextResponse(null, { status: 401 }); // User is not authenticated
}

// Check if the user has the 'admin' role
if (session.user.role !== "admin") {
    return new Response(null, { status: 403 }); // User is authenticated but does not have the right permissions
}

function convertToStripeInterval( durationUnit) {
    if (durationUnit.includes('day')) {
        return 'day';
    } else if (durationUnit.includes('week')) {
        return 'week';
    } else if (durationUnit.includes('month')) {
        return 'month';
    } else if (durationUnit.includes('year')) {
        return 'year';
    } else {
        throw new Error('Invalid duration unit');
    }
}

try {
    connectToDb();
    const {name, description, features, price, durationUnit, isActive, stripeProductId, planId} = await req.json();

    const  exsistingmembershipPlans = await MembershipPlan.findById(params.id);
    if(!exsistingmembershipPlans) return new NextResponse("MembershipPlan not found", {status : 404});

  
    console.log("stripeProductId", stripeProductId)

    const updatedProduct = await stripe.products.update(stripeProductId, {
        name: name,
        description: description
    });
    console.log("Product updated:", updatedProduct);

    // Update the price
    const updatedPrice = await stripe.prices.update(planId, {
        active : false
    });

    const Plan = await stripe.prices.create({
        product: stripeProductId, // ID of the product created above
        unit_amount: parseInt(price)*100, 
        currency: 'inr',
        recurring: { 
            interval: convertToStripeInterval( durationUnit), // Change this as per your requirement
        },
    });
    console.log("Price updated:", updatedPrice);

    exsistingmembershipPlans.name = name;
    exsistingmembershipPlans.description = description;
    exsistingmembershipPlans.features = features;
    exsistingmembershipPlans.price = price;
    exsistingmembershipPlans.durationUnit = durationUnit
    exsistingmembershipPlans.isActive = isActive
    exsistingmembershipPlans.planId = Plan.id
    await exsistingmembershipPlans.save();

    return new NextResponse(JSON.stringify(exsistingmembershipPlans), {status : 200});


} catch (error) {
    console.log("error", error)
    return new NextResponse("Failed to Update Membership Plan", {status : 500});
}
}


export  async function DELETE(req, {params}){
    const session = await getServerSession(authOptions);
    // Check if the user is authenticated
    if (!session) {
       return new NextResponse(null, { status: 401 }); // User is not authenticated
   }
   
   // Check if the user has the 'admin' role
   if (session.user.role !== "admin") {
       return new Response(null, { status: 403 }); // User is authenticated but does not have the right permissions
   }

   try {
    await connectToDb();
    const plan = await MembershipPlan.findById(params.id);
    await stripe.products.update(plan.stripeProductId, {
        active : false
    })
    const memplan = await MembershipPlan.findByIdAndDelete(params.id);
    
    return new NextResponse("MembershipPlan Deleted Successfully", {status : 200});    
   } catch (error) {
    return new NextResponse("Failed to Delete MembershipPlan", {status: 500});
   }
}