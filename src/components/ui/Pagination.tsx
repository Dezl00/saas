"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pb-4">
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`w-10 h-10 flex items-center justify-center rounded-xl border border-surface-200 bg-white text-surface-600 transition-colors ${
          currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-surface-50 hover:text-primary-600"
        }`}
      >
        <ChevronRight className="w-5 h-5 rtl:rotate-180" />
      </Link>
      
      <span className="text-sm font-medium text-surface-600 px-4">
        صفحة {currentPage} من {totalPages}
      </span>

      <Link
        href={createPageUrl(currentPage + 1)}
        className={`w-10 h-10 flex items-center justify-center rounded-xl border border-surface-200 bg-white text-surface-600 transition-colors ${
          currentPage >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-surface-50 hover:text-primary-600"
        }`}
      >
        <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
      </Link>
    </div>
  );
}
