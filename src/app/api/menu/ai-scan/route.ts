import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const maxDuration = 60; // Allow up to 60 seconds

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.storeId) {
      return NextResponse.json({ error: "غير مصرح لك بالقيام بهذه العملية" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;
    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: "الرجاء إرفاق صورة صالحة" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "مفتاح GEMINI_API_KEY غير موجود في إعدادات البيئة." }, { status: 500 });
    }

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
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([prompt, ...imageParts]);
        responseText = result.response.text();
        break; // Success
      } catch (modelError: any) {
        lastError = modelError;
        const msg = modelError.message || "";
        console.error(`Model ${modelName} failed:`, msg);
        
        // Skip to next model immediately without sleeping to avoid Vercel 504 Timeout
        continue;
      }
    }

    if (!responseText) {
      const errMsg = lastError?.message || "";
      if (errMsg.includes("429") || errMsg.includes("quota")) {
        return NextResponse.json({ error: "تم تجاوز حصة الاستخدام المجانية للذكاء الاصطناعي." }, { status: 429 });
      }
      if (errMsg.includes("503") || errMsg.includes("Service Unavailable")) {
        return NextResponse.json({ error: "السيرفرات تواجه ضغطاً عالياً حالياً. يرجى المحاولة بعد قليل." }, { status: 503 });
      }
      return NextResponse.json({ error: "لم نتمكن من تحليل الصورة بسبب ضغط مؤقت، يرجى المحاولة مرة أخرى." }, { status: 500 });
    }
    
    // تنظيف النص لاحتمال وجود علامات markdown
    const cleanText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    try {
      const parsedData = JSON.parse(cleanText);
      
      if (!parsedData || !Array.isArray(parsedData.categories)) {
        return NextResponse.json({ error: "لم يتم التعرف على هيكل المنيو بشكل صحيح." }, { status: 400 });
      }

      if (parsedData.categories.length === 0) {
        return NextResponse.json({ error: "لم نتمكن من استخراج أي أصناف من الصورة." }, { status: 400 });
      }

      const totalItems = parsedData.categories.reduce((acc: number, cat: any) => acc + (cat.items?.length || 0), 0);
      if (totalItems === 0) {
        return NextResponse.json({ error: "البيانات المستخرجة غير مكتملة." }, { status: 400 });
      }

      return NextResponse.json({ success: true, data: parsedData });

    } catch (parseError) {
      console.error("Failed to parse JSON:", cleanText);
      return NextResponse.json({ error: "حدث خطأ أثناء معالجة بيانات المنيو." }, { status: 500 });
    }

  } catch (error: any) {
    console.error("AI Scan Error:", error);
    return NextResponse.json({ error: `خطأ أثناء الاتصال: ${error.message || "سبب غير معروف"}` }, { status: 500 });
  }
}
