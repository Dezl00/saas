import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ShoppingBag, DollarSign, FolderTree, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ShareStoreButton } from "@/components/dashboard/ShareStoreButton";

export default async function DashboardPage() {
  const session = await auth();
  const storeId = session?.user?.storeId;

  if (!storeId) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-surface-950">لا يوجد متجر مرتبط بحسابك</h2>
      </div>
    );
  }

  const [store, ordersCount, revenueResult, menuItemsCount, categoriesCount, recentOrders] =
    await Promise.all([
      prisma.store.findUnique({ where: { id: storeId }, include: { domains: true } }),
      prisma.order.count({ where: { storeId } }),
      prisma.order.aggregate({
        where: { storeId, paymentStatus: "CONFIRMED" },
        _sum: { total: true },
      }),
      prisma.menuItem.count({ where: { storeId } }),
      prisma.category.count({ where: { storeId } }),
      prisma.order.findMany({
        where: { storeId },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const stats = [
    {
      title: "إجمالي الطلبات",
      value: ordersCount,
      icon: ShoppingBag,
      cardClasses: "bg-primary-50 border-primary-100 text-primary-950",
      iconClasses: "bg-primary-100 text-primary-600",
      labelClasses: "text-primary-800/80",
    },
    {
      title: "إجمالي المبيعات",
      value: formatPrice(Number(revenueResult._sum.total || 0), store?.currency),
      icon: DollarSign,
      cardClasses: "bg-green-50 border-green-100 text-green-950",
      iconClasses: "bg-green-100 text-green-600",
      labelClasses: "text-green-800/80",
    },
    {
      title: "إجمالي الأقسام",
      value: categoriesCount,
      icon: FolderTree,
      cardClasses: "bg-accent-50 border-accent-100 text-accent-950",
      iconClasses: "bg-accent-100 text-accent-600",
      labelClasses: "text-accent-800/80",
    },
    {
      title: "إجمالي الأصناف",
      value: menuItemsCount,
      icon: UtensilsCrossed,
      cardClasses: "bg-yellow-50 border-yellow-100 text-yellow-950",
      iconClasses: "bg-yellow-100 text-yellow-600",
      labelClasses: "text-yellow-800/80",
    },
  ];

  return (
    <div className="space-y-8">
      {(store?.subdomain || store?.domains?.[0]?.name) && (
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-primary-900">رابط متجرك جاهز!</h3>
            <p className="text-sm text-primary-700 mt-1">شارك هذا الرابط مع عملائك لاستقبال الطلبات</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <ShareStoreButton 
              storeUrl={store.domains?.[0]?.name ? `https://${store.domains[0].name}` : `https://${store.subdomain}.menura.site`} 
              storeName={store.name}
              qrUrl={`https://menura.site/qr/${store.id}`}
            />
            <Link
              href={store.domains?.[0]?.name ? `https://${store.domains[0].name}` : `https://${store.subdomain}.menura.site`}
              target="_blank"
              className="px-6 py-2 bg-white text-primary-600 font-bold rounded-xl border border-primary-200 hover:bg-primary-50 transition-colors w-full sm:w-auto text-center"
            >
              زيارة المتجر
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Recent Orders */}
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
                  <td className="px-6 py-4 font-bold text-surface-950">{formatPrice(Number(order.total), store?.currency)}</td>
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
    </div>
  );
}
