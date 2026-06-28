import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { ShoppingBag, Truck, Store as StoreIcon, Clock } from "lucide-react";
import { updateOrderStatus } from "./actions";
import { formatPrice } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { OrderCard } from "@/components/dashboard/OrderCard";

export const metadata = {
  title: "الطلبات | لوحة التحكم",
};

const statusMap: Record<string, { label: string, color: string }> = {
  PENDING: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "مؤكد", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "جاري التجهيز", color: "bg-purple-100 text-purple-800" },
  READY: { label: "جاهز", color: "bg-indigo-100 text-indigo-800" },
  DELIVERED: { label: "مكتمل", color: "bg-success-100 text-success-800" },
  CANCELLED: { label: "ملغي", color: "bg-error-100 text-error-800" },
};

export default async function OrdersPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  
  const session = await auth();
  
  if (!session?.user?.storeId) {
    return null;
  }

  const [store, totalItems] = await Promise.all([
    prisma.store.findUnique({ where: { id: session.user.storeId } }),
    prisma.order.count({ where: { storeId: session.user.storeId } })
  ]);
  
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const orders = await prisma.order.findMany({
    where: { storeId: session.user.storeId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      branch: true,
      deliveryArea: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize
  });

  return (
    <div className="animate-fade-in pb-10">
      <Breadcrumb title="الطلبات الواردة" />
      
      <div className="mt-6 space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-surface-200">
            <ShoppingBag className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <p className="text-lg text-surface-500 font-medium">لا توجد طلبات حتى الآن.</p>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard key={order.id} order={order} currency={store?.currency} />
          ))
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

