"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { slugifyArabic } from "@/lib/slugify";

export async function submitStep1(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح" };

  const name = formData.get("name") as string;
  const primaryColor = formData.get("primaryColor") as string;
  let logoStr: string | File | null | undefined = formData.get("logo") as string | File | null;
  
  if (logoStr && typeof logoStr !== "string" && logoStr.size > 0) {
    const { uploadImageToCloudinary } = await import("@/lib/upload");
    try {
      logoStr = await uploadImageToCloudinary(logoStr);
    } catch (e) {
      return { error: "فشل رفع الصورة" };
    }
  } else if (typeof logoStr !== "string") {
    logoStr = undefined;
  }

  const baseSlug = slugifyArabic(name) || "store";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const subdomain = `${baseSlug}-${randomSuffix}`;

  await prisma.store.update({
    where: { userId: session.user.id },
    data: {
      name,
      primaryColor,
      ...(logoStr !== undefined ? { logo: logoStr as string } : {}),
      subdomain,
    }
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: 2 }
  });

  redirect("/onboarding?step=2");
}

export async function skipStep(step: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  if (step === 1) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const subdomain = `store-${randomSuffix}`;
    await prisma.store.update({
      where: { userId: session.user.id },
      data: { subdomain }
    });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: step + 1 }
  });

  if (step === 3) {
    redirect("/dashboard");
  } else {
    redirect(`/onboarding?step=${step + 1}`);
  }
}

export async function submitStep2(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح" };

  const phone = formData.get("phone") as string;
  const whatsappNumber = formData.get("whatsappNumber") as string;
  const address = formData.get("address") as string;

  await prisma.store.update({
    where: { userId: session.user.id },
    data: { phone, whatsappNumber, address }
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: 3 }
  });

  redirect("/onboarding?step=3");
}

export async function finishOnboarding() {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: 4 } // mark as finished
  });

  redirect("/dashboard");
}
