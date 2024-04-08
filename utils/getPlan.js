"use server";

import MembershipPlan from "@models/membershipPlans";

export async function getPlan(planId) {
  console.log(planId);
  try {
    const Plan = await MembershipPlan.findOne({ stripeProductId: planId });
    // if (!member) throw new Error("Member not found with this Id");

    return JSON.stringify(Plan);
  } catch (error) {
    console.error("Error occurred while fetching member:", error);
    return null;
  }
}
