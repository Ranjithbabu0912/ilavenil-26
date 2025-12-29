import EventRegistration from "../models/eventRegistration.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const getMyRegistration = async (req, res) => {
    try {
        // 🔥 This ALWAYS exists if authenticated
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // 🔥 Fetch user details from Clerk
        const user = await clerkClient.users.getUser(userId);

        const email = user.emailAddresses[0].emailAddress;

        const reg = await EventRegistration.findOne({ email });

        if (!reg) {
            return res.status(404).json({ message: "No registration found" });
        }

        res.json(reg);
    } catch (err) {
        console.error("MY REGISTRATION ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};
