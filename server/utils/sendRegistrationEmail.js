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

  await transporter.verify();
  console.log("✅ Mail server ready");



  await transporter.sendMail({
    from: `"ILAVENIL'26" <${process.env.MAIL_USER}>`,
    to,
    subject: "Payment Approved – Registration Confirmed | ILAVENIL'26",
    html:
      `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Payment Approved</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f8">
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="background-color: #f4f6f8; padding: 20px 0"
      >
        <tr>
          <td align="center">
            <!-- MAIN CONTAINER -->
            <table
              width="600"
              cellpadding="0"
              cellspacing="0"
              style="
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                font-family: Arial, sans-serif;
              "
            >
              <!-- HEADER / LOGO -->
              <tr>
                <td
                  align="center"
                  style="
                    background: url('https://res.cloudinary.com/dwvdi8vff/image/upload/v1767188740/logo_qhptnf.png');
                    background-position: center;
                    background-size: cover;
                    background-repeat: no-repeat;
                    display: flex;
                    height: 250px;
                    align-items: center;
                  "
                ></td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding: 30px; color: #333333">
                  <h2 style="color: #16a34a; margin-top: 0">
                    ✅ Payment Approved
                  </h2>

                  <p style="font-size: 15px; line-height: 1.6">
                    Hello <strong>${name}</strong>,
                  </p>

                  <p style="font-size: 15px; line-height: 1.6">
                    We’re happy to inform you that your payment has been
                    <strong>successfully verified</strong> and your registration
                    for <strong>ILAVENIL'26</strong> is now confirmed 🎉
                  </p>

                  <!-- DETAILS BOX -->
                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      background: #f9fafb;
                      border: 1px solid #e5e7eb;
                      border-radius: 6px;
                      margin: 20px 0;
                    "
                  >
                    <tr>
                      <td style="padding: 15px">
                        <h4 style="margin-top: 0; color: #111827">
                          📌 Registration Details
                        </h4>
                        <p style="margin: 6px 0">
                          <strong>Registration ID:</strong> ${registrationId}
                        </p>
                        <p style="margin: 6px 0">
                          <strong>Event(s):</strong> ${events}
                        </p>
                        <p style="margin: 6px 0">
                          <strong>Payment Status:</strong>
                          <span style="color: #16a34a">APPROVED</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size: 15px; line-height: 1.6">
                    Your QR code is available in your dashboard.<br />
                    Please bring it on the event day for
                    <strong>attendance verification</strong>.
                  </p>

                  <p style="font-size: 14px; color: #6b7280; margin-top: 20px">
                    ⚠️ Attendance will be marked only at the venue using your QR
                    code.
                  </p>

                  <p style="font-size: 15px; margin-top: 25px">
                    We look forward to your participation!
                  </p>

                  <p style="margin-bottom: 0">
                    Warm regards,<br />
                    <strong>ILAVENIL'26 Event Team</strong>
                  </p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td
                  style="
                    background: #f3f4f6;
                    padding: 20px;
                    text-align: center;
                    font-size: 13px;
                    color: #6b7280;
                  "
                >
                  <p style="margin: 5px 0">
                    📧 Email:
                    <a
                      href="mailto:committee.ilavenil26@gmail.com"
                      style="color: #2563eb; text-decoration: none"
                      >committee.ilavenil26@gmail.com</a
                    >
                  </p>
                  <p style="margin: 5px 0">📞 Contact: +91 90431 00583</p>
                  <p style="margin: 10px 0 0">
                    © 2026 ILAVENIL'26. All rights reserved by Ranjith.
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


export const sendPaymentRejectionEmail = async ({
  to,
  name,
  registrationId,
  rejectReason,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.verify();
  console.log("✅ Mail server ready");

  await transporter.sendMail({
    from: `"ILAVENIL'26" <${process.env.MAIL_USER}>`,
    to,
    subject: "Payment Rejected – Action Required | ILAVENIL’26",
    html:
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Payment Rejected</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f8">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background-color: #f4f6f8; padding: 20px 0"
    >
      <tr>
        <td align="center">
          <!-- MAIN CONTAINER -->
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
              font-family: Arial, sans-serif;
            "
          >
            <!-- HEADER / LOGO -->
            <tr>
              <td
                align="center"
                style="
                  background: url('https://res.cloudinary.com/dwvdi8vff/image/upload/v1767188740/logo_qhptnf.png');
                  background-position: center;
                  background-size: cover;
                  background-repeat: no-repeat;
                  height: 250px;
                "
              ></td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding: 30px; color: #333333">
                <h2 style="color: #dc2626; margin-top: 0">
                  ❌ Payment Rejected
                </h2>

                <p style="font-size: 15px; line-height: 1.6">
                  Hello <strong>${name}</strong>,
                </p>

                <p style="font-size: 15px; line-height: 1.6">
                  We regret to inform you that your payment for
                  <strong>ILAVENIL'26</strong> could not be verified at this time.
                </p>

                <!-- REJECTION DETAILS -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 6px;
                    margin: 20px 0;
                  "
                >
                  <tr>
                    <td style="padding: 15px">
                      <h4 style="margin-top: 0; color: #991b1b">
                        🚫 Rejection Details
                      </h4>
                      <p style="margin: 6px 0">
                        <strong>Registration ID:</strong> ${registrationId}
                      </p>
                      <p style="margin: 6px 0">
                        <strong>Reason:</strong>
                        <span style="color: #b91c1c">
                          ${rejectReason}
                        </span>
                      </p>
                      <p style="margin: 6px 0">
                        <strong>Status:</strong>
                        <span style="color: #dc2626">REJECTED</span>
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 15px; line-height: 1.6">
                  Please review the reason mentioned above and
                  <strong>submit your payment again</strong> with the correct
                  details.
                </p>

                <p style="font-size: 14px; color: #6b7280; margin-top: 20px">
                  ⚠️ If the issue persists, feel free to contact our support
                  team for assistance.
                </p>

                <p style="font-size: 15px; margin-top: 25px">
                  We appreciate your interest and hope to see you at
                  <strong>ILAVENIL'26</strong>.
                </p>

                <p style="margin-bottom: 0">
                  Warm regards,<br />
                  <strong>ILAVENIL'26 Event Team</strong>
                </p>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td
                style="
                  background: #f3f4f6;
                  padding: 20px;
                  text-align: center;
                  font-size: 13px;
                  color: #6b7280;
                "
              >
                <p style="margin: 5px 0">
                  📧 Email:
                  <a
                    href="mailto:committee.ilavenil26@gmail.com"
                    style="color: #2563eb; text-decoration: none"
                  >
                    committee.ilavenil26@gmail.com
                  </a>
                </p>
                <p style="margin: 5px 0">📞 Contact: +91 90431 00583</p>
                <p style="margin: 10px 0 0">
                  © 2026 ILAVENIL'26. All rights reserved by Ranjith.
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
