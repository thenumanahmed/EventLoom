import dbConnect from "@/utils/dbConnect";
import Ticket from "@/models/Ticket";
import { protect } from "@/middlewares/authMiddleware";

export default async function handler(req, res) {
  await dbConnect(); // Connect to MongoDB

  if (req.method === "GET") {
    return getUserTickets(req, res);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

// Get Tickets for a Specific User (Protected)
async function getUserTickets(req, res) {
  try {
    await protect(req, res); // Ensure user is authenticated

    if (req.query.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const tickets = await Ticket.find({ userId: req.query.userId }).populate("eventId");

    if (!tickets.length) {
      return res.status(404).json({ message: "No tickets found for this user" });
    }

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
