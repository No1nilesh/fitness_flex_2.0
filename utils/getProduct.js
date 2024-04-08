"use server";
import MembershipPlan from "@models/membershipPlans";
export async function getProduct(planId) {
  try {
    const product = await MembershipPlan.findOne({ planId: planId });
    if (!product) throw new Error("Plan not found with this Id");
    return JSON.stringify(product);
  } catch (error) {
    console.error("Error occurred while fetching plan:", error);
    return null;
  }
}
