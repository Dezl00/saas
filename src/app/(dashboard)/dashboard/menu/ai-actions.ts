"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
      console.error("AI Response Parsing Error:", cleanText);
      return { error: "فشل في فهم استجابة الذكاء الاصطناعي، يرجى المحاولة بصورة أوضح." };
    }

    if (!parsedData.categories || !Array.isArray(parsedData.categories)) {
      return { error: "البيانات المستخرجة غير مكتملة." };
    }

    return { success: true, data: parsedData };

  } catch (error: any) {
    console.error("AI Scan Error:", error);
    return { error: `خطأ أثناء الاتصال: ${error.message || "سبب غير معروف"}` };
  }
}

export async function importAIMenuItems(parsedData: any) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  const storeId = session.user.storeId;
  let addedItemsCount = 0;

  try {
    for (const categoryData of parsedData.categories) {
      if (!categoryData.name) continue;

      let category = await prisma.category.findFirst({
        where: { storeId, name: categoryData.name },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryData.name,
            storeId,
          },
        });
      }

      if (categoryData.items && Array.isArray(categoryData.items)) {
        for (const item of categoryData.items) {
          if (!item.name || typeof item.price !== "number") continue;
          
          const sizesData = Array.isArray(item.sizes) ? item.sizes.filter((s: any) => s.name && s.price).map((s: any) => ({
            name: s.name,
            price: Number(s.price)
          })) : [];

          await prisma.menuItem.create({
            data: {
              name: item.name,
              description: item.description || null,
              price: item.price,
              categoryId: category!.id,
              storeId,
              ...(sizesData.length > 0 && {
                sizes: {
                  create: sizesData
                }
              })
            }
          });
          addedItemsCount++;
        }
      }
    }

    revalidatePath("/dashboard/menu");
    return { success: `تم حفظ المنيو بنجاح! إضافة ${addedItemsCount} صنف جديد.` };
  } catch (error: any) {
    console.error("AI Import Error:", error);
    return { error: "حدث خطأ أثناء حفظ البيانات." };
  }
}
