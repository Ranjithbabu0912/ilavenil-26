import connectDB from "../config/db.js";
import EventRegistration from "../models/eventRegistration.js";
import { isValidUTR } from "../utils/validateUTR.js";

export const submitPayment = async (req, res) => {
  try {
    await connectDB(); // 🔥 REQUIRED (THIS FIXES EVERYTHING)

    const { id } = req.params;
    const { utr } = req.body;

    if (!utr) {
      return res.status(400).json({
        success: false,
        message: "UTR is required",
      });
    }

    if (!isValidUTR(utr)) {
      return res.status(400).json({
        success: false,
        message: "Invalid UTR format. UTR must be a 10–22 digit number.",
      });
    }

    const normalizedUtr = utr.trim();

    const duplicate = await EventRegistration.findOne({
      "payment.utr": normalizedUtr,
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "This UTR is already used. Please enter a valid UTR.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment screenshot is required",
      });
    }

    const screenshotUrl = req.file.path;
    const screenshotPublicId = req.file.filename;

    const registration = await EventRegistration.findByIdAndUpdate(
      id,
      {
        $set: {
          "payment.method": "UPI",
          "payment.utr": normalizedUtr,
          "payment.screenshotUrl": screenshotUrl,
          "payment.screenshotPublicId": screenshotPublicId,
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

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate UTR detected",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
