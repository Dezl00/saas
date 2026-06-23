"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

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
    if (error instanceof z.ZodError) {
      const zodError = error as any;
      return { error: zodError.errors[0].message };
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
        default:
          return { error: "حدث خطأ في المصادقة: " + error.message };
      }
    }
    return { error: "خطأ غير متوقع: " + (error as Error).message };
  }

  if (shouldRedirect) {
    redirect("/dashboard");
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  let shouldRedirect = false;
  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = registerSchema.parse(rawData);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "البريد الإلكتروني مستخدم بالفعل" };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "OWNER",
      },
    });

    await prisma.store.create({
      data: {
        name: validatedData.storeName,
        type: validatedData.storeType as any,
        userId: user.id,
      },
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    shouldRedirect = true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as any;
      return { error: zodError.errors[0].message };
    }
    if (error instanceof AuthError) {
        return { error: "خطأ مصادقة: " + error.message };
    }
    return { error: "خطأ داخلي: " + (error as Error).message + "\n" + (error as Error).stack };
  }

  if (shouldRedirect) {
    redirect("/dashboard");
  }
}
