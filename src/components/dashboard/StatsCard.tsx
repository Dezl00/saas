import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  cardClasses: string;
  iconClasses: string;
  labelClasses: string;
}

export function StatsCard({ title, value, icon: Icon, trend, cardClasses, iconClasses, labelClasses }: StatsCardProps) {
  return (
    <div className={`rounded-2xl p-6 border relative overflow-hidden ${cardClasses}`}>
        {/* Subtle decorative color */}
        <div className={`absolute top-0 end-0 w-32 h-32 ${iconClasses} opacity-50 rounded-full blur-2xl -mt-10 -me-10`} />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center relative z-10 ${iconClasses}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span
            className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold ${
              trend.isPositive
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-black mb-1">{value}</p>
        <p className={`text-sm font-bold ${labelClasses}`}>{title}</p>
      </div>
    </div>
  );
}
