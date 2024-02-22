import User from "@models/users";
import { connectToDb } from "@utils/conntectToDb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
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
    const exists = await User.find({ role: "user" });
    if (!exists)
      return NextResponse.json({ message: "No user Found" }, { status: 404 });

    return NextResponse.json(exists, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error Occured While loading users" },
      { status: 500 }
    );
  }
}
