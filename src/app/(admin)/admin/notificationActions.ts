"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAdminNotifications() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const unreadCount = await prisma.adminNotification.count({
    where: { isRead: false },
  });

  const recent = await prisma.adminNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return { unreadCount, recent };
}

export async function markAdminNotificationAsRead(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.adminNotification.update({
    where: { id },
    data: { isRead: true },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function markAllAdminNotificationsAsRead() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.adminNotification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/admin");
  return { success: true };
}
