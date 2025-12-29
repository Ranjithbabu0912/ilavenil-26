import EventRegistration from "../models/eventRegistration.js";

export const createRegistration = async (req, res) => {
  try {
    const { email } = req.query;

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
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false });
  }

  const registration = await EventRegistration.findOne({ email });

  if (!registration) {
    return res.json({ success: false });
  }

  res.json({
    success: true,
    status: registration.payment.status,
    registrationId: registration._id,
    events: registration.events,
  });
};


