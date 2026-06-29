import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, X, CalendarDays, AlertTriangle, ArrowLeft, Crown } from "lucide-react";
import { AlreadySubscribedToast } from "./AlreadySubscribedToast";

export default async function TenantBillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Get Store
  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    include: {
      subscription: {
        include: { plan: true }
      }
    }
  });

  if (!store) redirect("/onboarding");

  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" }
  });

  const sub = store.subscription;
  const currentPlanId = sub?.planId;
  const isExpired = sub && (sub.status === "SUSPENDED" || sub.status === "ARCHIVED" || sub.status === "CANCELLED");
  const isGrace = sub && sub.status === "GRACE_PERIOD";

  // Feature labels map
  const featureLabels: Record<string, { label: string; type: "number" | "boolean"; suffix?: string }> = {
    products: { label: "المنتجات", type: "number", suffix: "منتج" },
    branches: { label: "الفروع", type: "number", suffix: "فرع" },
    staff: { label: "الموظفين", type: "number", suffix: "موظف" },
    qr: { label: "صانع QR للطاولات", type: "boolean" },
    reports: { label: "تقارير مبيعات متقدمة", type: "boolean" },
    inventory: { label: "إدارة المخزون", type: "boolean" },
    customDomain: { label: "دومين خاص", type: "boolean" },
    ai: { label: "الذكاء الاصطناعي", type: "boolean" },
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <AlreadySubscribedToast />
      <div>
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary-600" />
          </div>
          الاشتراك والفوترة
        </h1>
        <p className="text-sm text-surface-500 mt-2">
          إدارة باقتك الحالية وتجديد أو ترقية الاشتراك.
        </p>
      </div>

      {/* Current Subscription Status */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between shadow-sm relative overflow-hidden">
        {/* Background accent based on status */}
        <div className={`absolute top-0 right-0 w-2 h-full ${
          !sub || sub.status === "TRIAL" ? "bg-primary-500" :
          sub.status === "ACTIVE" ? "bg-success-500" :
          isGrace ? "bg-warning-500" : "bg-danger-500"
        }`}></div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-surface-900">
              الباقة الحالية: {sub?.plan?.name || "الفترة التجريبية (Trial)"}
            </h2>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
              !sub || sub.status === "TRIAL" ? "bg-primary-50 text-primary-700 border border-primary-200" :
              sub.status === "ACTIVE" ? "bg-success-50 text-success-700 border border-success-200" :
              sub.status === "PENDING_PAYMENT" ? "bg-warning-50 text-warning-700 border border-warning-200" :
              isGrace ? "bg-warning-50 text-warning-700 border border-warning-200" :
              "bg-danger-50 text-danger-700 border border-danger-200"
            }`}>
              {!sub || sub.status === "TRIAL" ? "تجريبية" :
               sub.status === "ACTIVE" ? "نشطة" :
               sub.status === "PENDING_PAYMENT" ? "مراجعة الدفع" :
               isGrace ? "فترة سماح" : "منتهية"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-surface-600">
            {sub?.endDate && (
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-surface-400" />
                <span>ينتهي في: <strong className="text-surface-900">{new Date(sub.endDate).toLocaleDateString("ar-EG")}</strong></span>
              </div>
            )}
            
            {isExpired && (
              <div className="flex items-center gap-2 text-danger-600 font-medium bg-danger-50 px-3 py-1.5 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span>اشتراكك منتهي. يرجى التجديد لتتمكن من التعديل وإدارة متجرك.</span>
              </div>
            )}
            {isGrace && (
              <div className="flex items-center gap-2 text-warning-700 font-medium bg-warning-50 px-3 py-1.5 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span>أنت في فترة السماح. قم بالتجديد لتجنب توقف التعديل على متجرك.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-surface-900">الباقات المتاحة للترقية أو التجديد</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => {
            const features = plan.features as any;
            const isCurrentPlan = currentPlanId === plan.id && sub?.status === "ACTIVE";
            return (
              <div key={plan.id} className={`bg-white border rounded-2xl p-6 flex flex-col shadow-sm transition-all ${
                isCurrentPlan 
                  ? "border-primary-400 ring-2 ring-primary-100 shadow-md" 
                  : "border-surface-200 hover:border-primary-200 hover:shadow-md"
              }`}>
                {isCurrentPlan && (
                  <div className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-3">
                    ✓ باقتك الحالية
                  </div>
                )}
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-surface-900">{plan.name}</h4>
                  <p className="text-sm text-surface-500 mt-1 h-10 line-clamp-2">{plan.description}</p>
                </div>
                
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-surface-900">{plan.price.toString()}</span>
                  <span className="text-surface-500 font-medium">ج.م / {plan.durationDays} يوم</span>
                </div>

                <div className="flex-1 space-y-2.5 mb-8 text-sm">
                  {Object.entries(featureLabels).map(([key, meta]) => {
                    const val = features?.[key];
                    if (val === undefined || val === null) return null;

                    if (meta.type === "number") {
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-success-500 shrink-0" />
                          <span>{val === -1 ? `عدد غير محدود من ${meta.label}` : `حتى ${val} ${meta.suffix}`}</span>
                        </div>
                      );
                    }

                    // Boolean feature
                    return (
                      <div key={key} className="flex items-center gap-3">
                        {val ? (
                          <Check className="w-4 h-4 text-success-500 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-surface-300 shrink-0" />
                        )}
                        <span className={val ? "" : "text-surface-400 line-through"}>{meta.label}</span>
                      </div>
                    );
                  })}
                </div>

                {isCurrentPlan ? (
                  <div className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-primary-600 bg-primary-50 border-2 border-primary-200 cursor-default">
                    أنت مشترك بالفعل
                  </div>
                ) : (
                  <Link
                    href={`/dashboard/billing/${plan.id}`}
                    className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                  >
                    اشتراك الآن
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
