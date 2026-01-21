import connectDB from "../config/db.js";
import EventRegistration from "../models/eventRegistration.js";
import Team from "../models/Team.js";
import { isTeamRequired } from "../utils/eventValidation.js";

// const GROUP_EVENTS = ["CorpIQ", "Market Mania", "Webify", "IPL Auction", "Skillspark"];

/* ================= CREATE REGISTRATION ================= */

export const createRegistration = async (req, res) => {
  try {

    await connectDB();

    const {
      name,
      gender,
      contact,
      email,
      collegeName,
      discipline,
      collegeCity,
      year,
      soloOrGroup,
      teamName,
      events,
      mode,
      registeredBy
    } = req.body;

    const selectedEvents = Object.values(events).filter(Boolean);

    // 🔴 Team validation
    const teamNeeded = isTeamRequired({ events, soloOrGroup });

    let teamDoc = null;

    if (teamNeeded) {
      const groupEvent =
        selectedEvents.find(e => e !== "Skillspark") || "Skillspark";

      // 🔍 Find existing team
      teamDoc = await Team.findOne({
        event: groupEvent,
        teamName: teamName.trim(),
      });

      // 🆕 Create team if not exists
      if (!teamDoc) {
        teamDoc = await Team.create({
          event: groupEvent,
          teamName: teamName.trim(),
          members: [],
        });
      }

      // 🚫 Team size limit
      if (teamDoc.members.length >= teamDoc.maxSize) {
        return res.status(400).json({
          success: false,
          message: "Team size limit reached",
        });
      }
    }

    const isOnSpot = mode === "ONSPOT";


    // ✅ Save registration
    const registration = await EventRegistration.create({
      name,
      gender,
      contact,
      email,
      collegeName,
      discipline,
      collegeCity,
      year,
      soloOrGroup,
      teamName: teamNeeded ? teamName.trim() : null,
      events,
      team: teamDoc?._id || null,

      mode: isOnSpot ? "ONSPOT" : "ONLINE",

      registeredBy,

      payment: isOnSpot
        ? {
          method: req.body.payment.method, // CASH / UPI
          status: "APPROVED",
          paidAt: new Date(),
        }
        : {
          status: "NOT_PAID",
        },

      status: isOnSpot ? "APPROVED" : "NOT_PAID",


    });

    // 🔗 Attach member to team
    if (teamDoc) {
      teamDoc.members.push(registration._id);
      await teamDoc.save();
    }

    if (isOnSpot) {
      const { sendConfirmationMail } = await import("../utils/sendConfirmationMail.js");
      await sendConfirmationMail(registration);
    }



    return res.status(201).json({
      success: true,
      registrationId: registration._id,
      teamId: teamDoc?._id || null,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

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

    // On-spot registrations are always paid
    if (registration.mode === "ONSPOT") {
      return res.status(200).json({
        success: true,
        status: "PAID",
        registrationId: registration._id,
        paymentRequired: false,
        mode: "ONSPOT",
      });
    }

    // ✅ DEFINE STATUS SAFELY
    const status = registration.payment?.status || "NOT_PAID";

    return res.status(200).json({
      success: true,
      status,
      registrationId: registration._id,

      // 👇 IMPORTANT FOR TEAM LOGIC
      paymentRequired: registration.isTeamLeader ?? true,

      rejectionReason:
        status === "REJECTED"
          ? registration.payment?.rejectionReason || "Payment rejected"
          : undefined,
    });

  } catch (err) {
    console.error("checkPaymentStatus error:", err);
    return res.status(500).json({ success: false });
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

    const startDate = new Date("2026-01-05T00:00:00.000Z");
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
