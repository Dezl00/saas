import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ImportExportClient } from "./ImportExportClient";
import { FileUp, FileDown } from "lucide-react";

export default async function ImportExportPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id }
  });

  if (!store) redirect("/onboarding");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <FileUp className="w-5 h-5 text-primary-600" />
          </div>
          استيراد وتصدير المنيو
        </h1>
        <p className="text-sm text-surface-500 mt-2">
          قم بإدارة منتجاتك وأقسامك وإضافاتك بشكل مجمع عبر ملفات الإكسل (Excel).
        </p>
      </div>

      <ImportExportClient storeId={store.id} />
    </div>
  );
}
