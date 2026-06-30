import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { AppearanceClient } from "./AppearanceClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "المظهر | لوحة التحكم",
};

export default async function AppearancePage() {
  const session = await auth();
  if (!session?.user?.storeId) {
    notFound();
  }

  const store = await prisma.store.findUnique({
    where: { id: session.user.storeId },
    select: { fontFamily: true },
  });

  if (!store) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-surface-900 mb-1">المظهر</h1>
          <Breadcrumb 
            items={[
              { label: "لوحة التحكم", href: "/dashboard" },
              { label: "المظهر" }
            ]} 
          />
        </div>
      </div>

      <AppearanceClient currentFont={store.fontFamily} />
    </div>
  );
}
