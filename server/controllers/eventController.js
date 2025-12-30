import connectDB from "../config/db.js";
import EventRegistration from "../models/eventRegistration.js";

/* ================= CREATE REGISTRATION ================= */

export const createRegistration = async (req, res) => {
  try {
    await connectDB(); // 🔥 REQUIRED (MUST BE FIRST)

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
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

    return res.status(201).json({
      success: true,
      registrationId: registration._id,
    });

  } catch (error) {
    console.error("createRegistration error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= CHECK PAYMENT STATUS ================= */

export const checkPaymentStatus = async (req, res) => {
  try {
    await connectDB(); // 🔥 REQUIRED (MUST BE FIRST)

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

    const paymentStatus = registration.payment?.status || "NOT_PAID";

    return res.status(200).json({
      success: true,
      status: paymentStatus,
      registrationId: registration._id,
    });

  } catch (err) {
    console.error("checkPaymentStatus error:", err);

    // ❗ Do not crash frontend
    return res.status(200).json({ success: false });
  }
};

export const getAllRegistration = async (req, res) => {
  
  try {
    const registrations = await EventRegistration.find().sort({ createdAt: -1 });
    res.json({ registrations });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
}