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

    // البناء الثابت للـ Prompt بناءً على نصيحة المستخدم
    const categoryName = item.category?.name ? `${item.category.name} category, ` : "";
    const itemDescription = item.description ? `Description: ${item.description}, ` : "";
    
    const promptString = `Professional food photography, ${item.name}, ${categoryName}${itemDescription}restaurant menu item, delicious, fresh ingredients, white background, high quality, soft lighting, ultra realistic, 4k`;
    
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
