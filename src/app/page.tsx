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
  Rocket
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
    <div className="min-h-screen bg-slate-50 selection:bg-primary-200 selection:text-primary-900">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              {platformLogo ? (
                <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                  <img src={platformLogo} alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center">
                  <Store className="w-8 h-8 text-white" />
                </div>
              )}
              {/* تمت إزالة اسم المنصة بجوار اللوجو بناءً على طلبك */}
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:block px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors duration-300"
              >
                جرب 7 أيام ببلاش
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-slate-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-bold mb-8">
              <Rocket className="w-4 h-4 text-primary-600" />
              أسرع طريقة تعمل بيها متجرك
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-8 animate-slide-up">
            اعمل متجرك الأونلاين
            <br />
            <span className="text-primary-600">
              واستقبل طلباتك بسهولة!
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 animate-slide-up leading-relaxed">
            منصة متكاملة للمطاعم والصيدليات والماركت. ارفع المنيو بتاعك، خلي الذكاء الاصطناعي يظبطلك الصور، وشارك رابطك الخاص مع عملائك في ثواني.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-slide-up">
            <Link
              href="/register"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-primary-600 rounded-2xl hover:bg-primary-700 transition-colors duration-300"
            >
              اعمل متجرك دلوقتي (7 أيام ببلاش)
              <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-10 py-5 text-lg font-bold text-slate-700 bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-colors duration-300"
            >
              اكتشف المميزات
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-20 mt-20 animate-fade-in">
            {[
              { value: "7 أيام", label: "تجربة مجانية بالكامل" },
              { value: "∞", label: "أصناف بدون حدود" },
              { value: "رابط", label: "باسم متجرك الخاص" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-medium text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6">
              كل اللي هتحتاجه عشان{" "}
              <span className="text-primary-600">تدير أوردراتك</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              تطبيقك متكامل من الألف للياء، مصمم مخصوص عشان يريحك ويزود مبيعاتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Store,
                title: "متجرك في دقايق",
                desc: "سجل حسابك، اختار نوع نشاطك، ومتجرك هيكون جاهز يستقبل الزباين فوراً.",
                bgColor: "bg-blue-100",
                textColor: "text-blue-900",
                iconColor: "text-blue-600",
              },
              {
                icon: ShoppingBag,
                title: "المنيو الذكي",
                desc: "ارفع أقسامك وأصنافك، واستخدم الذكاء الاصطناعي عشان تولد صور احترافية للأكل.",
                bgColor: "bg-purple-100",
                textColor: "text-purple-900",
                iconColor: "text-purple-600",
              },
              {
                icon: Globe,
                title: "لينك خاص بيك",
                desc: "اختار اسم اللينك بتاعك وشاركه على الواتساب والفيسبوك وانستجرام مع عملائك.",
                bgColor: "bg-green-100",
                textColor: "text-green-900",
                iconColor: "text-green-600",
              },
              {
                icon: BarChart3,
                title: "لوحة تحكم رايقة",
                desc: "تابع مبيعاتك، أوردراتك، وإحصائياتك من لوحة تحكم سهلة جداً وواضحة.",
                bgColor: "bg-orange-100",
                textColor: "text-orange-900",
                iconColor: "text-orange-600",
              },
              {
                icon: Shield,
                title: "طرق دفع مريحة",
                desc: "استقبل فلوسك بالطريقة اللي تريحك: كاش، إنستاباي، أو محافظ بنكية.",
                bgColor: "bg-rose-100",
                textColor: "text-rose-900",
                iconColor: "text-rose-600",
              },
              {
                icon: Smartphone,
                title: "شغال على أي جهاز",
                desc: "الزباين تقدر تطلب من الموبايل أو التابلت بمنتهى السهولة وبدون تحميل برامج.",
                bgColor: "bg-teal-100",
                textColor: "text-teal-900",
                iconColor: "text-teal-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl ${feature.bgColor} transition-transform hover:-translate-y-1 duration-300`}
              >
                <div className="mb-6">
                  <feature.icon className={`w-12 h-12 ${feature.iconColor}`} />
                </div>
                <h3 className={`text-2xl font-black ${feature.textColor} mb-4`}>
                  {feature.title}
                </h3>
                <p className={`${feature.textColor} opacity-80 text-lg leading-relaxed`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6">
              هتبدأ <span className="text-primary-600">إزاي؟</span>
            </h2>
            <p className="text-xl text-slate-600">
              3 خطوات بسيطة جداً تفصلك عن أول أوردر
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 inset-x-20 h-1 bg-slate-100 rounded-full" />
            
            {[
              {
                step: "1",
                icon: Store,
                title: "سجّل حسابك",
                desc: "خطوة سريعة تختار فيها اسم متجرك وتفاصيله.",
              },
              {
                step: "2",
                icon: ShoppingBag,
                title: "ظبط المنيو",
                desc: "ضيف أصنافك وأسعارك وخلي شكلها يفتح النفس.",
              },
              {
                step: "3",
                icon: Globe,
                title: "شير اللينك",
                desc: "ابعت اللينك لزباينك واستقبل الأوردرات فوراً.",
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="relative z-10 w-24 h-24 mx-auto mb-8 rounded-full bg-slate-50 border-4 border-white flex flex-col items-center justify-center text-primary-600">
                  <item.icon className="w-8 h-8 mb-1" />
                  <span className="text-xl font-black">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-lg text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-8">
            مستني إيه؟ ابدأ دلوقتي!
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            انضم لينا وكبّر البيزنس بتاعك بطريقة عصرية. جرب المنصة بالكامل مجاناً لمدة 7 أيام وشوف الفرق بنفسك.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-12 py-5 text-xl font-bold text-primary-600 bg-white rounded-2xl hover:bg-primary-50 transition-colors duration-300"
          >
            جرب مجاناً لمدة 7 أيام
            <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <p className="text-base font-medium">
              © {new Date().getFullYear()} {platformName}. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
