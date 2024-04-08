import { authOptions } from "@app/api/auth/[...nextauth]/route";
import Survey from "@models/survey";
import User from "@models/users";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { goal, fitnessLevel, focusAreas, workoutFrequency, availability } =
      await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(null, { status: 401 }); // User is not authenticated
    }

    const survey = await Survey.create({
      user: params.id,
      goal,
      fitnessLevel,
      focusAreas,
      workoutFrequency,
      availability,
    });

    if (survey) {
      const user = await User.findById(params.id);
      user.isNewUser = false;
      user.save();
    }

    return NextResponse.json(
      { message: "Survey Created successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Some Error Occurred While Creating Survey", error },
      { status: 500 }
    );
  }
}
