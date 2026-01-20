import nodemailer from "nodemailer";
import QRCode from "qrcode";

export const sendConfirmationMail = async (reg) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    // 🔐 BEST PRACTICE: encode only token OR ID
    const qrUrl = `${process.env.FRONTEND_URL}/scan/${reg.qrToken}`;
    const qrBuffer = await QRCode.toBuffer(qrUrl);

    const eventList = Object.values(reg.events)
        .filter(Boolean)
        .join(", ");

    await transporter.sendMail({
        from: `"ILAVENIL'26" <${process.env.MAIL_USER}>`,
        to: reg.email,
        subject: "🎉 Registration Confirmed – ILAVENIL'26",
        html: `
      <h2>🎊 On-Spot Registration Successful!</h2>

      <p><b>Name:</b> ${reg.name}</p>
      <p><b>Events:</b> ${eventList}</p>
      <p><b>Payment:</b> PAID (On-Spot)</p>
      <p><b>Status:</b> APPROVED</p>

      <hr/>

      <h3>📌 Your Entry QR Code</h3>
      <p>Please show this QR at the help desk:</p>

      <img src="cid:qr-code" width="180" />

      <br/><br/>
      <p><b>Registration ID:</b> ${reg._id}</p>

      <p>📍 Please report to the help desk on event day.</p>

      <br/>
      <p>— Team ILAVENIL'26</p>
    `,
        attachments: [
            {
                filename: "qr.png",
                content: qrBuffer,
                cid: "qr-code", // 👈 MUST MATCH img src
            },
        ],
    });
};
