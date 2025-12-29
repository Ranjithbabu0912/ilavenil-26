import { mailer } from "./mailer.js";

export const sendPaymentVerifiedMail = async ({
    email,
    name,
    qrDataURL,
}) => {
    const base64QR = qrDataURL.split("base64,")[1];

    await mailer.sendMail({
        from: `"ILAVENIL'26" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Payment Verified & Attendance QR Code – ILAVENIL’26",
        html: `
      <p>Dear ${name},</p>

      <p>Greetings from the <b>ILAVENIL’26 Organizing Committee</b>.</p>

      <p>Your <b>payment has been successfully verified</b>.</p>

      <h3>🎟️ Attendance QR Code</h3>
      <p>Please find your QR code attached. Save it on your mobile.</p>

      <ul>
        <li>Entry verification</li>
        <li>Attendance marking</li>
        <li>Event participation</li>
      </ul>

      <p><b>Note:</b> Do not share this QR code.</p>

      <p>
        Warm regards,<br/>
        <b>ILAVENIL’26 Organizing Committee</b><br/>
        MBA & MCA Department<br/>
        G.T.N. Arts College, Dindigul
      </p>
    `,
        attachments: [
            {
                filename: "attendance-qr.png",
                content: base64QR,
                encoding: "base64",
            },
        ],
    });
};
