import EventRegistration from "../models/eventRegistration.js";
import crypto from "crypto";
// import { generateAttendanceQR } from "../utils/generateQR.js";
// import { sendPaymentVerifiedMail } from "../utils/sendVerifiedMail.js";

// 🔹 Get all pending payments
export const getPendingPayments = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search?.trim();

    const query = {
      payment: { $type: "object" },
      "payment.status": "PENDING",
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        {
          "payment.utr": {
            $exists: true,
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await EventRegistration.countDocuments(query);

    const payments = await EventRegistration.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ _id: -1 });

    res.json({
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("🔥 CONTROLLER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search?.trim();
    const status = req.query.status || "PENDING";

    const query = {
      payment: { $type: "object" },
      "payment.status": status,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        {
          "payment.utr": {
            $exists: true,
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await EventRegistration.countDocuments(query);

    const payments = await EventRegistration.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ _id: -1 });

    res.json({
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("PAYMENT FETCH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};




export const approvePayment = async (req, res) => {
  try {
    const reg = await EventRegistration.findById(req.params.id);

    if (!reg) {
      return res.status(404).json({ message: "Not found" });
    }

    if (reg.payment.status === "APPROVED") {
      return res.json({ message: "Already approved" });
    }

    // ✅ Approve payment
    reg.payment.status = "APPROVED";

    // 🔥 Generate QR token
    reg.qrToken = crypto.randomBytes(16).toString("hex");

    await reg.save();

    // 🔳 QR payload
    const qrPayload = {
      registrationId: reg._id,
      name: reg.name,
      email: reg.email,
      qrToken: reg.qrToken,
    };

    // 🔳 Generate QR image
    // const qrDataURL = await generateAttendanceQR(qrPayload);

    // ✉️ Send mail
    // await sendPaymentVerifiedMail({
    //   email: reg.email,
    //   name: reg.name,
    //   qrDataURL,
    // });

    res.json({
      success: true,
      message: "Payment approved & email sent",
    });
  } catch (err) {
    console.error("APPROVAL ERROR:", err);
    res.status(500).json({ message: "Approval failed" });
  }
};






export const rejectPayment = async (req, res) => {
  await EventRegistration.findByIdAndUpdate(req.params.id, {
    "payment.status": "REJECTED",
  });
  res.json({ success: true });
};

