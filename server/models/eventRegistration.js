import mongoose from "mongoose";
import crypto from "node:crypto";

const eventRegistrationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },

        contact: { type: Number, required: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        collegeName: { type: String, required: true },

        discipline: { type: String, required: true },
        collegeCity: { type: String, required: true },

        year: { type: String, required: true },

        teamName: {
            type: String,
            default: "Solo",
            trim: true,
        },

        events: {
            primary: { type: String, required: true },
            secondary: { type: String, default: null },
        },

        // 🔥 ONLINE vs ONSPOT
        mode: {
            type: String,
            enum: ["ONLINE", "ONSPOT"],
            default: "ONLINE",
        },

        // 🔥 REGISTRATION STATUS
        status: {
            type: String,
            enum: ["NOT_PAID", "APPROVED", "REJECTED"],
            default: "NOT_PAID",
        },

        // 🔥 WHO REGISTERED (ADMIN EMAIL)
        registeredBy: {
            type: String,
            trim: true,
            lowercase: true,
            default: null, // null for ONLINE
        },

        payment: {
            method: {
                type: String,
                enum: ["UPI", "CASH"],
                required: true,
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
            rejectedAt: Date,
            retryCount: { type: Number, default: 0 },
            lastRetriedAt: Date,
            paidAt: Date,
        },

        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            default: null,
        },

        qrToken: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    { timestamps: true }
);

// 🔐 Indexes
eventRegistrationSchema.index(
    { "payment.utr": 1 },
    { unique: true, sparse: true }
);

eventRegistrationSchema.index(
    { email: 1, "events.primary": 1 },
    { unique: true }
);

// 🎟️ Auto QR token
eventRegistrationSchema.pre("save", function () {
    if (!this.qrToken) {
        this.qrToken = crypto.randomBytes(16).toString("hex");
    }
});

export default mongoose.model("EventRegistration", eventRegistrationSchema);
