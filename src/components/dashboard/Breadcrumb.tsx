import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function Breadcrumb({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      <Link href="/dashboard" className="font-medium text-surface-500 hover:text-primary-600 transition-colors">
        الرئيسية
      </Link>
      <ChevronLeft className="w-4 h-4 text-surface-400" />
      <span className="font-bold text-surface-950">{title}</span>
    </div>
  );
}
