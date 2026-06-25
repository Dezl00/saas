import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StoreCartView } from "./StoreCartView";

export async function generateMetadata(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const store = await prisma.store.findUnique({
    where: { subdomain: params.subdomain },
  });

  if (!store) return { title: "المتجر غير موجود" };

  return {
    title: `سلة المشتريات | ${store.name}`,
  };
}

export default async function CartPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const store = await prisma.store.findUnique({
    where: { subdomain: params.subdomain },
  });

  if (!store || store.status === "DELETED" || store.status === "SUSPENDED") {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <StoreCartView store={{ id: store.id, name: store.name, currency: store.currency, primaryColor: store.primaryColor }} />
    </div>
  );
}
