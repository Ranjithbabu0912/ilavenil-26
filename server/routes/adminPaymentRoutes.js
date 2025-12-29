import express from "express";
import { attachUser } from "../middlewares/attachUser.js";
import { adminProtect } from "../middlewares/adminAuth.js";
import { clerkProtect } from '../middlewares/authMiddleware.js'
import {
    getPendingPayments,
    approvePayment,
    rejectPayment,
    getPayments,
} from "../controllers/adminPaymentController.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = express.Router();

router.get("/payments", getPayments);

router.get(
    "/payments/pending",
    adminProtect,
    getPendingPayments
);

router.patch(
    "/payments/:id/approve",
    clerkProtect,
    adminOnly,
    attachUser,
    adminProtect,
    approvePayment
);

router.patch(
    "/payments/:id/reject",
    clerkProtect,
    adminOnly,
    attachUser,
    adminProtect,
    rejectPayment
);

export default router;
