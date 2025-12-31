import nodemailer from "nodemailer";

export const sendPaymentConfirmationEmail = async ({
    to,
    name,
    registrationId,
    events,
}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"ILAVENIL'26" <${process.env.MAIL_USER}>`,
        to,
        subject: "Payment Approved – Registration Confirmed | ILAVENIL'26",
        html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Payment Approved</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0;">
      <tr>
        <td align="center">

          <!-- MAIN CONTAINER -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08); font-family:Arial, sans-serif;">

            <!-- HEADER / LOGO -->
            <tr>
              <td align="center" style="background:#1f2937; padding:20px;">
                <img 
                  src="https://your-domain.com/logo.png"
                  alt="ILAVENIL'26"
                  style="height:60px; margin-bottom:10px;"
                />
                <h2 style="color:#ffffff; margin:0; font-weight:600;">
                  ILAVENIL'26
                </h2>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:30px; color:#333333;">

                <h2 style="color:#16a34a; margin-top:0;">
                  ✅ Payment Approved
                </h2>

                <p style="font-size:15px; line-height:1.6;">
                  Hello <strong>${name}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.6;">
                  We’re happy to inform you that your payment has been
                  <strong>successfully verified</strong> and your registration for
                  <strong>ILAVENIL'26</strong> is now confirmed 🎉
                </p>

                <!-- DETAILS BOX -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; margin:20px 0;">
                  <tr>
                    <td style="padding:15px;">
                      <h4 style="margin-top:0; color:#111827;">📌 Registration Details</h4>
                      <p style="margin:6px 0;"><strong>Registration ID:</strong> ${registrationId}</p>
                      <p style="margin:6px 0;"><strong>Event(s):</strong> ${events}</p>
                      <p style="margin:6px 0;"><strong>Payment Status:</strong> <span style="color:#16a34a;">APPROVED</span></p>
                    </td>
                  </tr>
                </table>

                <p style="font-size:15px; line-height:1.6;">
                  📎 Your QR code is available in your dashboard.<br/>
                  Please bring it on the event day for <strong>attendance verification</strong>.
                </p>

                <p style="font-size:14px; color:#6b7280; margin-top:20px;">
                  ⚠️ Attendance will be marked only at the venue using your QR code.
                </p>

                <p style="font-size:15px; margin-top:25px;">
                  We look forward to your participation!
                </p>

                <p style="margin-bottom:0;">
                  Warm regards,<br/>
                  <strong>ILAVENIL'26 Event Team</strong>
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#f3f4f6; padding:20px; text-align:center; font-size:13px; color:#6b7280;">
                <p style="margin:5px 0;">
                  📧 Email: <a href="mailto:ilavenil26@gmail.com" style="color:#2563eb; text-decoration:none;">ilavenil26@gmail.com</a>
                </p>
                <p style="margin:5px 0;">
                  📞 Contact: +91 98765 43210
                </p>
                <p style="margin:10px 0 0;">
                  © 2026 ILAVENIL. All rights reserved.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
`
    });
};
