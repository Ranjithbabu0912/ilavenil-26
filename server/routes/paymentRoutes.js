import express from "express";
import upload from "../middlewares/upload.js";
import { retryPayment, submitPayment } from "../controllers/paymentController.js";
import { attachUser } from "../middlewares/attachUser.js";
// import { blockAdmin } from "../middlewares/blockAdmin.js";
// import { clerkProtect } from '../middlewares/authMiddleware.js';
// import { attachUser } from "../middlewares/attachUser.js";

import cors from "cors";

const router = express.Router();

router.options("/manual/:id", cors());
router.options("/payment/retry", cors());



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
