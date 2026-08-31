import nodemailer from "nodemailer";

// yahan apna gmail aur app password .env se aayega
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


export const sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: toEmail,
    subject: "Your OTP Code",
    text: `Your OTP: ${otp}. expire after 10 minute .`,
  });
};
