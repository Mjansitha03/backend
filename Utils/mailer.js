import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// export const sendmail = async (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     tls: {
//       rejectUnauthorized: false
//     },
//     port: 465,
//     secure: false,
//     auth: {
//       user: process.env.FROM_EMAIL,
//       pass: process.env.PASS_KEY
//     }
//   });

//   const mailData = {
//     from: process.env.FROM_EMAIL,
//     to,
//     subject,
//     text,
//   };
//   await new Promise((resolve, reject) => {
//     transporter.sendMail(mailData, (err, info) => {
//       if (err) {
//         reject(err);
//       } else {
//         console.log("Mail Send Successfully")
//         resolve(info);
//       }
//     });
//   });
// };


export const sendmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.PASS_KEY,
    },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
  });

  console.log("Mail sent successfully");
};
