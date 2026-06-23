import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Store as StoreIcon, ShoppingBag, MapPin, Phone, MessageCircle, Link as LinkIcon } from "lucide-react";
import { CartProvider } from "@/components/store/CartProvider";
import { CartSidebar } from "@/components/store/CartSidebar";
import { CartHeaderButton } from "@/components/store/CartHeaderButton";

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
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.34 6.34 0 0 0 6.25-6.36V11.53a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2.7-.96Z"/>
  </svg>
);

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.12 2C8.36 2 7.15 4.54 7.15 5.51v.17c-.4.04-.84.09-1.29.15-1.57.23-2.19.78-2.27 1.48-.05.41.13.88.58 1.42a18.25 18.25 0 0 1 1.78 2.53 1.95 1.95 0 0 0-1.07.6c-1.12.91-1.39 2.11-.78 3.4.38.8 1.25 1.5 2.5 2.05-.01.12-.03.24-.04.36-.1.97-.24 2.33 1.05 3.33a5.55 5.55 0 0 0 3.41 1c1.33 0 2.65-.3 3.65-.87.42-.24.81-.52 1.16-.84.22-.2.43-.43.64-.67.2.24.42.47.64.67.35.32.74.6 1.16.84 1 .57 2.32.87 3.65.87 1.47 0 2.58-.33 3.41-1 1.29-1 1.15-2.36 1.05-3.33-.01-.12-.03-.24-.04-.36 1.25-.55 2.12-1.25 2.5-2.05.61-1.29.34-2.49-.78-3.4a1.95 1.95 0 0 0-1.07-.6 18.25 18.25 0 0 1 1.78-2.53c.45-.54.63-1.01.58-1.42-.08-.7-.7-1.25-2.27-1.48-.45-.06-.89-.11-1.29-.15v-.17C16.85 4.54 15.64 2 11.88 2h.24Z"/>
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
  const store = await prisma.store.findUnique({
    where: { subdomain: params.subdomain },
    include: {
      branches: { where: { isActive: true } },
      deliveryAreas: { where: { isActive: true } }
    }
  });

  if (!store) {
    notFound();
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-surface-50 pb-20 flex flex-col">
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
        <section className="bg-white border-b border-surface-200 py-10 px-4">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center overflow-hidden mb-4 z-10 -mt-16 sm:-mt-20 relative">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <StoreIcon className="w-10 h-10 text-primary-600" />
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-surface-950 mb-3">{store.name}</h1>
            
            {/* Social Media Icons in Hero */}
            <div className="flex items-center justify-center gap-3 mt-2">
              {store.facebookUrl && (
                <a href={store.facebookUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-surface-600 hover:bg-[#1877F2] hover:text-white transition-colors">
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {store.instagramUrl && (
                <a href={store.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-surface-600 hover:bg-[#E4405F] hover:text-white transition-colors">
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {store.twitterUrl && (
                <a href={store.twitterUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-surface-600 hover:bg-black hover:text-white transition-colors">
                  <XIcon className="w-4 h-4" />
                </a>
              )}
              {store.tiktokUrl && (
                <a href={store.tiktokUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-surface-600 hover:bg-black hover:text-white transition-colors">
                  <TiktokIcon className="w-5 h-5" />
                </a>
              )}
              {store.snapchatUrl && (
                <a href={store.snapchatUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-surface-600 hover:bg-[#FFFC00] hover:text-black transition-colors">
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
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 text-center text-white shadow-xl flex flex-col items-center">
            <h3 className="text-2xl font-black mb-2">هل تمتلك مطعماً أو متجراً؟</h3>
            <p className="text-primary-100 mb-6 max-w-lg">
              أنشئ متجرك الإلكتروني الخاص في دقائق وابدأ في استقبال الطلبات عبر الواتساب مباشرة وبدون عمولات!
            </p>
            <a href="/" target="_blank" className="bg-white text-primary-700 font-bold py-3 px-8 rounded-2xl hover:bg-surface-50 transition-colors shadow-lg hover:shadow-xl">
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

            <div className="flex justify-center items-center gap-6 mt-8">
              {store.facebookUrl && <a href={store.facebookUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-[#1877F2] transition-colors"><FacebookIcon className="w-6 h-6" /></a>}
              {store.instagramUrl && <a href={store.instagramUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-[#E4405F] transition-colors"><InstagramIcon className="w-6 h-6" /></a>}
              {store.twitterUrl && <a href={store.twitterUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-surface-950 transition-colors"><XIcon className="w-5 h-5" /></a>}
              {store.tiktokUrl && <a href={store.tiktokUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-surface-950 transition-colors"><TiktokIcon className="w-6 h-6" /></a>}
              {store.snapchatUrl && <a href={store.snapchatUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-[#FFFC00] transition-colors"><SnapchatIcon className="w-6 h-6" /></a>}
            </div>
            
            <div className="text-xs text-surface-400 mt-10 pt-6 border-t border-surface-100 flex items-center justify-center gap-2">
              مدعوم بواسطة <a href="/" className="font-bold text-primary-600 hover:text-primary-700">منصتك</a> &copy; {new Date().getFullYear()}
            </div>
          </div>
        </footer>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 start-6 z-40 flex flex-col gap-4">
          {store.whatsappNumber && (
            <div className="relative group">
              <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></div>
              <a 
                href={`https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}`} 
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
            currency: store.currency
          }}
          branches={store.branches.map(b => ({ id: b.id, name: b.name, address: b.address }))}
          deliveryAreas={store.deliveryAreas.map(a => ({ id: a.id, name: a.name, fee: Number(a.deliveryFee) }))}
        />
      </div>
    </CartProvider>
  );
}
