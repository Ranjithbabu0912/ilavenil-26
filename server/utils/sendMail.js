import nodemailer from "nodemailer";

const sendReceiptMail = async (to, data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Event Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎟 Event Registration Receipt",
    html: `
      <h2>Payment Successful 🎉</h2>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Primary Event:</b> ${data.events.primary}</p>
      <p><b>Status:</b> PAID</p>
      <p>Thank you for registering!</p>
    `,
  });
};

export default sendReceiptMail;
