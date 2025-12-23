import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send an email using SendGrid

export const sendEmail = async (to, subject, text) => {
  try {
    const response = await sgMail.send({
      to,
      from: process.env.FROM_EMAIL,
      subject,
      text,
    });

    console.log(`Email sent successfully: ${response[0].headers.location}`);
  } catch (error) {
    console.error(
      `Error sending email: ${
        error.response?.body?.errors[0].message || error.message
      }`
    );
  }
};
