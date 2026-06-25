import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { StoreCheckoutView } from "./StoreCheckoutView";

export async function generateMetadata(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const store = await prisma.store.findUnique({
    where: { subdomain: params.subdomain },
  });

  if (!store) return { title: "المتجر غير موجود" };

  return {
    title: `إتمام الطلب | ${store.name}`,
  };
}

export default async function CheckoutPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const store = await prisma.store.findUnique({
    where: { subdomain: params.subdomain },
    include: {
      branches: { where: { isActive: true } },
      deliveryAreas: { where: { isActive: true } }
    }
  });

  if (!store || store.status === "DELETED" || store.status === "SUSPENDED") {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <StoreCheckoutView 
        store={{ 
          id: store.id, 
          name: store.name, 
          currency: store.currency, 
          whatsappNumber: store.whatsappNumber,
          enableWhatsappOrders: store.enableWhatsappOrders
        }} 
        branches={store.branches.map(b => ({ id: b.id, name: b.name, address: b.address }))}
        deliveryAreas={store.deliveryAreas.map(a => ({ id: a.id, name: a.name, fee: Number(a.deliveryFee) }))}
      />
    </div>
  );
}
