import EventRegistration from "../models/eventRegistration.js";

export const createRegistration = async (req, res) => {
  try {
    const { email } = req.body;

    // Check for duplicate email
    const existingRegistration = await EventRegistration.findOne({ email });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // Create new registration
    const registration = await EventRegistration.create({
      ...req.body,
      payment: {
        status: "NOT_PAID",
      },
    });

    res.status(201).json({
      success: true,
      message: "Registration created",
      registrationId: registration._id,
    });
  } catch (error) {
    // Handle MongoDB unique index error (safety net)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const { email } = req.body;

    const registration = await EventRegistration.findOne({ email });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "No registration found with this email",
      });
    }

    res.status(200).json({
      success: true,
      status: registration.payment.status,
      events: registration.events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
