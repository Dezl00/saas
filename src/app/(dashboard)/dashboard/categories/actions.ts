"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0");

  if (!name) {
    return { error: "اسم القسم مطلوب" };
  }

  try {
    await prisma.category.create({
      data: {
        name,
        description,
        sortOrder,
        storeId: session.user.storeId,
      },
    });

    revalidatePath("/dashboard/categories");
    return { success: "تم إضافة القسم بنجاح" };
  } catch (error) {
    console.error("Create Category Error:", error);
    return { error: "حدث خطأ أثناء إضافة القسم" };
  }
}

export async function toggleCategoryStatus(categoryId: string, currentStatus: boolean) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  try {
    // التأكد أن القسم يخص المتجر الحالي
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (category?.storeId !== session.user.storeId) {
      return { error: "غير مصرح لك بتعديل هذا القسم" };
    }

    await prisma.category.update({
      where: { id: categoryId },
      data: { isActive: !currentStatus },
    });

    revalidatePath("/dashboard/categories");
    return { success: "تم تحديث حالة القسم" };
  } catch (error) {
    console.error("Toggle Category Error:", error);
    return { error: "حدث خطأ أثناء تحديث القسم" };
  }
}

export async function deleteCategory(categoryId: string) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (category?.storeId !== session.user.storeId) {
      return { error: "غير مصرح لك بحذف هذا القسم" };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/dashboard/categories");
    return { success: "تم حذف القسم بنجاح" };
  } catch (error) {
    console.error("Delete Category Error:", error);
    return { error: "لا يمكن حذف قسم يحتوي على أصناف. احذف الأصناف أولاً." };
  }
}
