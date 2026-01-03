import express from "express";
import {
  createRegistration,
  checkPaymentStatus,
  getAllRegistration,
} from "../controllers/eventController.js";


const router = express.Router();

router.post("/register", createRegistration);

router.post("/check-status", checkPaymentStatus);

router.get("/all-registration", getAllRegistration);

export default router;
