import connectDB from "../config/db.js";
import EventRegistration from "../models/eventRegistration.js";

const GROUP_EVENTS = ["CorpIQ", "Market Mania", "Webify", "IPL Auction", "Yourspark"];

/* ================= CREATE REGISTRATION ================= */

export const createRegistration = async (req, res) => {
  try {
    await connectDB();

    const {
      email,
      gender,
      collegeCity,
      teamName,
      events,
    } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    // 🔐 prevent duplicate email
    const existingRegistration = await EventRegistration.findOne({ email });
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // ✅ basic required field checks
    if (!gender || !collegeCity) {
      return res.status(400).json({
        success: false,
        message: "Missing required participant details",
      });
    }

    // ✅ group event → team name required
    const isGroupEvent =
      GROUP_EVENTS.includes(events?.primary) ||
      GROUP_EVENTS.includes(events?.secondary);

    if (isGroupEvent && !teamName) {
      return res.status(400).json({
        success: false,
        message: "Team name is required for group events",
      });
    }

    const registration = await EventRegistration.create({
      ...req.body,
      teamName: isGroupEvent ? teamName : null,
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
    await connectDB();

    const { email } = req.body || {};

    if (!email) {
      return res.status(200).json({ success: false });
    }

    const registration = await EventRegistration.findOne({ email });

    if (!registration) {
      return res.status(200).json({ success: false });
    }

    const status = registration.payment?.status || "NOT_PAID";

    return res.status(200).json({
      success: true,
      status,
      registrationId: registration._id,

      // 🔴 ONLY SEND THIS WHEN REJECTED
      rejectionReason:
        status === "REJECTED"
          ? registration.payment?.rejectionReason || "Payment rejected"
          : undefined,
    });

  } catch (err) {
    console.error("checkPaymentStatus error:", err);
    return res.status(200).json({ success: false });
  }
};


/* ================= GET ALL REGISTRATIONS ================= */

export const getAllRegistration = async (req, res) => {
  try {
    const registrations = await EventRegistration.find().sort({ createdAt: -1 });
    res.json({ registrations });
  } catch {
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};


/* ================= DAILY REGISTRATION STATS ================= */

export const getDailyRegistrationStats = async (req, res) => {
  try {
    await connectDB();

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-22T23:59:59.999Z");

    const result = await EventRegistration.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    // 🧠 Convert to map for easy lookup
    const countMap = {};
    result.forEach(item => {
      countMap[item._id] = item.count;
    });

    // 📅 Fill missing dates with 0
    const stats = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const key = current.toISOString().slice(0, 10);

      stats.push({
        date: current.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        registrations: countMap[key] || 0,
      });

      current.setDate(current.getDate() + 1);
    }

    return res.json({ success: true, stats });

  } catch (err) {
    console.error("Daily stats error:", err);
    return res.status(500).json({ success: false });
  }
};
