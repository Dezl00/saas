import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user.role !== "OWNER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-surface-50" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col">
        {children}
      </main>
    </div>
  );
}
