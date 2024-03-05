import MembershipPlan from "@models/membershipPlans";
import { connectToDb } from "@utils/conntectToDb";
import { NextResponse } from "next/server";


export async function GET(req){

    try {

        await connectToDb();

        const memPlan = await MembershipPlan.find({}).populate('creator');
        if(!memPlan){
            return new NextResponse("No Plan Exists", {status : 404});
        }

        return new NextResponse(JSON.stringify(memPlan), {status : 201});
        
    } catch (error) {
        return new NextResponse("Failed to Load MembershipPlans", {status : 500});
    }

}


