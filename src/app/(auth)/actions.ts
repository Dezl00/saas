"use server";

import { signIn, auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sendOTP } from "@/lib/email";

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = loginSchema.parse(rawData);

    // Get user to determine role for redirect and check suspension
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (user?.status === "SUSPENDED") {
      const platformSetting = await prisma.platformSetting.findUnique({ where: { id: "1" } });
      const whatsapp = platformSetting?.supportWhatsapp || "";
      return { error: `تم ايقاف حسابك تواصل مع الدعم عبر واتساب ${whatsapp}`, values: rawData };
    }

    const redirectTo = user?.role === "ADMIN" ? "/admin" : "/dashboard";

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة", values: rawData };
    }
    
    // Manual redirect after successful sign in
    redirect(redirectTo);
  } catch (error) {
    const rawData = Object.fromEntries(formData);
    if (error && typeof error === 'object' && ('errors' in error || 'issues' in error)) {
      const issues = (error as any).errors || (error as any).issues;
      if (Array.isArray(issues) && issues.length > 0) {
        return { error: issues[0].message, values: rawData };
      }
    }
    const isCredentialsError = 
      (error && typeof error === "object" && "type" in error && (error as any).type === "CredentialsSignin") ||
      (error instanceof Error && (error.message.includes("CredentialsSignin") || error.name === "CredentialsSignin"));

    if (isCredentialsError) {
      if ((error as any)?.cause?.err?.message === "UNVERIFIED") {
        return { error: "يرجى تفعيل حسابك أولاً. قم بإنشاء حساب بنفس البريد لإعادة إرسال الكود.", values: rawData };
      }
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة", values: rawData };
    }
    // Check if it's a NEXT_REDIRECT error thrown by Next.js or Auth.js
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as any).digest === "string" &&
      (error as any).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    // Return any other unexpected error safely to avoid 500 Internal Server Error
    return { error: "خطأ غير متوقع: " + (error instanceof Error ? error.message : String(error)), values: rawData };
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = registerSchema.parse(rawData);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // Generate a 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    if (existingUser) {
      if (existingUser.isVerified) {
        return { error: "البريد الإلكتروني مستخدم بالفعل", values: rawData };
      }
      // If not verified, just update the OTP and resend
      await prisma.user.update({
        where: { email: validatedData.email },
        data: { otpCode, otpExpiry }
      });
    } else {
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      const user = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          phone: rawData.phone as string,
          role: "OWNER",
          isVerified: false,
          otpCode,
          otpExpiry,
        },
      });

      // Create an empty store to be filled in onboarding
      await prisma.store.create({
        data: {
          name: "متجر جديد",
          type: "RESTAURANT",
          userId: user.id,
        },
      });
    }

    const sent = await sendOTP(validatedData.email, otpCode);
    if (!sent) {
      return { error: "حدث خطأ أثناء إرسال كود التحقق", values: rawData };
    }

    return { requiresOtp: true, email: validatedData.email, values: rawData };
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    const rawData = Object.fromEntries(formData);
    if (error && typeof error === 'object' && ('errors' in error || 'issues' in error)) {
      const issues = (error as any).errors || (error as any).issues;
      if (Array.isArray(issues) && issues.length > 0) {
        return { error: issues[0].message, values: rawData };
      }
    }
    return { error: "خطأ داخلي: " + (error instanceof Error ? error.message : String(error)), values: rawData };
  }
}

export async function verifyOtpAction(email: string, otp: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "المستخدم غير موجود" };
    if (user.isVerified) return { error: "الحساب مفعل مسبقاً" };
    
    if (user.otpCode !== otp) return { error: "الكود غير صحيح" };
    if (user.otpExpiry && user.otpExpiry < new Date()) return { error: "الكود منتهي الصلاحية" };

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, otpCode: null, otpExpiry: null }
    });

    // Notify Admins
    try {
      await prisma.adminNotification.create({
        data: {
          title: "مستخدم جديد",
          message: `سجل ${user.name} حساباً جديداً بالمنصة.`,
          type: "NEW_USER",
          link: `/admin/users`
        }
      });
    } catch (e) {
      console.error("Failed to notify admin", e);
    }

    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء التحقق من الكود" };
  }
}
export async function forgotPasswordAction(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const { email } = await import("@/lib/validations").then(m => m.forgotPasswordSchema.parse(rawData));

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't leak whether user exists or not for security, just pretend it was sent.
      return { success: true, email };
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { email },
      data: { otpCode, otpExpiry }
    });

    const { sendPasswordResetOTP } = await import("@/lib/email");
    const sent = await sendPasswordResetOTP(email, otpCode);
    
    if (!sent) {
      return { error: "حدث خطأ أثناء إرسال كود التحقق" };
    }

    return { success: true, email };
  } catch (error) {
    if (error && typeof error === 'object' && ('errors' in error || 'issues' in error)) {
      const issues = (error as any).errors || (error as any).issues;
      if (Array.isArray(issues) && issues.length > 0) {
        return { error: issues[0].message };
      }
    }
    return { error: "خطأ داخلي، يرجى المحاولة لاحقاً" };
  }
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const { email, otpCode, password } = await import("@/lib/validations").then(m => m.resetPasswordSchema.parse(rawData));

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otpCode !== otpCode) {
      return { error: "الكود غير صحيح" };
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return { error: "الكود منتهي الصلاحية" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        otpCode: null, 
        otpExpiry: null,
        isVerified: true // verify them if they weren't
      }
    });

    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && ('errors' in error || 'issues' in error)) {
      const issues = (error as any).errors || (error as any).issues;
      if (Array.isArray(issues) && issues.length > 0) {
        return { error: issues[0].message };
      }
    }
    return { error: "حدث خطأ أثناء تغيير كلمة المرور" };
  }
}
