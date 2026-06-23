"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderTree,
  UtensilsCrossed,
  ShoppingBag,
  Ticket,
  Settings,
  LogOut,
  Store,
  MapPin,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    document.addEventListener('toggle-sidebar', handleToggle);
    return () => document.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "الرئيسية" },
    { href: "/dashboard/categories", icon: FolderTree, label: "الأقسام" },
    { href: "/dashboard/menu", icon: UtensilsCrossed, label: "المنيو" },
    { href: "/dashboard/branches", icon: MapPin, label: "الفروع" },
    { href: "/dashboard/delivery-areas", icon: Map, label: "مناطق التوصيل" },
    { href: "/dashboard/orders", icon: ShoppingBag, label: "الطلبات" },
    { href: "/dashboard/coupons", icon: Ticket, label: "الكوبونات" },
    { href: "/dashboard/settings", icon: Settings, label: "الإعدادات" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={cn(
        "fixed inset-y-0 start-0 z-50 flex flex-col w-64 bg-white border-e border-surface-200 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:flex",
        isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
      <div className="p-6 border-b border-surface-100">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary-100 flex items-center justify-center transition-transform">
            <Store className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="font-bold text-surface-950">لوحة التحكم</h2>
            <p className="text-xs text-surface-800/50">إدارة المتجر</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700 border-r-4 border-primary-600"
                  : "text-surface-600 hover:bg-surface-50 hover:text-surface-950 border-r-4 border-transparent"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-primary-600"
                    : "group-hover:text-primary-500"
                )}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-surface-100">
        <form
          action={async () => {
            // Using a server action via a form for logout is handled in the layout or client
            // Since this is a client component, we should handle this via next-auth/react
          }}
        >
            <Link
                href="/api/auth/signout"
                className="flex items-center gap-3 w-full px-4 py-3 text-error-600 hover:bg-error-50 transition-colors border-r-4 border-transparent"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">تسجيل الخروج</span>
            </Link>
        </form>
      </div>
    </aside>
    </>
  );
}
