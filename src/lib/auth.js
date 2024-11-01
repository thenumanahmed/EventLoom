import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export const getUserFromToken = async (req) => {
  await connectDB();
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch (error) {
    return null;
  }
};
