"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function globalSearch(query: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  if (!query || query.trim().length < 1) return { users: [], stores: [] };

  const search = query.trim();

  // Search stores (by name or subdomain)
  const stores = await prisma.store.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { subdomain: { contains: search, mode: "insensitive" } },
        { customDomain: { contains: search, mode: "insensitive" } },
      ],
    },
    include: {
      user: { select: { name: true, email: true, phone: true } },
    },
    take: 5,
  });

  // Search users (by name, email, or phone)
  const users = await prisma.user.findMany({
    where: {
      role: "OWNER",
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ],
    },
    include: {
      store: { select: { name: true, status: true, type: true, subdomain: true } },
    },
    take: 5,
  });

  return { stores, users };
}
