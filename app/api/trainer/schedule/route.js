import { authOptions } from "@app/api/auth/[...nextauth]/route";
import Schedule from "@models/schedule";
import Trainer from "@models/trainer";
import { connectToDb } from "@utils/conntectToDb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
const { v4: uuidv4, v4 } = require("uuid");

export async function POST(req) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session) {
    return new NextResponse(null, { status: 401 }); // User is not authenticated
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== "trainer") {
    return new NextResponse(null, { status: 403 }); // User is authenticated but does not have the right permissions
  }
  await connectToDb();

  const { title, start, end, meeting } = await req.json();

  try {
    const trainer = await Trainer.findOne({ userId: session?.user.id });
    const schedule = await Schedule.create({
      trainer: trainer._id,
      title,
      start,
      end,
      meeting,
      roomId: meeting ? v4() : "",
    });
    return NextResponse.json({ success: true, schedule }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session) {
    return new NextResponse(null, { status: 401 }); // User is not authenticated
  }

  // Check if the user has the 'trainer' role
  if (session.user.role !== "trainer") {
    return new NextResponse(null, { status: 403 }); // User is authenticated but does not have the right permissions
  }
  await connectToDb();
  try {
    const trainer = await Trainer.findOne({ userId: session?.user.id });
    const schedule = await Schedule.find({ trainer: trainer._id });
    return NextResponse.json({ success: true, schedule }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
