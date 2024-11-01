import dbConnect from "@/utils/dbConnect";
import Ticket from "@/models/Ticket";
import { protect } from "@/middlewares/authMiddleware";

export default async function handler(req, res) {
  await dbConnect(); // Connect to MongoDB

  if (req.method === "POST") {
    return bookTicket(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

// Book a Ticket (Protected)
async function bookTicket(req, res) {
  try {
    await protect(req, res); // Ensure user is authenticated
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const ticket = new Ticket({ eventId, userId: req.user._id });
    await ticket.save();
    
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
