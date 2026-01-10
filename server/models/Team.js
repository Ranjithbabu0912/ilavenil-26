// models/Team.js
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        event: {
            type: String,
            required: true,
        },

        teamName: {
            type: String,
            required: true,
            trim: true,
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "EventRegistration",
            },
        ],

        maxSize: {
            type: Number,
            default: 5, 
        },
    },
    { timestamps: true }
);

// 🔒 Prevent duplicate teams per event
teamSchema.index({ event: 1, teamName: 1 }, { unique: true });

export default mongoose.model("Team", teamSchema);
