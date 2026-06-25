import Groq from "groq-sdk";
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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "مفتاح GROQ_API_KEY غير موجود في إعدادات البيئة." }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");
    
    const groq = new Groq({ apiKey: apiKey });
    const modelsToTry = [
      "llama-3.2-90b-vision-preview",
      "llama-3.2-11b-vision-preview"
    ];

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

    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      console.log("Trying model:", modelName);
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${file.type};base64,${base64Data}`,
                  },
                },
              ],
            },
          ],
          model: modelName,
          temperature: 0.1,
          max_tokens: 4096,
        });

        responseText = chatCompletion.choices[0]?.message?.content || "";
        break; // Success
      } catch (modelError: any) {
        lastError = modelError;
        const msg = modelError.message || "";
        console.error(`Model ${modelName} failed:`, msg);
        
        if (
          msg.includes("404") ||
          msg.includes("503") ||
          msg.includes("429") ||
          msg.includes("rate_limit_exceeded")
        ) {
          continue;
        }

        throw modelError;
      }
    }

    if (!responseText) {
      const errMsg = lastError?.message || "";
      if (errMsg.includes("429") || errMsg.includes("rate_limit_exceeded")) {
        return NextResponse.json({ error: "تم تجاوز حصة الاستخدام للذكاء الاصطناعي (Groq)." }, { status: 429 });
      }
      if (errMsg.includes("503")) {
        return NextResponse.json({ error: "السيرفرات تواجه ضغطاً عالياً حالياً. يرجى المحاولة بعد قليل." }, { status: 503 });
      }
      return NextResponse.json({ error: `خطأ من الذكاء الاصطناعي: ${errMsg}` }, { status: 500 });
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
