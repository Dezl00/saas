import { Header } from "@/components/dashboard/Header";
import { auth } from "@/lib/auth";

export default async function DashboardSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <Header userName={session?.user?.name || "المستخدم"} />
      <div className="p-6 lg:p-8 flex-1 animate-fade-in">
        {children}
      </div>
    </>
  );
}
