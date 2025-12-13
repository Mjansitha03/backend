import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// credentials for the sending email account (from .env)
const PASS_MAIL = process.env.PASS_MAIL;
const PASS_KEY = process.env.PASS_KEY;

// warn if credentials are missing; helpful during setup
if (!PASS_MAIL || !PASS_KEY) {
  console.warn(
    "Warning: PASS_MAIL or PASS_KEY not set in .env. Emails may fail."
  );
}

// configure the mail transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: PASS_MAIL,
    pass: PASS_KEY, // Use Gmail App Password here
  },
});

/*
 * Send email without throwing 500 to backend.
 * Logs error if email sending fails.
 */
// sendEmail: safe wrapper to send a simple email
const sendEmail = async (to, subject, text) => {
  try {
    // attempt to send email
    await transporter.sendMail({
      from: PASS_MAIL,
      to,
      subject,
      text,
    });
    // log success for debugging
    console.log(`Email sent to ${to}`);
  } catch (err) {
    // log error but do not crash the app
    console.warn("Email sending failed:", err.message);
   
  }
};

export default sendEmail;



