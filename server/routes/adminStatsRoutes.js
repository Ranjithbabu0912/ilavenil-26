import express from "express";
import { stateCheck } from "../controllers/stateController.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = express.Router();


router.get("/registration-stats", stateCheck);

export default router;
