import mongoose from "mongoose";
import crypto from "node:crypto";

const eventRegistrationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },

        // ✅ NEW
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },

        contact: { type: Number, required: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        collegeName: { type: String, required: true },

        // 🔁 discipline → kept for backward compatibility
        discipline: { type: String, required: true },

        // ✅ NEW
        collegeCity: { type: String, required: true },

        year: { type: String, required: true },

        // ✅ NEW (optional)
        teamName: {
            type: String,
            default: null,
            trim: true,
        },

        events: {
            primary: { type: String, required: true },
            secondary: { type: String, default: null },
        },

        payment: {
            method: {
                type: String,
                enum: ["UPI"],
                default: "UPI",
            },
            utr: { type: String, trim: true },
            screenshotUrl: { type: String, default: null },
            screenshotPublicId: { type: String, default: null },
            status: {
                type: String,
                enum: ["NOT_PAID", "PENDING", "APPROVED", "REJECTED"],
                default: "NOT_PAID",
            },
            rejectionReason: { type: String, default: null },
            rejectedAt: {
                type: Date,
                default: null,
            },
            retryCount: {
                type: Number,
                default: 0,
            },
            lastRetriedAt: Date,
        },

        qrToken: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    { timestamps: true }
);

// indexes unchanged
eventRegistrationSchema.index(
    { "payment.utr": 1 },
    { unique: true, sparse: true }
);

eventRegistrationSchema.index(
    { email: 1, "events.primary": 1 },
    { unique: true }
);

eventRegistrationSchema.pre("save", function () {
    if (!this.qrToken) {
        this.qrToken = crypto.randomBytes(16).toString("hex");
    }
});

export default mongoose.model("EventRegistration", eventRegistrationSchema);
