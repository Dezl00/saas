import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadUrlToCloudinary } from "@/lib/upload";

export const maxDuration = 60; // Allow 60s for fetching and uploading

export async function POST(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.storeId) {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
    }

    const itemId = params.itemId;
    const body = await req.json().catch(() => ({}));
    const seed = body.seed || Math.floor(Math.random() * 100000);

    const item = await prisma.menuItem.findFirst({
      where: {
        id: itemId,
        storeId: session.user.storeId,
      },
    });

    if (!item) {
      return NextResponse.json({ error: "الصنف غير موجود" }, { status: 404 });
    }

    // البناء الثابت للـ Prompt بناءً على نصيحة المستخدم
    const promptString = `Professional food photography, ${item.name}, restaurant menu, white background, high quality, soft lighting, ultra realistic, 4k`;
    
    // استخدام Pollinations.ai بشكل مجاني وبدون توكنز
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptString)}?width=800&height=800&nologo=true&seed=${seed}`;

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
    return NextResponse.json({ error: "فشل توليد الصورة أو رفعها" }, { status: 500 });
  }
}
