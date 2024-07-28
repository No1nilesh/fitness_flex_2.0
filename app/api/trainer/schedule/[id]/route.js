import { authOptions } from "@app/api/auth/[...nextauth]/route";
import Schedule from "@models/schedule";
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
  if (session.user.role !== "trainer") {
    return new NextResponse(null, { status: 403 }); // User is authenticated but does not have the right permissions
  }

  const { title, start, end, task_done, meeting } = await req.json();
  const scheduleId = params.id;
  connectToDb();
  try {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule)
      return NextResponse.json(
        { message: "No Schedule found" },
        { status: 404 }
      );
    schedule.title = title;
    schedule.start = start;
    schedule.end = end;
    schedule.task_done = task_done;
    schedule.meeting = meeting;
    const updatedSchedule = await schedule.save();
    return NextResponse.json(
      { success: true, updatedSchedule },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong", success: false },
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
  if (session.user.role !== "trainer") {
    return new NextResponse(null, { status: 403 }); // User is authenticated but does not have the right permissions
  }

  const scheduleId = params.id;
  try {
    await connectToDb();

    await Schedule.findByIdAndDelete(scheduleId);

    return NextResponse.json({
      success: true,
      message: "Schedule Deleted Successfully!",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
