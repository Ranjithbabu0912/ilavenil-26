import connectDB from "../../server/config/db.js";
import eventRegistration from "../../server/models/eventRegistration.js";

export default async function handler(req, res) {
  /* 🔥 CORS — MUST BE FIRST */
  res.setHeader("Access-Control-Allow-Origin", "https://ilavenil-26.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  /* 🔥 PREFLIGHT */
  if (req.method === "OPTIONS") {
    return res.status(204).end(); // <-- IMPORTANT
  }

  /* 🔥 METHOD GUARD */
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!body?.email) {
      return res.status(400).json({ error: "Email required" });
    }

    const reg = await eventRegistration.findOne({ email: body.email }).lean();

    return res.status(200).json({
      registered: !!reg,
      paymentStatus: reg?.paymentStatus ?? null,
      registrationId: reg?.registrationId ?? null,
    });
  } catch (err) {
    console.error("CHECK STATUS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
