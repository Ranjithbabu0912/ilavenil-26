import express from "express";
import {
  createRegistration,
  checkPaymentStatus,
} from "../controllers/eventController.js";
import { attachUser } from "../middlewares/attachUser.js";

const router = express.Router();

router.post("/register", createRegistration);

router.post(
  "/check-status",
  attachUser,
  checkPaymentStatus
);
export default router;
