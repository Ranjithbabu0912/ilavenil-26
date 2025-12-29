import express from "express";
import { markAttendanceByQR } from "../controllers/qrAttendanceController.js";

const router = express.Router();

router.post("/attendance/scan/:token", markAttendanceByQR);

export default router;