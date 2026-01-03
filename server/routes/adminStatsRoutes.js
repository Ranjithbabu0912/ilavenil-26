import express from "express";
import { stateCheck } from "../controllers/stateController.js";
import { getDailyRegistrationStats } from "../controllers/eventController.js";

const router = express.Router();


router.get("/registration-stats", stateCheck);

router.get("/daily-registration-stats", getDailyRegistrationStats);

export default router;
