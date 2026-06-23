import Link from "next/link";
import { Store } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -start-24 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -end-24 w-72 h-72 bg-accent-200/40 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Store className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black gradient-text">منصتك</span>
        </Link>
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/50 relative overflow-hidden">
          {/* Shine effect inside card */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
          {children}
        </div>
      </div>
    </div>
  );
}
