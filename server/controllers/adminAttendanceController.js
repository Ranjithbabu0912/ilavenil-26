import connectDB from "../config/db.js";
import Attendance from "../models/Attendance.js";
import EventRegistration from "../models/eventRegistration.js";

export const markAttendance = async (req, res) => {
    try {
        // 🔥 CRITICAL FOR VERCEL
        await connectDB();

        const {
            registrationId,
            name,
            email,
            event,
            status,
            markedBy
        } = req.body;

        // 🔥 VALIDATION
        if (!registrationId || !status) {
            return res.status(400).json({
                message: "Missing registrationId or status",
            });
        }

        if (!["PRESENT", "ABSENT"].includes(status)) {
            return res.status(400).json({
                message: "Invalid attendance status",
            });
        }

        // 🔥 Ensure registration exists
        const reg = await EventRegistration
            .findById(registrationId)
            .maxTimeMS(5000);

        if (!reg) {
            return res.status(404).json({
                message: "Registration not found",
            });
        }

        // 🔥 Prevent duplicate attendance
        const alreadyMarked = await Attendance
            .findOne({ registrationId })
            .maxTimeMS(5000);

        if (alreadyMarked) {
            return res.status(400).json({
                message: "Attendance already marked",
            });
        }

        // 🔥 Create attendance
        await Attendance.create({
            registrationId,
            name: name || reg.name,
            email: email || reg.email,
            event: event || reg.events?.primary,
            status,
            markedVia: "QR_ADMIN",
            markedBy
        });

        res.json({
            success: true,
            message: `Marked ${status} by ${markedBy}`,
        });

    } catch (err) {
        console.error("🔥 ATTENDANCE CONTROLLER ERROR:", err);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
