import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { getUserFromToken } from "@/lib/auth"; // For authentication

export async function POST(req) {
  await connectDB();
  try {
    const { title, description, date, location, price } = await req.json();
    const user = await getUserFromToken(req); // Authenticate user

    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const event = new Event({ title, description, date, location, price, createdBy: user._id });
    await event.save();

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  try {
    const events = await Event.find().populate("createdBy", "name email");
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
