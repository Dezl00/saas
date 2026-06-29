"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPaymentMethodAction(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const accountInfo = formData.get("accountInfo") as string;
    const instructions = formData.get("instructions") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string, 10);
    const isActive = formData.get("isActive") === "true";

    if (!name || !accountInfo) {
      return { error: "يرجى تعبئة الحقول المطلوبة (الاسم ومعلومات الحساب)" };
    }

    await prisma.platformPaymentMethod.create({
      data: {
        name,
        accountInfo,
        instructions,
        sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
        isActive,
      },
    });

    revalidatePath("/admin/payment-methods");
    return { success: true };
  } catch (error) {
    console.error("Create Payment Method Error:", error);
    return { error: "حدث خطأ أثناء إضافة طريقة الدفع" };
  }
}
