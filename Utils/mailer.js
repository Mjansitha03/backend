import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Set up Gmail sender
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.PASS_MAIL,
    pass: process.env.PASS_KEY, 
  },
});

// Send an email: to, subject, text
const sendEmail = async (to, subject, text) => {
  const mailOptions = { from: process.env.PASS_MAIL, to, subject, text };
  // call transporter to send mail
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
