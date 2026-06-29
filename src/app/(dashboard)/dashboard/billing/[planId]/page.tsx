import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, UploadCloud } from "lucide-react";
import { CheckoutForm } from "./CheckoutForm";

export default async function CheckoutPage({ params }: { params: { planId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id }
  });
  if (!store) redirect("/onboarding");

  const plan = await prisma.plan.findUnique({
    where: { id: params.planId, isActive: true }
  });
  if (!plan) notFound();

  const methods = await prisma.platformPaymentMethod.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/billing"
          className="p-2 text-surface-500 hover:text-surface-900 bg-white rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 rtl:rotate-180" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">إتمام الدفع</h1>
          <p className="text-sm text-surface-500 mt-1">
            الباقة المختارة: <strong className="text-primary-600">{plan.name}</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Plan Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface-50 rounded-2xl border border-surface-200 p-6">
            <h3 className="font-bold text-surface-900 mb-4">ملخص الطلب</h3>
            <div className="flex justify-between items-center py-3 border-b border-surface-200 text-sm">
              <span className="text-surface-600">اسم الباقة</span>
              <span className="font-bold">{plan.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-surface-200 text-sm">
              <span className="text-surface-600">المدة</span>
              <span className="font-bold">{plan.durationDays} يوم</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-surface-900 font-bold">الإجمالي</span>
              <span className="font-black text-2xl text-primary-600">{plan.price.toString()} ج.م</span>
            </div>
          </div>

          <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
            <h4 className="font-bold text-primary-900 text-sm mb-2">تعليمات هامة</h4>
            <ul className="text-xs text-primary-800 space-y-2 list-disc list-inside leading-relaxed">
              <li>يرجى اختيار طريقة الدفع المناسبة وتحويل المبلغ المطلوب.</li>
              <li>قم بالاحتفاظ بصورة الإيصال (سكرين شوت) واضحة توضح رقم العملية.</li>
              <li>ارفع الإيصال هنا واضغط تأكيد لتدخل في المراجعة.</li>
              <li>التفعيل يتم خلال ساعة من رفع الطلب كحد أقصى.</li>
            </ul>
          </div>
        </div>

        {/* Payment Methods and Upload */}
        <div className="md:col-span-2">
          <CheckoutForm planId={plan.id} methods={methods} storeId={store.id} />
        </div>

      </div>
    </div>
  );
}
