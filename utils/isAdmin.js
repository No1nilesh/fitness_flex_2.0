import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  // Check if the user is authenticated
  if (!session) {
    return new NextResponse(null, { status: 401 }); // User is not authenticated
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== "admin") {
    return new NextResponse(null, { status: 403 }); // User is authenticated but does not have the right permissions
  }
};
