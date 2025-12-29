import express from "express";
import upload from "../middlewares/upload.js";
import { submitPayment } from "../controllers/paymentController.js";
import { blockAdmin } from "../middlewares/blockAdmin.js";
import { clerkProtect } from '../middlewares/authMiddleware.js';
import { attachUser } from "../middlewares/attachUser.js";

const router = express.Router();

router.post(
    "/manual/:id",
    clerkProtect,
    attachUser,
    blockAdmin,  
    upload.single("screenshot"),
    submitPayment
);




export default router;
