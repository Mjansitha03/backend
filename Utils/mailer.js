// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();


// const PASS_MAIL = process.env.PASS_MAIL; 
// const PASS_KEY = process.env.PASS_KEY;

// if (!PASS_MAIL || !PASS_KEY) {
//   console.warn(
//     "Warning: PASS_MAIL or PASS_KEY not set in .env. Emails will fail."
//   );
// }

// const transporter = nodemailer.createTransport({
//  service: "gmail",
//   auth: {
//     user: PASS_MAIL,
//     pass: PASS_KEY, 
//   },
// });

// // Send Email
// const sendEmail = async (to, subject, text) => {
//   try {
//     await transporter.sendMail({
//       from: PASS_MAIL,
//       to,
//       subject,
//       text,
//     });
//   } catch (err) {
//     console.error("Email Error:", err);
//     throw new Error(err?.message || "Failed to send email");
//   }
// };

// export default sendEmail;


import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const PASS_MAIL = process.env.PASS_MAIL;
const PASS_KEY = process.env.PASS_KEY;

if (!PASS_MAIL || !PASS_KEY) {
  console.warn(
    "Warning: PASS_MAIL or PASS_KEY not set in .env. Emails may fail."
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: PASS_MAIL,
    pass: PASS_KEY, // Use Gmail App Password here
  },
});

/**
 * Send email without throwing 500 to backend.
 * Logs error if email sending fails.
 */
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: PASS_MAIL,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.warn("Email sending failed:", err.message);
    // Do not throw, just log
  }
};

export default sendEmail;



