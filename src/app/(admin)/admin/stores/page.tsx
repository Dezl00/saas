import { prisma } from "@/lib/prisma";
import { Store, MoreVertical, Eye, Pause, Trash2, Play } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function toggleStoreStatus(formData: FormData) {
  "use server";
  const storeId = formData.get("storeId") as string;
  const action = formData.get("action") as string;

  if (action === "suspend") {
    await prisma.store.update({
      where: { id: storeId },
      data: { status: "SUSPENDED" },
    });
  } else if (action === "activate") {
    await prisma.store.update({
      where: { id: storeId },
      data: { status: "ACTIVE" },
    });
  } else if (action === "delete") {
    await prisma.store.update({
      where: { id: storeId },
      data: { status: "DELETED" },
    });
  }

  revalidatePath("/admin/stores");
}

export default async function AdminStoresPage() {
  const stores = await prisma.store.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { orders: true, menuItems: true, categories: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-surface-950">إدارة المتاجر</h1>
        <p className="text-surface-800/60 mt-1">
          عرض وإدارة جميع المتاجر المسجلة
        </p>
      </div>

      <div className="grid gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6 card-hover"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Store Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
                  <Store className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-surface-950">
                    {store.name}
                  </h3>
                  <p className="text-sm text-surface-800/60">
                    {store.user.name} • {store.user.email}
                  </p>
                  {store.subdomain && (
                    <p className="text-xs text-primary-500 mt-0.5">
                      {store.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-surface-950">
                    {store._count.categories}
                  </p>
                  <p className="text-xs text-surface-800/50">أقسام</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-surface-950">
                    {store._count.menuItems}
                  </p>
                  <p className="text-xs text-surface-800/50">أصناف</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-surface-950">
                    {store._count.orders}
                  </p>
                  <p className="text-xs text-surface-800/50">طلبات</p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-flex px-3 py-1.5 rounded-xl text-xs font-bold ${
                  store.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : store.status === "SUSPENDED"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {store.status === "ACTIVE"
                  ? "نشط"
                  : store.status === "SUSPENDED"
                    ? "موقوف"
                    : "محذوف"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {store.subdomain && (
                  <Link
                    href={`http://${store.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                    target="_blank"
                    className="p-2 rounded-xl hover:bg-surface-50 text-surface-800/50 hover:text-primary-500 transition-colors"
                    title="عرض المتجر"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                )}

                {store.status === "ACTIVE" ? (
                  <form action={toggleStoreStatus}>
                    <input type="hidden" name="storeId" value={store.id} />
                    <input type="hidden" name="action" value="suspend" />
                    <button
                      type="submit"
                      className="p-2 rounded-xl hover:bg-yellow-50 text-surface-800/50 hover:text-yellow-600 transition-colors"
                      title="إيقاف مؤقت"
                    >
                      <Pause className="w-5 h-5" />
                    </button>
                  </form>
                ) : store.status === "SUSPENDED" ? (
                  <form action={toggleStoreStatus}>
                    <input type="hidden" name="storeId" value={store.id} />
                    <input type="hidden" name="action" value="activate" />
                    <button
                      type="submit"
                      className="p-2 rounded-xl hover:bg-green-50 text-surface-800/50 hover:text-green-600 transition-colors"
                      title="تفعيل"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  </form>
                ) : null}

                {store.status !== "DELETED" && (
                  <form action={toggleStoreStatus}>
                    <input type="hidden" name="storeId" value={store.id} />
                    <input type="hidden" name="action" value="delete" />
                    <button
                      type="submit"
                      className="p-2 rounded-xl hover:bg-red-50 text-surface-800/50 hover:text-red-500 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}

        {stores.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-16 text-center">
            <Store className="w-16 h-16 text-surface-800/20 mx-auto mb-4" />
            <p className="text-lg text-surface-800/50">
              لا توجد متاجر مسجلة بعد
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
