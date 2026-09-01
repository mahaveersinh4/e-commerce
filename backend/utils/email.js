import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (toEmail, otp) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: toEmail,
    subject: "Your OTP Code",
    text: `Your OTP: ${otp}. Expire after 10 minutes.`,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send OTP email");
  }

  return data;
};
