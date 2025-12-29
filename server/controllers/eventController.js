import connectDB from "../config/db.js";
import EventRegistration from "../models/eventRegistration.js";

export const createRegistration = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const existingRegistration = await EventRegistration.findOne({ email });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    const registration = await EventRegistration.create({
      ...req.body,
      payment: { status: "NOT_PAID" },
    });

    res.status(201).json({
      success: true,

      registrationId: registration._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const checkPaymentStatus = async (req, res) => {
  try {
    const { email } = req.body || {};

    // ❗ Silent exit if no email
    if (!email) {
      return res.status(200).json({ success: false });
    }

    const registration = await EventRegistration.findOne({ email });

    // ❗ Silent exit if not registered
    if (!registration) {
      return res.status(200).json({ success: false });
    }

    // ✅ SAFE access (no crash)
    const paymentStatus = registration.payment?.status || "NOT_PAID";

    return res.status(200).json({
      success: true,
      status: paymentStatus,
      registrationId: registration._id,
    });

  } catch (err) {
    // 🔥 NEVER crash the client
    console.error("checkPaymentStatus error:", err);

    return res.status(200).json({
      success: false,
    });
  }
};

