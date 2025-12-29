import connectDB from "../../server/config/db.js";
import eventRegistration from "../../server/models/eventRegistration.js";

export default async function handler(req, res) {
    try {
        res.setHeader("Access-Control-Allow-Origin", "https://ilavenil-26.vercel.app");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        await connectDB();

        const body =
            typeof req.body === "string" ? JSON.parse(req.body) : req.body;

        const registration = await eventRegistration.findOne({
            email: body.email,
        }).lean();

        return res.status(200).json({
            registered: !!registration,
            paymentStatus: registration?.paymentStatus ?? null,
            registrationId: registration?.registrationId ?? null,
        });
    } catch (err) {
        console.error("CHECK STATUS ERROR:", err);
        return res.status(500).json({ error: err.message });
    }
}
