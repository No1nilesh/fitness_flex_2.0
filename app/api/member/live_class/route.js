import { authOptions } from "@app/api/auth/[...nextauth]/route";
import Member from "@models/member";
import Schedule from "@models/schedule";
import Trainer from "@models/trainer";
import { connectToDb } from "@utils/conntectToDb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  await connectToDb();

  try {
    const member = await Member.findOne({ user: session.user.id });
    if (!member)
      return NextResponse.json(
        { success: false, message: "You are not a Member" },
        { status: 404 }
      );

    const assignedTrainerId = new ObjectId(member.assignedTrainer);

    const schedule = await Schedule.aggregate([
      {
        $match: {
          trainer: assignedTrainerId,
          start: { $gt: new Date() },
        },
      },
      { $sort: { start: 1 } },
      {
        $lookup: {
          from: "trainers", // The name of the collection containing trainers' details
          localField: "trainer",
          foreignField: "_id",
          as: "trainerDetails",
        },
      },
      { $unwind: "$trainerDetails" },
      {
        $addFields: {
          trainerEmail: "$trainerDetails.email", // Add trainer's email from the joined collection
        },
      },
      {
        $project: {
          meeting: 1,
          roomId: 1,
          title: 1,
          start: 1,
          end: 1, // Include the trainer's email in the output
        },
      },
    ]);
    // Fetch the trainer's details
    const trainer = await Trainer.findById(assignedTrainerId).select("email");
    const trainerEmail = trainer ? trainer.email : null;

    return NextResponse.json(
      { success: true, schedule, trainerEmail },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
