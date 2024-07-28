// pages/api/redis/[action].js
import { NextResponse } from "next/server";
import { redisClient } from "../createClient";

async function handler(req, { params }) {
  const { action } = params;

  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");
    if (action === "get") {
      console.log(key);
      const value = await redisClient.get(key);
      return NextResponse.json({ key, value }, { status: 200 });
    } else if (action === "set") {
      const { key, value } = await req.json();
      await redisClient.set(key, value);
      return NextResponse.json(
        { message: `Key ${key} set to ${value}` },
        { status: 200 }
      );
    } else if (action === "chat") {
      const value = await redisClient.lrange(key, 0, -1);
      return NextResponse.json({ key, value }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Redis error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST };
