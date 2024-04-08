import { authOptions } from "@app/api/auth/[...nextauth]/route";
import Trainer from "@models/trainer";
import User from "@models/users";
import { connectToDb } from "@utils/conntectToDb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session) {
    return new NextResponse(null, { status: 401 }); // User is not authenticated
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== "admin") {
    return new NextResponse(null, { status: 403 }); // User is authenticated but does not have the right permissions
  }

  const { verifiedOption } = await req.json();
  const trainerId = params.id;
  console.log("trainerId", trainerId);
  try {
    const trainer = await Trainer.findById({ _id: trainerId });
    trainer.verified = verifiedOption;
    const updatedData = await trainer.save();

    return NextResponse.json(
      { message: "Trainer updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to Update Verification status" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
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
    const trainer = await Trainer.findOne({ _id: params.id });

    if (trainer) {
      await User.findByIdAndDelete(trainer.userId);
      await Trainer.findByIdAndDelete(params.id);
    }
    return new NextResponse("Trainer Deleted Successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
