import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadUrlToCloudinary } from "@/lib/upload";

export const maxDuration = 60; // Allow 60s for fetching and uploading

export async function POST(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
    }

    const resolvedParams = await params;
    const itemId = resolvedParams.itemId;
    const body = await req.json().catch(() => ({}));
    const seed = body.seed || Math.floor(Math.random() * 100000);

    const item = await prisma.menuItem.findFirst({
      where: {
        id: itemId,
        ...(session.user.role !== "ADMIN" ? { storeId: session.user.storeId! } : {}),
      },
      include: {
        category: true,
      }
    });

    if (!item || (session.user.role === "ADMIN" && item.storeId !== "DEFAULT_STORE")) {
      return NextResponse.json({ error: "الصنف غير موجود أو غير مصرح" }, { status: 404 });
    }

    // Use Gemini to generate a highly descriptive English prompt based on the item details
    const categoryName = item.category?.name ? `Category: ${item.category.name}, ` : "";
    const itemDescription = item.description ? `Description: ${item.description}` : "";
    
    // We will use Gemini to translate and enhance the prompt
    let promptString = `Professional food photography, ${item.name}, ${categoryName}${itemDescription}restaurant menu item, delicious, fresh ingredients, white background, high quality, soft lighting, ultra realistic, 4k`;
    
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const apiKeyString = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
      const apiKeys = apiKeyString.split(",").map((key: string) => key.trim()).filter((key: string) => key.length > 0);
      const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
      
      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const aiPrompt = `You are an expert food photography prompt engineer. I have a menu item from an Arabic or English menu.
Item Name: ${item.name}
${categoryName}
${itemDescription}

Task: Write a concise, highly descriptive English prompt (max 30 words) for an AI image generator to create a mouth-watering, ultra-realistic, professional food photograph of this exact dish on a clean background. Do not include any text, labels, or extra instructions, just the prompt itself.`;
        
        const result = await model.generateContent(aiPrompt);
        const responseText = result.response.text().trim();
        if (responseText) {
          promptString = responseText + ", professional food photography, restaurant menu item, delicious, ultra realistic, 4k";
        }
      }
    } catch (e) {
      console.error("Gemini prompt enhancement failed, falling back to basic prompt", e);
    }
    
    // استخدام Pollinations.ai بشكل مجاني وبدون توكنز
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptString)}?width=800&height=800&nologo=true&seed=${seed}&model=flux`;

    // الرفع المباشر من الرابط إلى Cloudinary لتجنب فقدان الصور مستقبلاً
    const cloudinaryUrl = await uploadUrlToCloudinary(pollinationsUrl);

    // تحديث الصنف في قاعدة البيانات بالصورة الجديدة
    await prisma.menuItem.update({
      where: { id: itemId },
      data: { image: cloudinaryUrl }
    });

    return NextResponse.json({ success: true, image: cloudinaryUrl });

  } catch (error: any) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "فشل توليد الصورة أو رفعها: " + (error.message || String(error)) }, { status: 500 });
  }
}
