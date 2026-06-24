"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updatePlatformSettings(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "غير مصرح" };

  const name = formData.get("name") as string;
  let logoStr = undefined;
  const logoFile = formData.get("logo") as File | null;
  
  if (logoFile && logoFile.size > 0) {
    const { uploadImageToCloudinary } = await import("@/lib/upload");
    try {
      logoStr = await uploadImageToCloudinary(logoFile);
    } catch (e) {
      console.error("Upload error", e);
      return { error: "فشل رفع الصورة" };
    }
  }

  if (!name) return { error: "اسم المنصة مطلوب" };

  await prisma.platformSetting.upsert({
    where: { id: "1" },
    update: { 
      name, 
      ...(logoStr ? { logo: logoStr } : {}) 
    },
    create: { 
      id: "1", 
      name, 
      logo: logoStr || "" 
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function updateAdminPassword(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "غير مصرح" };

  const password = formData.get("password") as string;
  if (!password || password.length < 6) return { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
  
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password }
  });

  return { success: true };
}
