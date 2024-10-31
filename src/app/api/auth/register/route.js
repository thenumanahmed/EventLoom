import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import generateToken from "@/lib/generateToken";

export async function POST(req) {
    await connectDB();
    
    try {
        const { name, email, password } = await req.json();
        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        return NextResponse.json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser._id),
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
