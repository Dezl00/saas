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
    
    // Models to try in order - using the lightest models first
    const modelsToTry = ["gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash"];

    const prompt = `أنت مساعد ذكي متخصص في قراءة قوائم الطعام (Menus). 
قم بتحليل صورة قائمة الطعام المرفقة واستخراج جميع الأقسام والأصناف والأسعار منها بدقة عالية. 
إذا وجدت وصفاً للصنف قم بإضافته، وإذا لم تجد اتركه فارغاً. 
تأكد من أن الأسعار أرقام صحيحة (أو عشرية) بدون رموز العملة.
إذا كان للصنف أحجام مختلفة بأسعار مختلفة (مثل: صغير، وسط، كبير)، ضع السعر الأساسي (أو الأصغر) في حقل price، وأضف مصفوفة sizes تحتوي على اسم الحجم وسعره. إذا لم يكن هناك أحجام، اترك المصفوفة فارغة.

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
          "price": 100,
          "sizes": [
            { "name": "وسط", "price": 150 },
            { "name": "كبير", "price": 200 }
          ]
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

    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      // Try each model up to 2 times (for 503 retries)
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent([prompt, ...imageParts]);
          responseText = result.response.text();
          break; // Success
        } catch (modelError: any) {
          lastError = modelError;
          const msg = modelError.message || "";
          console.error(`Model ${modelName} attempt ${attempt + 1} failed:`, msg);
          
          // 503 = temporary overload, wait and retry same model
          if (msg.includes("503") || msg.includes("Service Unavailable")) {
            await new Promise(r => setTimeout(r, 4000)); // Wait 4 seconds
            continue; // Retry same model
          }
          // Quota or not-found = skip to next model
          if (msg.includes("429") || msg.includes("quota") || msg.includes("404") || msg.includes("not found")) {
            break; // Break inner loop, try next model
          }
          
          // Other errors = just break and let it try the next model
          break;
        }
      }
      if (responseText) break; // Got a result, stop trying models
    }

    if (!responseText) {
      const errMsg = lastError?.message || "";
      if (errMsg.includes("429") || errMsg.includes("quota")) {
        return { error: "تم تجاوز حصة الاستخدام المجانية للذكاء الاصطناعي." };
      }
      if (errMsg.includes("503") || errMsg.includes("Service Unavailable")) {
        return { error: "السيرفرات تواجه ضغطاً عالياً حالياً. يرجى المحاولة بعد قليل." };
      }
      return { error: "لم نتمكن من تحليل الصورة بسبب ضغط مؤقت، يرجى المحاولة مرة أخرى." };
    }
    
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
