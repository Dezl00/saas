"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMenuItem(formData: FormData) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0");
  let imageStr = formData.get("image") as string | File | null;
  if (imageStr && typeof imageStr !== "string" && imageStr.size > 0) {
    const { uploadImageToCloudinary } = await import("@/lib/upload");
    try {
      imageStr = await uploadImageToCloudinary(imageStr);
    } catch (e) {
      console.error("Upload error", e);
      return { error: "فشل رفع الصورة" };
    }
  } else if (typeof imageStr !== "string") {
    imageStr = null;
  }

  const sizesStr = formData.get("sizes") as string;
  const addonsStr = formData.get("addons") as string;
  
  let sizes: any[] = [];
  let addons: any[] = [];
  try {
    if (sizesStr) sizes = JSON.parse(sizesStr);
    if (addonsStr) addons = JSON.parse(addonsStr);
  } catch (e) {
    // Ignore invalid JSON
  }

  if (!name || isNaN(price) || !categoryId) {
    return { error: "الاسم، السعر، والقسم بيانات مطلوبة" };
  }

  try {
    // التأكد أن القسم يتبع متجر المستخدم
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (category?.storeId !== session.user.storeId) {
      return { error: "القسم المحدد غير صحيح" };
    }

    await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        image: imageStr || null,
        sortOrder,
        categoryId,
        storeId: session.user.storeId,
        sizes: {
          create: sizes.filter(s => s.name && s.price).map(s => ({
            name: s.name,
            price: parseFloat(s.price),
          }))
        },
        addons: {
          create: addons.filter(a => a.name && a.price).map(a => ({
            name: a.name,
            price: parseFloat(a.price),
          }))
        }
      },
    });

    revalidatePath("/dashboard/menu");
    return { success: "تم إضافة الصنف بنجاح" };
  } catch (error) {
    console.error("Create Menu Item Error:", error);
    return { error: "حدث خطأ أثناء إضافة الصنف" };
  }
}

export async function updateMenuItem(menuItemId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0");

  let imageStr: string | File | null | undefined = formData.get("image") as string | File | null;
  if (imageStr && typeof imageStr !== "string" && imageStr.size > 0) {
    const { uploadImageToCloudinary } = await import("@/lib/upload");
    try {
      imageStr = await uploadImageToCloudinary(imageStr);
    } catch (e) {
      console.error("Upload error", e);
      return { error: "فشل رفع الصورة" };
    }
  } else if (typeof imageStr !== "string") {
    imageStr = undefined; // Do not update image if file was empty and old string wasn't provided
  }

  const sizesStr = formData.get("sizes") as string;
  const addonsStr = formData.get("addons") as string;
  
  let sizes: any[] = [];
  let addons: any[] = [];
  try {
    if (sizesStr) sizes = JSON.parse(sizesStr);
    if (addonsStr) addons = JSON.parse(addonsStr);
  } catch (e) {}

  if (!name || isNaN(price) || !categoryId) {
    return { error: "الاسم، السعر، والقسم بيانات مطلوبة" };
  }

  try {
    const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
    if (item?.storeId !== session.user.storeId) return { error: "غير مصرح لك" };

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (category?.storeId !== session.user.storeId) return { error: "القسم المحدد غير صحيح" };

    await prisma.menuItem.update({
      where: { id: menuItemId },
      data: {
        name,
        description,
        price,
        ...(imageStr !== undefined ? { image: imageStr || null } : {}),
        sortOrder,
        categoryId,
        sizes: {
          deleteMany: {},
          create: sizes.filter(s => s.name && s.price).map(s => ({
            name: s.name,
            price: parseFloat(s.price),
          }))
        },
        addons: {
          deleteMany: {},
          create: addons.filter(a => a.name && a.price).map(a => ({
            name: a.name,
            price: parseFloat(a.price),
          }))
        }
      },
    });

    revalidatePath("/dashboard/menu");
    return { success: "تم تحديث الصنف بنجاح" };
  } catch (error) {
    console.error("Update Menu Item Error:", error);
    return { error: "حدث خطأ أثناء تحديث الصنف" };
  }
}

export async function toggleMenuItemStatus(menuItemId: string, currentStatus: boolean) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (item?.storeId !== session.user.storeId) {
      return { error: "غير مصرح لك بتعديل هذا الصنف" };
    }

    await prisma.menuItem.update({
      where: { id: menuItemId },
      data: { isAvailable: !currentStatus },
    });

    revalidatePath("/dashboard/menu");
    return { success: "تم تحديث حالة الصنف" };
  } catch (error) {
    console.error("Toggle Menu Item Error:", error);
    return { error: "حدث خطأ أثناء تحديث الصنف" };
  }
}

export async function deleteMenuItem(menuItemId: string) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (item?.storeId !== session.user.storeId) {
      return { error: "غير مصرح لك بحذف هذا الصنف" };
    }

    await prisma.menuItem.delete({
      where: { id: menuItemId },
    });

    revalidatePath("/dashboard/menu");
    return { success: "تم حذف الصنف بنجاح" };
  } catch (error) {
    console.error("Delete Menu Item Error:", error);
    return { error: "حدث خطأ أثناء حذف الصنف." };
  }
}

export async function bulkDeleteMenuItems(menuItemIds: string[]) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  try {
    // First, verify all items belong to the store
    const items = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        storeId: session.user.storeId
      }
    });

    if (items.length !== menuItemIds.length) {
      return { error: "بعض الأصناف المحددة غير موجودة أو لا تملك صلاحية حذفها" };
    }

    await prisma.menuItem.deleteMany({
      where: {
        id: { in: menuItemIds },
        storeId: session.user.storeId
      }
    });

    revalidatePath("/dashboard/menu");
    return { success: `تم حذف ${items.length} صنف بنجاح` };
  } catch (error: any) {
    console.error("Bulk Delete Menu Items Error:", error);
    
    if (error.code === 'P2003') {
      return { error: "لا يمكن حذف بعض الأصناف لأنها مرتبطة بطلبات سابقة." };
    }
    
    return { error: `حدث خطأ أثناء الحذف: ${error.message || "سبب غير معروف"}` };
  }
}
