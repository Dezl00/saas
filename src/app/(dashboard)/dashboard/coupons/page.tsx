import { Ticket } from "lucide-react";

export default function CouponsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-6">
        <Ticket className="w-10 h-10 text-primary-500" />
      </div>
      <h1 className="text-2xl font-bold text-surface-950 mb-2">إدارة الكوبونات</h1>
      <p className="text-surface-800/60">قريباً... ستتمكن هنا من إنشاء وإدارة كوبونات الخصم</p>
    </div>
  );
}
