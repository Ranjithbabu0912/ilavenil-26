import { mailer } from "../utils/mailer.js";

export const sendContactMail = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields required" });
        }

        await mailer.sendMail({
            from: `"ILAVENIL'26 Contact" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER, // receive in admin mail
            replyTo: email,
            subject: `📩 New Contact Message from ${name}`,
            html:
                `<div style="font-family: Arial, sans-serif">
                <h2>New Contact Message</h2>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Message:</b></p>
                <p>${message}</p>
                </div>
                `,
        });

        res.json({ success: true, message: "Email sent successfully" });
    } catch (err) {
        console.error("CONTACT MAIL ERROR:", err);
        res.status(500).json({ message: "Email failed" });
    }
};
