import nodemailer from "nodemailer";

// Using a standard SMTP transporter. 
// For production, these should be environment variables.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE !== "false", // default to true for 465
  auth: {
    user: "info@menuegy.com",
    pass: "@jG3&JNjJ",
  },
});

export async function sendOTP(email: string, otpCode: string) {
  try {
    await transporter.sendMail({
      from: `"منصتك" <info@menuegy.com>`,
      to: email,
      subject: "كود التحقق من حسابك",
      text: `مرحباً،\n\nكود التحقق الخاص بك هو: ${otpCode}\n\nلا تشارك هذا الكود مع أحد.`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>مرحباً بك في منصتك!</h2>
          <p>كود التحقق الخاص بك لتفعيل الحساب هو:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3b82f6; margin: 20px 0;">
            ${otpCode}
          </div>
          <p>لا تشارك هذا الكود مع أي شخص.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
