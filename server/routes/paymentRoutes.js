import express from "express";
import upload from "../middlewares/upload.js";
import { retryPayment, submitPayment } from "../controllers/paymentController.js";
import { attachUser } from "../middlewares/attachUser.js";
// import { blockAdmin } from "../middlewares/blockAdmin.js";
// import { clerkProtect } from '../middlewares/authMiddleware.js';
// import { attachUser } from "../middlewares/attachUser.js";

const router = express.Router();

router.post(
    "/manual/:id",
    upload.single("screenshot"),
    submitPayment
);

router.post(
    "/payment/retry",
    attachUser,
    upload.single("screenshot"),
    retryPayment
);





export default router;
