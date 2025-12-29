import express from "express";
import { clerkProtect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import { markAttendance } from "../controllers/adminAttendanceController.js";

const router = express.Router();

// 🔥 THIS IS THE MISSING ROUTE
router.post(
    "/attendance",
    adminOnly,
    markAttendance
);

export default router;
