"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleStoreDefaultProducts(storeId: string, currentStatus: boolean) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  try {
    await prisma.store.update({
      where: { id: storeId },
      data: { showDefaultProducts: !currentStatus },
    });
    
    revalidatePath("/admin/default-products");
    
    return { success: "تم تحديث إعدادات المتجر بنجاح" };
  } catch (error) {
    console.error("Toggle Store Default Products Error:", error);
    return { error: "حدث خطأ أثناء تحديث الإعدادات" };
  }
}
