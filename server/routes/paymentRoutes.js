import express from "express";
import upload from "../middlewares/upload.js";
import { submitPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post(
    "/manual/:id",
    upload.single("screenshot"),
    submitPayment
);



export default router;
