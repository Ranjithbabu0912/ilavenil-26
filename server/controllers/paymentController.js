import EventRegistration from "../models/eventRegistration.js";

export const submitPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { utr } = req.body;

    if (!utr) {
      return res.status(400).json({
        success: false,
        message: "UTR is required",
      });
    }

    const screenshot = req.file ? req.file.filename : null;

    const registration = await EventRegistration.findByIdAndUpdate(
      id,
      {
        payment: {
          method: "UPI",
          utr,
          screenshot,
          status: "PENDING",
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

    res.status(200).json({
      success: true,
      message: "Payment submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

