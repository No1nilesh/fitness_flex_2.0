import { authOptions } from "@app/api/auth/[...nextauth]/route";
import Trainer from "@models/trainer";
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
  if (session.user.role !== "admin") {
    return new NextResponse(null, { status: 403 }); // User is authenticated but does not have the right permissions
  }

  try {
    await connectToDb();
    const trainer = await Trainer.find({})
      .populate("userId", "-password")
      .exec();

    if (!trainer)
      return NextResponse.json(
        { message: "No Trainer Found" },
        { status: 404 }
      );

    return NextResponse.json(trainer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to Find Trainers" },
      { status: 500 }
    );
  }
}
