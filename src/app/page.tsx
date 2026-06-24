import Link from "next/link";
import {
  Store,
  ShoppingBag,
  BarChart3,
  Globe,
  ChevronLeft,
  Zap,
  Shield,
  Smartphone,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  let platformName = "منصتك";
  let platformLogo: string | null = null;
  
  try {
    const settings = await prisma.platformSetting.findUnique({ where: { id: "1" } });
    if (settings?.name) platformName = settings.name;
    if (settings?.logo) platformLogo = settings.logo;
  } catch (e) {
    // Fallback if DB is not migrated
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              {platformLogo ? (
                <div className="w-9 h-9 flex items-center justify-center">
                  <img src={platformLogo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center">
                  <Store className="w-5 h-5 text-surface-900" />
                </div>
              )}
              <span className="text-xl font-bold text-surface-950">{platformName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-bold text-surface-700 hover:text-surface-950 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-bold text-white bg-surface-950 rounded-xl hover:bg-surface-800 transition-colors"
              >
                ابدأ مجاناً
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100 text-surface-800 text-sm font-bold mb-6">
              <Zap className="w-4 h-4" />
              أنشئ متجرك في دقائق
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-surface-950 leading-tight mb-6 animate-slide-up">
            {platformName} لإنشاء
            <br />
            <span className="text-surface-600">متجرك الإلكتروني</span>
          </h1>

          <p className="text-lg sm:text-xl text-surface-800/70 max-w-2xl mx-auto mb-10 animate-slide-up">
            أنشئ متجرك الإلكتروني للمطاعم أو الماركت أو الصيدلية. ارفع المنيو،
            استقبل الطلبات، وشارك رابطك الخاص مع عملائك.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 text-lg font-bold text-white bg-surface-950 rounded-2xl hover:bg-surface-800 transition-colors"
            >
              ابدأ الآن مجاناً
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 text-lg font-bold text-surface-950 bg-surface-50 rounded-2xl border-2 border-transparent hover:border-surface-200 transition-all"
            >
              اكتشف المميزات
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16 animate-fade-in">
            {[
              { value: "مجاني", label: "في البداية" },
              { value: "∞", label: "أصناف بلا حدود" },
              { value: "رابط", label: "خاص بمتجرك" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-surface-950">
                  {stat.value}
                </div>
                <div className="text-sm text-surface-800/60 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-surface-950 mb-4">
              كل اللي محتاجه في{" "}
              <span className="text-surface-600">مكان واحد</span>
            </h2>
            <p className="text-lg text-surface-800/60 max-w-xl mx-auto">
              منصة متكاملة لإدارة متجرك الإلكتروني من الألف للياء
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Store,
                title: "أنشئ متجرك",
                desc: "سجل حسابك، اختر نوع نشاطك، وأنشئ متجرك الإلكتروني في دقائق معدودة.",
              },
              {
                icon: ShoppingBag,
                title: "ارفع المنيو",
                desc: "أضف أقسامك وأصنافك بالصور والأسعار. عدّل واحذف وأضف في أي وقت.",
              },
              {
                icon: Globe,
                title: "رابط خاص بيك",
                desc: "اختر اسم رابطك الخاص (subdomain) وشاركه مع عملائك عبر أي وسيلة.",
              },
              {
                icon: BarChart3,
                title: "لوحة تحكم ذكية",
                desc: "تابع طلباتك وإحصائياتك ومبيعاتك من لوحة تحكم سهلة وواضحة.",
              },
              {
                icon: Shield,
                title: "دفع آمن",
                desc: "فعّل وسائل الدفع المناسبة: كاش، إنستاباي، محافظ بنكية، تحويل بنكي.",
              },
              {
                icon: Smartphone,
                title: "متوافق مع الموبايل",
                desc: "متجرك يعمل بشكل مثالي على الموبايل والتابلت والكمبيوتر.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-white rounded-2xl border border-surface-200 card-hover"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mb-5 group-hover:bg-surface-950 transition-colors duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-surface-950 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-surface-950 mb-3">
                  {feature.title}
                </h3>
                <p className="text-surface-800/60 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-surface-950 mb-4">
              إزاي <span className="text-surface-600">تبدأ؟</span>
            </h2>
            <p className="text-lg text-surface-800/60">
              3 خطوات بسيطة وهتبدأ تستقبل طلبات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "١",
                title: "سجّل حسابك",
                desc: "أنشئ حسابك واختر نوع نشاطك واسم متجرك",
              },
              {
                step: "٢",
                title: "أضف منيو",
                desc: "ارفع أقسامك وأصنافك بالصور والأسعار والأوصاف",
              },
              {
                step: "٣",
                title: "شارك رابطك",
                desc: "اختر اسم رابطك وابدأ استقبل الطلبات من عملائك",
              },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 flex items-center justify-center text-3xl font-black text-surface-950 group-hover:bg-surface-950 group-hover:text-white transition-colors duration-300">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-surface-950 mb-2">
                  {item.title}
                </h3>
                <p className="text-surface-800/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-surface-950">
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
            جاهز تبدأ رحلتك؟
          </h2>
          <p className="text-xl text-surface-300 mb-10 max-w-2xl mx-auto">
            انضم للمنصة وأنشئ متجرك الإلكتروني الآن. مجاني بالكامل في البداية.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold text-surface-950 bg-white rounded-2xl hover:bg-surface-100 transition-colors"
          >
            أنشئ متجرك الآن
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-surface-950 text-surface-400 border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {platformLogo ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src={platformLogo} alt="Logo" className="w-full h-full object-contain opacity-70" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center">
                  <Store className="w-4 h-4 text-surface-400" />
                </div>
              )}
              <span className="font-bold text-surface-300">{platformName}</span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} {platformName}. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
