import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Toaster } from "react-hot-toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user.role !== "OWNER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const isAdminImpersonating = session?.user?.role === "ADMIN" && cookieStore.has("admin_managed_store_id");

  if (session.user.role === "ADMIN" && !isAdminImpersonating) {
    redirect("/admin");
  }

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col pb-20 md:pb-0">
        {children}
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
