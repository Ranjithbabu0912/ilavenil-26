import connectDB from "../config/db.js";
import EventRegistration from "../models/eventRegistration.js";
import { isValidUTR } from "../utils/validateUTR.js";

export const submitPayment = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { utr } = req.body;

    if (!utr) {
      return res.status(400).json({ success: false, message: "UTR is required" });
    }

    if (!isValidUTR(utr)) {
      return res.status(400).json({
        success: false,
        message: "Invalid UTR format (10–22 digits)",
      });
    }

    const normalizedUtr = utr.trim();

    const duplicate = await EventRegistration.findOne({
      "payment.utr": normalizedUtr,
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "This UTR is already used",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment screenshot is required",
      });
    }

    const registration = await EventRegistration.findByIdAndUpdate(
      id,
      {
        $set: {
          "payment.method": "UPI",
          "payment.utr": normalizedUtr,
          "payment.screenshotUrl": req.file.path,
          "payment.screenshotPublicId": req.file.filename,
          "payment.status": "PENDING",
        },
      },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment submitted successfully. Status: Pending",
    });

  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const retryPayment = async (req, res) => {
  try {
    const { utr, screenshotUrl } = req.body;

    if (!utr || !screenshotUrl) {
      return res.status(400).json({
        message: "UTR and screenshot are required",
      });
    }

    const registration = await EventRegistration.findById(req.user.registrationId);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.payment.status !== "REJECTED") {
      return res.status(400).json({
        message: "Retry allowed only for rejected payments",
      });
    }

    registration.payment.utr = utr;
    registration.payment.screenshotUrl = screenshotUrl;
    registration.payment.status = "PENDING";
    registration.payment.retryCount += 1;
    registration.payment.lastRetriedAt = new Date();

    await registration.save();

    res.json({
      success: true,
      message: "Payment resubmitted for verification",
    });
  } catch (err) {
    console.error("RETRY PAYMENT ERROR:", err);
    res.status(500).json({ message: "Retry failed" });
  }
};
