import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Store,
  LogOut,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "الرئيسية" },
    { href: "/admin/users", icon: Users, label: "المستخدمين" },
    { href: "/admin/stores", icon: Store, label: "المتاجر" },
  ];

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-e border-surface-200">
        <div className="p-6 border-b border-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-error-500 to-accent-500 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-surface-950">لوحة الأدمن</h2>
              <p className="text-xs text-surface-800/50">إدارة المنصة</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-800/70 hover:bg-surface-50 hover:text-surface-950 transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:text-primary-500 transition-colors" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-100">
          <form
            action={async () => {
              "use server";
              const { signOut } = await import("@/lib/auth");
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-error-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
