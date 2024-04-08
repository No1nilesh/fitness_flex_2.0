"use server";

import Member from "@models/member";

export async function getMember(userId) {
  try {
    const member = await Member.findOne({ user: userId });
    // if (!member) throw new Error("Member not found with this Id");
    return JSON.stringify(member);
  } catch (error) {
    console.error("Error occurred while fetching member:", error);
    return null;
  }
}
