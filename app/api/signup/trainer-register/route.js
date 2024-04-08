import User from "@models/users";
import { connectToDb } from "@utils/conntectToDb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Trainer from "@models/trainer";

export async function POST(req) {
  try {
    await connectToDb();
    const { name, email, password, experience, specialties, availability } =
      await req.json();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "User with this Email already Exists" },
        { status: 500 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "trainer",
    });
    if (user) {
      const trainer = await Trainer.create({
        userId: user._id,
        email,
        specialties,
        experience,
        availability,
      });
    }
    return NextResponse.json(
      { message: "Trainer Created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error Occured While Registering" },
      { status: 500 }
    );
  }
}
