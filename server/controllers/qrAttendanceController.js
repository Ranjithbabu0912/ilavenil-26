import EventRegistration from "../models/eventRegistration.js";
import Attendance from "../models/Attendance.js";

export const markAttendanceByQR = async (req, res) => {
    try {
        const { token } = req.params;

        const reg = await EventRegistration.findOne({ qrToken: token });

        if (!reg) {
            return res.status(400).json({ message: "Invalid QR code" });
        }

        if (reg.payment.status !== "APPROVED") {
            return res.status(403).json({ message: "Payment not approved" });
        }

        // 🔥 DUPLICATE CHECK
        const attendance = await Attendance.findOne({
            registrationId: reg._id,
        });

        if (attendance) {
            return res.json({
                alreadyMarked: true,
                status: attendance.status,
                participant: {
                    name: reg.name,
                    email: reg.email,
                    event: reg.events?.primary,
                },
            });
        }

        // ✅ NOT MARKED YET → allow admin decision
        res.json({
            alreadyMarked: false,
            participant: {
                registrationId: reg._id,
                name: reg.name,
                email: reg.email,
                event: reg.events?.primary,
            },
        });
    } catch (err) {
        console.error("QR SCAN ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};
