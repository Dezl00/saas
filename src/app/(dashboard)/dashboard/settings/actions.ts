"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const logo = formData.get("logo") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const currency = formData.get("currency") as string || "EGP";

  if (!name) {
    return { error: "اسم المتجر مطلوب" };
  }

  try {
    await prisma.store.update({
      where: { id: session.user.storeId },
      data: {
        name,
        description,
        logo,
        phone,
        address,
        currency,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: "تم حفظ الإعدادات الأساسية بنجاح" };
  } catch (error) {
    console.error("Update Store Error:", error);
    return { error: "حدث خطأ أثناء حفظ الإعدادات" };
  }
}

export async function updateSubdomain(formData: FormData) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  const subdomain = formData.get("subdomain") as string;

  if (!subdomain || subdomain.trim() === "") {
    return { error: "يرجى كتابة الرابط أولاً" };
  }

  // التأكد من صيغة الرابط (أحرف إنجليزية وأرقام وشرطة فقط)
  const regex = /^[a-z0-9-]+$/;
  if (!regex.test(subdomain)) {
    return { error: "الرابط يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام فقط، وبدون مسافات." };
  }

  try {
    // التحقق من أن الـ subdomain غير مستخدم لمتجر آخر
    const existing = await prisma.store.findUnique({
      where: { subdomain }
    });

    if (existing && existing.id !== session.user.storeId) {
      return { error: "عذراً، هذا الرابط مستخدم من قبل متجر آخر. يرجى اختيار رابط مختلف." };
    }

    await prisma.store.update({
      where: { id: session.user.storeId },
      data: { subdomain },
    });

    revalidatePath("/dashboard/settings");
    return { success: "تم حجز الرابط بنجاح! متجرك الآن متاح عبر هذا الرابط." };
  } catch (error) {
    console.error("Update Subdomain Error:", error);
    return { error: "حدث خطأ أثناء حجز الرابط" };
  }
}

export async function updateContactSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  const whatsappNumber = formData.get("whatsappNumber") as string;
  const enableWhatsappOrders = formData.get("enableWhatsappOrders") === "on";
  const facebookUrl = formData.get("facebookUrl") as string;
  const instagramUrl = formData.get("instagramUrl") as string;
  const twitterUrl = formData.get("twitterUrl") as string;
  const tiktokUrl = formData.get("tiktokUrl") as string;
  const snapchatUrl = formData.get("snapchatUrl") as string;

  try {
    await prisma.store.update({
      where: { id: session.user.storeId },
      data: {
        whatsappNumber,
        enableWhatsappOrders,
        facebookUrl,
        instagramUrl,
        twitterUrl,
        tiktokUrl,
        snapchatUrl,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: "تم حفظ إعدادات التواصل بنجاح" };
  } catch (error) {
    console.error("Update Contact Error:", error);
    return { error: "حدث خطأ أثناء حفظ إعدادات التواصل" };
  }
}
