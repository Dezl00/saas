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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">منصتك</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-l from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 btn-shine"
              >
                ابدأ مجاناً
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 start-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 end-1/4 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              أنشئ متجرك في دقائق
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-surface-950 leading-tight mb-6 animate-slide-up">
            منصتك لإنشاء
            <br />
            <span className="gradient-text">متجرك الإلكتروني</span>
          </h1>

          <p className="text-lg sm:text-xl text-surface-800/70 max-w-2xl mx-auto mb-10 animate-slide-up">
            أنشئ متجرك الإلكتروني للمطاعم أو الماركت أو الصيدلية. ارفع المنيو،
            استقبل الطلبات، وشارك رابطك الخاص مع عملائك.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-l from-primary-500 to-primary-600 rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-xl shadow-primary-500/30 btn-shine"
            >
              ابدأ الآن مجاناً
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 text-lg font-medium text-primary-700 bg-white rounded-2xl border-2 border-primary-100 hover:border-primary-200 hover:bg-primary-50 transition-all"
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
                <div className="text-2xl sm:text-3xl font-black gradient-text">
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
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-surface-950 mb-4">
              كل اللي محتاجه في{" "}
              <span className="gradient-text">مكان واحد</span>
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
                gradient: "from-primary-500 to-primary-600",
              },
              {
                icon: ShoppingBag,
                title: "ارفع المنيو",
                desc: "أضف أقسامك وأصنافك بالصور والأسعار. عدّل واحذف وأضف في أي وقت.",
                gradient: "from-accent-500 to-accent-600",
              },
              {
                icon: Globe,
                title: "رابط خاص بيك",
                desc: "اختر اسم رابطك الخاص (subdomain) وشاركه مع عملائك عبر أي وسيلة.",
                gradient: "from-success-500 to-primary-500",
              },
              {
                icon: BarChart3,
                title: "لوحة تحكم ذكية",
                desc: "تابع طلباتك وإحصائياتك ومبيعاتك من لوحة تحكم سهلة وواضحة.",
                gradient: "from-warning-500 to-accent-500",
              },
              {
                icon: Shield,
                title: "دفع آمن",
                desc: "فعّل وسائل الدفع المناسبة: كاش، إنستاباي، محافظ بنكية، تحويل بنكي.",
                gradient: "from-error-500 to-accent-500",
              },
              {
                icon: Smartphone,
                title: "متوافق مع الموبايل",
                desc: "متجرك يعمل بشكل مثالي على الموبايل والتابلت والكمبيوتر.",
                gradient: "from-primary-400 to-accent-400",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-surface-50 rounded-2xl border border-surface-100 card-hover"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
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
      <section className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-surface-950 mb-4">
              إزاي <span className="gradient-text">تبدأ؟</span>
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
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary-500/20 group-hover:scale-110 transition-transform">
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
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
            جاهز تبدأ رحلتك؟
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            انضم للمنصة وأنشئ متجرك الإلكتروني الآن. مجاني بالكامل في البداية.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold text-primary-700 bg-white rounded-2xl hover:bg-primary-50 transition-all shadow-xl btn-shine"
          >
            أنشئ متجرك الآن
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-surface-950 text-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">منصتك</span>
            </div>
            <p className="text-sm text-surface-200/60">
              © {new Date().getFullYear()} منصتك. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
