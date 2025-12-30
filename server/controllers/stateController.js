import EventRegistration from "../models/eventRegistration.js";

const SIGNUP_LIMIT = 500;

export const stateCheck = async (req, res) => {
    try {
        const total = await EventRegistration.countDocuments();

        res.json({
            totalRegistrations: total,
            limit: SIGNUP_LIMIT,
            remaining: Math.max(SIGNUP_LIMIT - total, 0),
            status: total >= SIGNUP_LIMIT ? "CLOSED" : "OPEN",
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch stats" });
    }
}