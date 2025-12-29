import Attendance from "../models/Attendance.js";
import EventRegistration from "../models/eventRegistration.js";

export const markAttendance = async (req, res) => {
    try {
        // console.log("ATTENDANCE BODY:", req.body);

        const {
            registrationId,
            name,
            email,
            event,
            status,
        } = req.body;

        // 🔥 VALIDATION (most common crash cause)
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
        const reg = await EventRegistration.findById(registrationId);
        if (!reg) {
            return res.status(404).json({
                message: "Registration not found",
            });
        }

        // 🔥 Prevent duplicate attendance
        const alreadyMarked = await Attendance.findOne({
            registrationId,
        });

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
        });

        res.json({
            success: true,
            message: `Marked ${status}`,
        });
    } catch (err) {
        console.error("🔥 ATTENDANCE CONTROLLER ERROR:", err);
        res.status(500).json({
            message: "Server error",
        });
    }
};
