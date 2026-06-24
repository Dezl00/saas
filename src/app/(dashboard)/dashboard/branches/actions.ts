"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addBranch(formData: FormData) {
  const session = await auth();
  if (!session?.user?.storeId) return { error: "غير مصرح" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  if (!name) return { error: "الاسم مطلوب" };

  await prisma.branch.create({
    data: {
      name,
      phone,
      address,
      storeId: session.user.storeId
    }
  });

  revalidatePath("/dashboard/branches");
  return { success: true };
}

export async function toggleBranch(formData: FormData) {
  const session = await auth();
  if (!session?.user?.storeId) return { error: "غير مصرح" };

  const branchId = formData.get("branchId") as string;
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  
  if (branch && branch.storeId === session.user.storeId) {
    await prisma.branch.update({
      where: { id: branchId },
      data: { isActive: !branch.isActive }
    });
    revalidatePath("/dashboard/branches");
  }
}

export async function deleteBranch(branchId: string) {
  const session = await auth();
  if (!session?.user?.storeId) return { error: "غير مصرح" };

  await prisma.branch.deleteMany({
    where: { 
      id: branchId,
      storeId: session.user.storeId 
    }
  });
  
  revalidatePath("/dashboard/branches");
}
