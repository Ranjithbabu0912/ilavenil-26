import mongoose from "mongoose";
import crypto from "node:crypto";


const eventRegistrationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        contact: { type: Number, required: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        collegeName: { type: String, required: true },
        discipline: { type: String, required: true },
        year: { type: String, required: true },

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
            utr: {
                type: String,
                trim: true,
            },
            screenshot: {
                type: String,
                default: null,
            },
            status: {
                type: String,
                enum: ["NOT_PAID", "PENDING", "APPROVED", "REJECTED"],
                default: "NOT_PAID",
            },
            rejectionReason: {
                type: String,
                default: null,
            },
        },

        qrToken: {
            type: String,
            unique: true,
            sparse: true, // allow null before approval
        },
    },
    { timestamps: true }
);

// ✅ SINGLE SOURCE OF TRUTH FOR INDEX
eventRegistrationSchema.index(
    { "payment.utr": 1 },
    { unique: true, sparse: true }
);

// Optional: prevent same email registering twice for same event
eventRegistrationSchema.index(
    { email: 1, "events.primary": 1 },
    { unique: true }
);

eventRegistrationSchema.pre("save", async function () {
    if (!this.qrToken) {
        this.qrToken = crypto.randomBytes(16).toString("hex");
    }
});



export default mongoose.model(
    "EventRegistration",
    eventRegistrationSchema
);
