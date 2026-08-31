import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendOtpEmail = async (toEmail, otp) => {
  console.log("SMTP USER:", process.env.EMAIL);
  console.log("SMTP PASSWORD EXISTS:", !!process.env.EMAIL_PASSWORD);

  try {
    console.log("SMTP: sending OTP to", toEmail);

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: toEmail,
      subject: "Your OTP Code",
      text: `Your OTP: ${otp}. Expire after 10 minutes.`,
    });

    console.log("SMTP SUCCESS:", info.messageId);

    return info;
  } catch (error) {
    console.error("SMTP ERROR:", error);
    throw error;
  }
};
