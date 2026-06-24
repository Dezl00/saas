"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function scanMenuWithAI(formData: FormData) {
  const session = await auth();
  if (!session?.user?.storeId) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" };
  }

  const file = formData.get("image") as File;
  if (!file || typeof file.arrayBuffer !== 'function') {
    return { error: "الصورة مطلوبة" };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "مفتاح GEMINI_API_KEY غير موجود في إعدادات البيئة." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `أنت مساعد ذكي متخصص في قراءة قوائم الطعام (Menus). 
قم بتحليل صورة قائمة الطعام المرفقة واستخراج جميع الأقسام والأصناف والأسعار منها بدقة عالية. 
إذا وجدت وصفاً للصنف قم بإضافته، وإذا لم تجد اتركه فارغاً. 
تأكد من أن الأسعار أرقام صحيحة (أو عشرية) بدون رموز العملة.

أرجع النتيجة بصيغة JSON فقط، بدون أي نصوص إضافية وبدون علامات \`\`\`json.
يجب أن يكون الـ JSON بهذا الهيكل تماماً:
{
  "categories": [
    {
      "name": "اسم القسم (مثال: المشويات)",
      "items": [
        {
          "name": "اسم الصنف",
          "description": "وصف الصنف إن وجد",
          "price": 100
        }
      ]
    }
  ]
}`;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // تنظيف النص لاحتمال وجود علامات markdown
    const cleanText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("AI Response Parsing Error:", cleanText);
      return { error: "فشل في فهم استجابة الذكاء الاصطناعي، يرجى المحاولة بصورة أوضح." };
    }

    if (!parsedData.categories || !Array.isArray(parsedData.categories)) {
      return { error: "البيانات المستخرجة غير مكتملة." };
    }

    const storeId = session.user.storeId;
    let addedItemsCount = 0;

    // حفظ البيانات في قاعدة البيانات
    for (const categoryData of parsedData.categories) {
      if (!categoryData.name) continue;

      // البحث عن القسم أو إنشائه
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

      // إضافة الأصناف
      if (categoryData.items && Array.isArray(categoryData.items)) {
        const itemsToCreate = categoryData.items
          .filter((item: any) => item.name && typeof item.price === "number")
          .map((item: any) => ({
            name: item.name,
            description: item.description || null,
            price: item.price,
            categoryId: category!.id,
            storeId,
          }));

        if (itemsToCreate.length > 0) {
          await prisma.menuItem.createMany({
            data: itemsToCreate,
          });
          addedItemsCount += itemsToCreate.length;
        }
      }
    }

    revalidatePath("/dashboard/menu");
    return { success: `تم مسح المنيو بنجاح! إضافة ${addedItemsCount} صنف جديد.` };

  } catch (error: any) {
    console.error("AI Scan Error:", error);
    return { error: `خطأ أثناء الاتصال: ${error.message || "سبب غير معروف"}` };
  }
}
