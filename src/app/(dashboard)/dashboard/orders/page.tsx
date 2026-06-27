import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { ShoppingBag, Truck, Store as StoreIcon, Clock } from "lucide-react";
import { updateOrderStatus } from "./actions";
import { formatPrice } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";

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
            <div key={order.id} className="bg-white border border-surface-200 p-6 flex flex-col md:flex-row gap-6">
              {/* Order Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between border-b border-surface-100 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-surface-950">طلب رقم #{order.orderNumber}</h3>
                    <p className="text-sm text-surface-500 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleString('ar-EG')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 font-bold text-sm ${statusMap[order.status]?.color || 'bg-surface-100'}`}>
                    {statusMap[order.status]?.label || order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-surface-500">العميل</p>
                    <p className="font-bold text-surface-950">{order.customerName}</p>
                    <p className="text-sm text-surface-950" dir="ltr">{order.customerPhone}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-surface-500">نوع الطلب</p>
                    {order.deliveryType === "DELIVERY" ? (
                      <div>
                        <p className="font-bold text-surface-950 flex items-center gap-1">
                          <Truck className="w-4 h-4" /> توصيل ({order.deliveryArea?.name})
                        </p>
                        <p className="text-sm text-surface-950">{order.customerAddress}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-surface-950 flex items-center gap-1">
                          <StoreIcon className="w-4 h-4" /> استلام من الفرع
                        </p>
                        <p className="text-sm text-surface-950">{order.branch?.name}</p>
                      </div>
                    )}
                  </div>
                </div>

                {order.notes && (
                  <div className="bg-yellow-50 p-3 border border-yellow-200 text-yellow-800 text-sm">
                    <strong>ملاحظات العميل:</strong> {order.notes}
                  </div>
                )}
              </div>

              {/* Order Items & Actions */}
              <div className="w-full md:w-80 bg-surface-50 border border-surface-200 p-4 space-y-4">
                <h4 className="font-bold text-surface-950 border-b border-surface-200 pb-2">تفاصيل الفاتورة</h4>
                <ul className="space-y-2 text-sm">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium text-surface-950">{formatPrice(Number(item.price), store?.currency)}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t border-surface-200 pt-2 space-y-1 text-sm">
                  <div className="flex justify-between text-surface-600">
                    <span>المجموع</span>
                    <span>{formatPrice(Number(order.subtotal), store?.currency)}</span>
                  </div>
                  {Number(order.deliveryFee) > 0 && (
                    <div className="flex justify-between text-surface-600">
                      <span>التوصيل</span>
                      <span>{formatPrice(Number(order.deliveryFee), store?.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-lg text-primary-600 pt-2 border-t border-surface-200">
                    <span>الإجمالي</span>
                    <span>{formatPrice(Number(order.total), store?.currency)}</span>
                  </div>
                </div>

                <form action={updateOrderStatus as any} className="pt-4 border-t border-surface-200">
                  <input type="hidden" name="orderId" value={order.id} />
                  <label className="block text-sm font-bold text-surface-950 mb-2">تحديث حالة الطلب</label>
                  <div className="flex gap-2">
                    <select name="status" defaultValue={order.status} className="flex-1 p-2 bg-white border border-surface-200 focus:border-primary-500 outline-none">
                      <option value="PENDING">قيد الانتظار</option>
                      <option value="CONFIRMED">مؤكد (جاري التحضير)</option>
                      <option value="DELIVERED">مكتمل (تم التسليم)</option>
                      <option value="CANCELLED">ملغي</option>
                    </select>
                    <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors">
                      حفظ
                    </button>
                  </div>
                </form>
              </div>
            </div>
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

