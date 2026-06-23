import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient: string;
}

export function StatsCard({ title, value, icon: Icon, trend, gradient }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm card-hover border border-surface-100 relative overflow-hidden">
        {/* Subtle decorative gradient */}
        <div className={`absolute top-0 end-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-2xl -mt-10 -me-10`} />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
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
        <p className="text-3xl font-black text-surface-950">{value}</p>
        <p className="text-sm font-medium text-surface-800/60 mt-1">{title}</p>
      </div>
    </div>
  );
}
