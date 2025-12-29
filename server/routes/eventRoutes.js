import express from "express";
import {
  createRegistration,
  checkPaymentStatus,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/register", createRegistration);
router.post(
  "/check-status",
  checkPaymentStatus
);
export default router;
