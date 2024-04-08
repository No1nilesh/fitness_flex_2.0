import User from "@models/users";
import { connectToDb } from "@utils/conntectToDb";
import { isAdmin } from "@utils/isAdmin";
import { NextResponse } from "next/server";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import Member from "@models/member";
export async function DELETE(req, { params }) {
  isAdmin();
  try {
    await connectToDb();

    // const user = await User.findByIdAndDelete(params.id);
    await Member.deleteOne({ user: params.id });
    await authOptions.adapter.deleteUser(params.id);
    return new NextResponse("User Deleted Successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
