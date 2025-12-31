import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        registrationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
        },
        name: String,
        email: String,
        event: String,
        status: {
            type: String,
            enum: ["PRESENT", "ABSENT"],
            required: true,
        },
        markedVia: String,
        markedBy: {
            type: String, // 🔥 Admin Name
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
