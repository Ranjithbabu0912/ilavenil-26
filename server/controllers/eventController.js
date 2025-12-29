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

    console.log("Checking registration for:", email);


    // 1️⃣ Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 2️⃣ Find registration
    const registration = await EventRegistration.findOne({ email });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // 3️⃣ Safe access
    const paymentStatus = registration.payment?.status || "pending";

    // 4️⃣ Success response
    return res.status(200).json({
      success: true,
      status: paymentStatus,
      registrationId: registration._id,
    });
  } catch (err) {
    console.error("checkPaymentStatus ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

