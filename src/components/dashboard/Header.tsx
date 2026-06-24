"use client";

import { Menu, LogOut } from "lucide-react";
import { exitImpersonation } from "@/app/(admin)/admin/stores/actions";

interface HeaderProps {
  title?: string;
  userName?: string;
  isAdminImpersonating?: boolean;
}

export function Header({ title = "لوحة التحكم", userName = "المستخدم", isAdminImpersonating = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-surface-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))}
            className="lg:hidden p-2 text-surface-800/60 hover:bg-surface-50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-surface-950">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {isAdminImpersonating && (
            <form action={exitImpersonation}>
              <button
                type="submit"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-error-50 text-error-600 rounded-xl font-bold hover:bg-error-100 transition-colors text-sm"
                title="أنت الآن تدير هذا المتجر كأدمن"
              >
                <LogOut className="w-4 h-4" />
                العودة للأدمن
              </button>
            </form>
          )}
          <div className="flex items-center gap-3">
            <div className="text-end hidden sm:block">
              <p className="text-sm font-bold text-surface-950">{userName}</p>
              <p className="text-xs text-surface-800/60">مدير المتجر</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-primary-700 font-bold">
              {userName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
