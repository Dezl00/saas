"use client";

import Link from "next/link";

export function DefaultProductsTabs({ currentTab }: { currentTab: string }) {
  return (
    <div className="flex gap-4 border-b border-surface-200">
      <Link 
        href="?tab=menu"
        className={`pb-3 px-1 text-sm font-bold transition-colors relative ${
          currentTab === 'menu' 
            ? 'text-primary-600 border-b-2 border-primary-600' 
            : 'text-surface-500 hover:text-surface-900 border-b-2 border-transparent'
        }`}
      >
        إدارة المنيو الافتراضي
      </Link>
      <Link 
        href="?tab=stores"
        className={`pb-3 px-1 text-sm font-bold transition-colors relative ${
          currentTab === 'stores' 
            ? 'text-primary-600 border-b-2 border-primary-600' 
            : 'text-surface-500 hover:text-surface-900 border-b-2 border-transparent'
        }`}
      >
        إعدادات ظهور المتاجر
      </Link>
    </div>
  );
}
