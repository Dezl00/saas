import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Store as StoreIcon, ShoppingBag, MapPin, Phone, MessageCircle, Link as LinkIcon } from "lucide-react";
import { CartProvider } from "@/components/store/CartProvider";
import { CartHeaderButton } from "@/components/store/CartHeaderButton";
import { CartSidebar } from "@/components/store/CartSidebar";
import { formatWhatsappNumber } from "@/lib/utils";

// SVG Icons for Brands
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02C13.84 0 15.14.01 16.44.03c.06 1.5.54 2.92 1.48 4.09A6.9 6.9 0 0 0 22 5.92v3.94a11.13 11.13 0 0 1-4.04-1.02c-.54-.25-1.04-.56-1.52-.92v6.62c0 1.54-.5 3.03-1.42 4.22a7.1 7.1 0 0 1-4.04 2.22 7 7 0 0 1-4.72-.6A6.9 6.9 0 0 1 2.94 17a6.9 6.9 0 0 1-.36-4.5 7.1 7.1 0 0 1 2.5-3.66c1.23-.9 2.76-1.34 4.31-1.22.04 1.25.02 2.51.04 3.75-.58-.08-1.18-.04-1.74.2a3.03 3.03 0 0 0-1.27 1.18c-.27.53-.34 1.14-.19 1.7.15.54.54 1 1.03 1.3.48.3 1.07.4 1.6.26.54-.14 1.03-.47 1.34-.96.3-.47.46-1.04.45-1.61v-14.3Z"/>
  </svg>
);

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 448 512" fill="currentColor" className={className}>
    <path d="M424.12 301.78c-4.13-22.18-20.08-36.53-48.4-43.51-17.65-4.35-30.6-5.83-42.61-7.14-11-1.21-20.73-2.28-25.17-5a18.32 18.32 0 0 1-5.11-4.72c-15.76-21-28.8-49.88-38.32-84.77-5-18.44-8.73-37.11-10.82-53.53C249.21 68.3 249.49 0 224 0c-25.68 0-25.21 68.3-29.69 103.11-2.09 16.42-5.78 35.09-10.82 53.53-9.52 34.89-22.56 63.81-38.32 84.77a18.32 18.32 0 0 1-5.11 4.72c-4.44 2.73-14.16 3.8-25.17 5-12 1.31-25 2.79-42.61 7.14-28.32 7-44.27 21.33-48.4 43.51-3.69 19.8 4 35 22.9 44.52l12 6a54.34 54.34 0 0 1 11.24 6.7c7 5.48 11.41 13 13 22.33a53.28 53.28 0 0 1-1.39 21.8c-2 8.35-6.62 16.32-13.62 23.47a55.19 55.19 0 0 1-21 13 46 46 0 0 0-14.59 7.42c-7.39 5.86-13.2 14-17 23.51-4.52 11.23-4.13 22.61 1.15 32A32 32 0 0 0 35.8 488c9.55 4 23.36 6 41 6 36.65 0 83.2-15.17 117-27.17 9.87-3.5 19.34-6.87 27.65-9.28a9.49 9.49 0 0 1 5.25 0c8.31 2.41 17.78 5.78 27.65 9.28 33.77 12 80.32 27.17 117 27.17 17.65 0 31.46-2 41-6a32 32 0 0 0 16.43-15.4c5.28-9.35 5.67-20.73 1.15-32-3.8-9.49-9.62-17.65-17-23.51a46 46 0 0 0-14.59-7.42 55.19 55.19 0 0 1-21-13c-7-7.15-11.66-15.12-13.62-23.47a53.28 53.28 0 0 1-1.39-21.8c1.61-9.35 6-16.85 13-22.33a54.34 54.34 0 0 1 11.24-6.7l12-6c18.89-9.5 26.58-24.71 22.89-44.51z"/>
  </svg>
);

export async function generateMetadata(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const store = await prisma.store.findUnique({
    where: { subdomain: params.subdomain },
  });

  if (!store) return { title: "المتجر غير موجود" };

  return {
    title: store.name,
    description: store.description || `اطلب الآن من ${store.name}`,
  };
}

export default async function StoreLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const params = await paramsPromise;
  const storePromise = prisma.store.findUnique({
    where: { subdomain: params.subdomain },
    include: {
      branches: { where: { isActive: true } },
      deliveryAreas: { where: { isActive: true } }
    }
  });

  const settingsPromise = prisma.platformSetting.findUnique({ where: { id: "1" } });

  const [store, settings] = await Promise.all([storePromise, settingsPromise]);
  const platformName = settings?.name || "Menura";

  if (!store || store.status === "DELETED") {
    notFound();
  }

  if (store.status === "SUSPENDED") {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-4 text-center">
        <StoreIcon className="w-16 h-16 text-surface-400 mb-6" />
        <h1 className="text-3xl font-black text-surface-950 mb-2">عذراً، المتجر موقوف مؤقتاً</h1>
        <p className="text-surface-600 max-w-md text-lg">
          هذا المتجر غير متاح في الوقت الحالي للطلبات أو التصفح. يرجى المحاولة في وقت لاحق.
        </p>
      </div>
    );
  }

  return (
    <CartProvider>
      <div 
        className="min-h-screen bg-surface-50 pb-0 flex flex-col"
        style={store.primaryColor ? {
          '--color-primary-50': `${store.primaryColor}1a`,
          '--color-primary-100': `${store.primaryColor}33`,
          '--color-primary-500': store.primaryColor,
          '--color-primary-600': store.primaryColor,
          '--color-primary-700': store.primaryColor,
        } as React.CSSProperties : undefined}
      >
        <header className="sticky top-0 z-30 bg-white border-b border-surface-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Store Minimal Info */}
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-lg text-surface-950">{store.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <CartHeaderButton />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative bg-surface-950 py-10 px-4">
          {(store as any).cover && (
            <>
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${(store as any).cover})` }}
              />
              <div 
                className="absolute inset-0 z-0"
                style={{ 
                  backgroundColor: (store as any).coverOverlayColor || '#000000',
                  opacity: ((store as any).coverOverlayOpacity ?? 50) / 100 
                }}
              />
            </>
          )}
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center relative z-10">
            <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-5">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="w-full h-full object-contain drop-shadow-lg" />
              ) : (
                <StoreIcon className="w-20 h-20 text-white opacity-80" />
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{store.name}</h1>
            
            {/* Social Media Icons in Hero */}
            <div className="flex items-center justify-center gap-3 mt-4">
              {(store as any).showFacebook !== false && (
                <a href={store.facebookUrl || "#"} target={store.facebookUrl ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {(store as any).showInstagram !== false && (
                <a href={store.instagramUrl || "#"} target={store.instagramUrl ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {(store as any).showTwitter !== false && (
                <a href={store.twitterUrl || "#"} target={store.twitterUrl ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <XIcon className="w-5 h-5" />
                </a>
              )}
              {(store as any).showTiktok !== false && (
                <a href={store.tiktokUrl || "#"} target={store.tiktokUrl ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <TiktokIcon className="w-5 h-5" />
                </a>
              )}
              {(store as any).showSnapchat !== false && (
                <a href={store.snapchatUrl || "#"} target={store.snapchatUrl ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <SnapchatIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full">
          {children}
        </main>

        {/* Promo Banner */}
        <div className="max-w-5xl mx-auto px-4 mt-16">
          <div className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] rounded-3xl p-8 text-center text-white shadow-xl flex flex-col items-center" style={{ '--color-primary-600': '#2563eb', '--color-primary-800': '#1e40af' } as any}>
            <h3 className="text-2xl font-black mb-2 text-white">هل تمتلك مطعماً أو متجراً؟</h3>
            <p className="text-blue-100 mb-6 max-w-lg">
              أنشئ متجرك الإلكتروني الخاص في دقائق وابدأ في استقبال الطلبات عبر الواتساب مباشرة وبدون عمولات!
            </p>
            <a href="https://menura.site" target="_blank" className="bg-white text-blue-700 font-bold py-3 px-8 rounded-2xl hover:bg-surface-50 transition-colors shadow-lg hover:shadow-xl">
              أنشئ متجرك مجاناً
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-surface-50 border-t border-surface-200 mt-12 py-10">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
            <div className="w-32 h-32 mx-auto flex items-center justify-center mb-4">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="w-full h-full object-contain drop-shadow-sm" />
              ) : (
                <StoreIcon className="w-16 h-16 text-surface-400" />
              )}
            </div>
            <h2 className="font-bold text-xl text-surface-950">{store.name}</h2>
            {store.description && (
              <p className="text-surface-500 text-sm max-w-md mx-auto leading-relaxed">{store.description}</p>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-surface-600 text-sm mt-6">
              {store.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary-500" />
                  <span dir="ltr">{store.phone}</span>
                </div>
              )}
              {store.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span>{store.address}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
              {(store as any).showFacebook !== false && (
                <a href={store.facebookUrl || "#"} target={store.facebookUrl ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {(store as any).showInstagram !== false && (
                <a href={store.instagramUrl || "#"} target={store.instagramUrl ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {(store as any).showTwitter !== false && (
                <a href={store.twitterUrl || "#"} target={store.twitterUrl ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <XIcon className="w-5 h-5" />
                </a>
              )}
              {(store as any).showTiktok !== false && (
                <a href={store.tiktokUrl || "#"} target={store.tiktokUrl ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <TiktokIcon className="w-5 h-5" />
                </a>
              )}
              {(store as any).showSnapchat !== false && (
                <a href={store.snapchatUrl || "#"} target={store.snapchatUrl ? "_blank" : undefined} rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <SnapchatIcon className="w-5 h-5" />
                </a>
              )}
            </div>
            
            <div className="text-xs text-surface-400 mt-10 pt-6 border-t border-surface-100 flex items-center justify-center gap-2">
              مدعوم بواسطة <a href="https://menura.site" target="_blank" className="font-bold text-surface-950 hover:text-surface-700">{platformName}</a> &copy; {new Date().getFullYear()}
            </div>
          </div>
        </footer>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 start-6 z-40 flex flex-col gap-4">
          {store.whatsappNumber && (
            <div className="relative group">
              <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></div>
              <a 
                href={`https://wa.me/${formatWhatsappNumber(store.whatsappNumber)}`} 
                target="_blank" 
                rel="noreferrer"
                className="relative w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:bg-[#20bd5a] transition-all shadow-xl shadow-[#25D366]/40 hover:scale-110"
              >
                <WhatsAppIcon className="w-7 h-7" />
              </a>
            </div>
          )}
          {store.phone && (
            <a 
              href={`tel:${store.phone}`} 
              className="w-14 h-14 bg-surface-950 text-white rounded-full flex items-center justify-center hover:bg-surface-800 transition-all shadow-xl hover:scale-110"
            >
              <Phone className="w-6 h-6" />
            </a>
          )}
        </div>

      </div>
      
      {/* Global Cart Sidebar */}
      <CartSidebar 
        store={{
          id: store.id,
          name: store.name,
          whatsappNumber: store.whatsappNumber,
          enableWhatsappOrders: store.enableWhatsappOrders,
          currency: store.currency,
          primaryColor: store.primaryColor,
        }}
        branches={store.branches}
        deliveryAreas={store.deliveryAreas.map(a => ({ id: a.id, name: a.name, fee: Number(a.deliveryFee) }))}
      />
    </CartProvider>
  );
}
