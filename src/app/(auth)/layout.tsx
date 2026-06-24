import Link from "next/link";
import { Store } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let platformName = "منصتك";
  let platformLogo: string | null = null;
  
  try {
    const settings = await prisma.platformSetting.findUnique({ where: { id: "1" } });
    if (settings?.name) platformName = settings.name;
    if (settings?.logo) platformLogo = settings.logo;
  } catch (e) {
    // Fallback if DB is not migrated
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in">
        <Link href="/" className="flex flex-col items-center justify-center gap-4 mb-10 group">
          {platformLogo ? (
            <div className="w-16 h-16 rounded-2xl bg-surface-50 flex items-center justify-center overflow-hidden border border-surface-100">
              <img src={platformLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center border border-surface-200">
              <Store className="w-8 h-8 text-surface-900" />
            </div>
          )}
          <span className="text-2xl font-bold text-surface-950 tracking-tight">{platformName}</span>
        </Link>
        <div className="bg-white py-8 px-4 sm:rounded-3xl sm:px-10 border border-surface-200">
          {children}
        </div>
      </div>
    </div>
  );
}
