import express from "express";
import { checkPaymentStatus, createRegistration } from "../controllers/eventController.js";

const router = express.Router();

// POST: Event Registration
router.post("/register", createRegistration);

router.post("/check-status", checkPaymentStatus);

export default router;
