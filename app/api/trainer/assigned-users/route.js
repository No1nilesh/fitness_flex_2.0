import { authOptions } from "@app/api/auth/[...nextauth]/route";
import Trainer from "@models/trainer";
import User from "@models/users";
import { connectToDb } from "@utils/conntectToDb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session) {
    return new NextResponse(null, { status: 401 }); // User is not authenticated
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== "trainer") {
    return new NextResponse(null, { status: 403 }); // User is authenticated but does not have the right permissions
  }

  try {
    connectToDb();
    const assigned_members = await Trainer.findOne({
      userId: session?.user.id,
    }).populate({
      path: "assigned_members",
      model: User,
      select: "name email isActiveMember stripeCustomerId",
    });

    if (!assigned_members)
      return NextResponse.json(
        { message: "Trainer not found with this id" },
        { status: 404 }
      );

    return NextResponse.json({ assigned_members }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
