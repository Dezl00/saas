import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Store as StoreIcon, ShoppingBag, MapPin, Phone, MessageCircle, Link as LinkIcon } from "lucide-react";
import { CartProvider } from "@/components/store/CartProvider";
import { CartSidebar } from "@/components/store/CartSidebar";
import { CartHeaderButton } from "@/components/store/CartHeaderButton";
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
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.27.026C11.5-.04 10.74-.01 9.98.05a9.38 9.38 0 0 0-1.72.31A10 10 0 0 0 6.9.82C5.92 1.2 4.96 1.8 4.2 2.59c-.48.5-.89 1.07-1.18 1.69-.17.37-.3.77-.38 1.17-.1.45-.16.92-.15 1.39.02.43.08.86.19 1.28.16.57.38 1.12.67 1.63.1.18.23.36.36.53.07.09.15.17.23.25.02.02.05.03.07.05a.4.4 0 0 1-.16.33c-.15.1-.32.17-.49.23-.17.06-.35.1-.53.13-.18.03-.35.05-.53.07l-.27.03a6.52 6.52 0 0 0-.6.13c-.1.03-.2.07-.3.12a1.44 1.44 0 0 0-.39.26c-.13.12-.24.26-.34.42-.1.17-.18.36-.23.55a1.27 1.27 0 0 0 .04.81c.12.3.34.56.62.72.28.16.6.25.93.31.65.13 1.31.18 1.98.17a16 16 0 0 0 1.95-.12c.15-.02.3-.04.44-.06.13-.02.25-.04.38-.04l.05-.01h.05c.07.01.15.03.21.07.06.04.1.1.13.17.02.04.03.09.04.14.01.05.02.1.03.14.03.14.07.28.12.41a4.23 4.23 0 0 0 .28.59c.2.33.45.62.75.87.54.43 1.21.67 1.9.72.17.01.33.01.5.01l.24.01a3.53 3.53 0 0 0 .34-.02c.3-.02.6-.05.9-.11.38-.07.75-.17 1.1-.32.36-.14.7-.31 1-.52.27-.18.52-.41.73-.67.19-.24.34-.51.46-.8a4.11 4.11 0 0 0 .19-.87c.01-.13.01-.26.02-.38.01-.11.02-.23.03-.34 0-.11 0-.22-.01-.33a3.52 3.52 0 0 1 .02-.7c.01-.11.05-.2.11-.27a.5.5 0 0 1 .18-.14 1.15 1.15 0 0 1 .25-.07c.08-.02.16-.03.24-.04l.05 0c.13 0 .25-.01.38.01a4 4 0 0 0 .54.08 7.22 7.22 0 0 0 1.26.06c.65.01 1.29-.02 1.92-.12a3.15 3.15 0 0 0 1.1-.31 1.48 1.48 0 0 0 .68-.64c.15-.26.21-.57.17-.86a1.36 1.36 0 0 0-.29-.7c-.19-.23-.44-.4-.71-.51a4 4 0 0 0-1.11-.25 7 7 0 0 0-1.25-.04c-.39.02-.78.07-1.16.14l-.06.01a1.05 1.05 0 0 1-.22.02c-.08.01-.16.02-.25.01a.48.48 0 0 1-.2-.1.5.5 0 0 1-.13-.19c-.06-.11-.08-.24-.07-.37.01-.12.04-.24.07-.36.03-.12.08-.24.13-.35a3.9 3.9 0 0 0 .19-.46c.11-.32.2-.66.27-1 .11-.53.18-1.07.21-1.61.03-.5.05-1.01.03-1.52a8.55 8.55 0 0 0-.46-2.22 8.7 8.7 0 0 0-1.09-2.07A8.6 8.6 0 0 0 15 2.15 8.87 8.87 0 0 0 12.27.026Z"/>
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
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border border-surface-200">
                {store.logo ? (
                  <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                ) : (
                  <StoreIcon className="w-5 h-5 text-primary-600" />
                )}
              </div>
              <h1 className="font-bold text-base text-surface-950">{store.name}</h1>
            </div>

            {/* Cart Button */}
            <CartHeaderButton />
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
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full border border-surface-200 flex items-center justify-center overflow-hidden mb-5">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <StoreIcon className="w-12 h-12 text-primary-600" />
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
        <footer className="bg-white border-t border-surface-200 mt-12 py-10">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-surface-100 rounded-full flex items-center justify-center mb-4 border border-surface-200 overflow-hidden">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <StoreIcon className="w-6 h-6 text-surface-400" />
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

        {/* Global Cart Sidebar */}
        <CartSidebar 
          store={{
            id: store.id,
            name: store.name,
            whatsappNumber: store.whatsappNumber,
            enableWhatsappOrders: store.enableWhatsappOrders,
            currency: store.currency,
            primaryColor: store.primaryColor
          }}
          branches={store.branches.map(b => ({ id: b.id, name: b.name, address: b.address }))}
          deliveryAreas={store.deliveryAreas.map(a => ({ id: a.id, name: a.name, fee: Number(a.deliveryFee) }))}
        />
      </div>
    </CartProvider>
  );
}
