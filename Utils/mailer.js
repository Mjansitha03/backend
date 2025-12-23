import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, text) => {
  try {
    await sgMail.send({
      to,
      from: process.env.FROM_EMAIL, 
      subject,
      text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error.response?.body || error.message);
  }
};
