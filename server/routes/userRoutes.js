import express from "express";
import { getMyRegistration } from "../controllers/userRegistrationController.js";
import { clerkProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔥 THIS ROUTE IS REQUIRED
router.get("/my-registration", clerkProtect, getMyRegistration);

export default router;
