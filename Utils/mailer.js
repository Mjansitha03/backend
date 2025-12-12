import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // required for Gmail
  auth: {
    user: process.env.PASS_MAIL,
    pass: process.env.PASS_KEY, // MUST be Gmail App Password
  },
});

// Send Email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.PASS_MAIL,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error("Email Error:", err);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
