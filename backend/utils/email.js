import nodemailer from "nodemailer";

// yahan apna gmail aur app password .env se aayega
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,         // tumhara_gmail@gmail.com
    pass: process.env.EMAIL_PASSWORD, // 16 digit app password
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
