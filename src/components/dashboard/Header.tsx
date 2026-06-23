import { Menu } from "lucide-react";

interface HeaderProps {
  title?: string;
  userName?: string;
}

export function Header({ title = "لوحة التحكم", userName = "المستخدم" }: HeaderProps) {
  return (
    <header className="bg-white border-b border-surface-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 text-surface-800/60 hover:bg-surface-50 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-surface-950">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
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
