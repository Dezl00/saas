import { prisma } from "@/lib/prisma";
import { Users as UsersIcon } from "lucide-react";
import { ChangeUserPasswordButton } from "@/components/admin/ChangeUserPasswordButton";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "OWNER" },
    include: {
      store: {
        select: { name: true, status: true, subdomain: true, type: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-surface-950">إدارة المستخدمين</h1>
        <p className="text-surface-800/60 mt-1">
          عرض وإدارة جميع المستخدمين المسجلين
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50">
                <th className="text-start px-6 py-3 text-xs font-bold text-surface-800/60 uppercase">
                  المستخدم
                </th>
                <th className="text-start px-6 py-3 text-xs font-bold text-surface-800/60 uppercase">
                  البريد الإلكتروني
                </th>
                <th className="text-start px-6 py-3 text-xs font-bold text-surface-800/60 uppercase">
                  المتجر
                </th>
                <th className="text-start px-6 py-3 text-xs font-bold text-surface-800/60 uppercase">
                  النوع
                </th>
                <th className="text-start px-6 py-3 text-xs font-bold text-surface-800/60 uppercase">
                  الحالة
                </th>
                <th className="text-start px-6 py-3 text-xs font-bold text-surface-800/60 uppercase">
                  تاريخ التسجيل
                </th>
                <th className="text-start px-6 py-3 text-xs font-bold text-surface-800/60 uppercase">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-surface-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-surface-950">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-800/70">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-surface-950">
                    {user.store?.name || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {user.store && (
                      <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary-700">
                        {user.store.type === "RESTAURANT"
                          ? "مطعم"
                          : user.store.type === "MARKET"
                            ? "ماركت"
                            : user.store.type === "PHARMACY"
                              ? "صيدلية"
                              : "أخرى"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.store && (
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                          user.store.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : user.store.status === "SUSPENDED"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.store.status === "ACTIVE"
                          ? "نشط"
                          : user.store.status === "SUSPENDED"
                            ? "موقوف"
                            : "محذوف"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-800/60">
                    {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-6 py-4">
                    <ChangeUserPasswordButton userId={user.id} userName={user.name} />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center"
                  >
                    <UsersIcon className="w-12 h-12 text-surface-800/20 mx-auto mb-4" />
                    <p className="text-surface-800/50">
                      لا يوجد مستخدمين مسجلين بعد
                    </p>
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
