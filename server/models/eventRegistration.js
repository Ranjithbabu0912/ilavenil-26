import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        contact: { type: Number, required: true },
        email: { type: String, required: true, unique: true },
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
                default: null, // 🔑 not required initially
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
        },
    },
    { timestamps: true }
);

export default mongoose.model(
    "EventRegistration",
    eventRegistrationSchema
);
