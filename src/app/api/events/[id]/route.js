import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { getUserFromToken } from "@/lib/auth";

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });

    if (event.createdBy.toString() !== user._id.toString())
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    const updatedEvent = await Event.findByIdAndUpdate(params.id, await req.json(), { new: true });
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });

    if (event.createdBy.toString() !== user._id.toString())
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    await Event.deleteOne({ _id: params.id });
    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
