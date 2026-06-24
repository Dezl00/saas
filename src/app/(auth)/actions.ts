"use server";

import { signIn, auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sendOTP } from "@/lib/email";

export async function loginAction(prevState: any, formData: FormData) {
  let shouldRedirect = false;
  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = loginSchema.parse(rawData);

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    shouldRedirect = true;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    if (error instanceof z.ZodError) {
      const zodError = error as any;
      return { error: zodError.errors[0].message };
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          if ((error as any).cause?.err?.message === "UNVERIFIED") {
            return { error: "يرجى تفعيل حسابك أولاً. قم بإنشاء حساب بنفس البريد لإعادة إرسال الكود." };
          }
          return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
        default:
          return { error: "حدث خطأ في المصادقة: " + error.message };
      }
    }
    return { error: "خطأ غير متوقع: " + (error instanceof Error ? error.message : String(error)) };
  }

  if (shouldRedirect) {
    const session = await auth();
    if (session?.user?.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
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
        return { error: "البريد الإلكتروني مستخدم بالفعل" };
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
      return { error: "حدث خطأ أثناء إرسال كود التحقق" };
    }

    return { requiresOtp: true, email: validatedData.email };
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    if (error instanceof z.ZodError) {
      const zodError = error as any;
      return { error: zodError.errors[0].message };
    }
    return { error: "خطأ داخلي: " + (error instanceof Error ? error.message : String(error)) };
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

    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء التحقق من الكود" };
  }
}
