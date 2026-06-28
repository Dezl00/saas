import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export async function RecentOrders({ storeId, currency }: { storeId: string, currency?: string }) {
  const recentOrders = await prisma.order.findMany({
    where: { storeId },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
      <div className="p-6 border-b border-surface-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-surface-950">أحدث الطلبات</h2>
        <Link
          href="/dashboard/orders"
          className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          عرض الكل
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-start">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-100">
              <th className="px-6 py-4 text-xs font-bold text-surface-800/60 uppercase text-start">رقم الطلب</th>
              <th className="px-6 py-4 text-xs font-bold text-surface-800/60 uppercase text-start">العميل</th>
              <th className="px-6 py-4 text-xs font-bold text-surface-800/60 uppercase text-start">الإجمالي</th>
              <th className="px-6 py-4 text-xs font-bold text-surface-800/60 uppercase text-start">الحالة</th>
              <th className="px-6 py-4 text-xs font-bold text-surface-800/60 uppercase text-start">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-50 transition-colors">
                <td className="px-6 py-4 font-medium text-surface-950">#{order.orderNumber}</td>
                <td className="px-6 py-4 text-surface-800/80">{order.customerName}</td>
                <td className="px-6 py-4 font-bold text-surface-950">{formatPrice(Number(order.total), currency)}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary-700">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-surface-800/60">
                  {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-surface-800/50">
                  لا توجد طلبات بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
