import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const user = await getUserFromToken(req);
    if (!user || user._id !== params.userId)
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    const events = await Event.find({ createdBy: params.userId }).populate("createdBy", "name email");

    if (events.length === 0)
      return NextResponse.json({ message: "No events found" }, { status: 404 });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
