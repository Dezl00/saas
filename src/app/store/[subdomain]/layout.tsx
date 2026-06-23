import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Store as StoreIcon, ShoppingBag, MapPin, Phone, MessageCircle, Facebook, Instagram, Twitter, Link as LinkIcon } from "lucide-react";
import { CartProvider } from "@/components/store/CartProvider";
import { CartSidebar } from "@/components/store/CartSidebar";
import { CartHeaderButton } from "@/components/store/CartHeaderButton";

// SVG Icons for TikTok and Snapchat
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
  });

  if (!store) {
    notFound();
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-surface-50 pb-20 flex flex-col">
        {/* Store Header - Flat Design */}
        <header className="sticky top-0 z-30 bg-white border-b border-surface-200">
          <div className="max-w-5xl mx-auto px-4 h-auto py-4 flex items-center justify-between">
            {/* Store Info & Socials */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-none bg-primary-100 flex items-center justify-center">
                <StoreIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="font-bold text-lg text-surface-950 leading-tight">{store.name}</h1>
                
                {/* Social Media Icons */}
                <div className="flex items-center gap-2 mt-1.5">
                  {store.facebookUrl && (
                    <a href={store.facebookUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-blue-600 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {store.instagramUrl && (
                    <a href={store.instagramUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-pink-600 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {store.twitterUrl && (
                    <a href={store.twitterUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-blue-400 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {store.tiktokUrl && (
                    <a href={store.tiktokUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-black transition-colors">
                      <TiktokIcon className="w-4 h-4" />
                    </a>
                  )}
                  {store.snapchatUrl && (
                    <a href={store.snapchatUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-yellow-500 transition-colors">
                      <SnapchatIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Cart Button */}
            <CartHeaderButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-surface-200 mt-12 py-8">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
            <h2 className="font-bold text-lg text-surface-950">{store.name}</h2>
            {store.description && (
              <p className="text-surface-500 text-sm max-w-md mx-auto">{store.description}</p>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-surface-600 text-sm mt-4">
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

            <div className="flex justify-center items-center gap-4 mt-6">
              {store.facebookUrl && <a href={store.facebookUrl} target="_blank" rel="noreferrer" className="w-10 h-10 bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors text-surface-700"><Facebook className="w-5 h-5" /></a>}
              {store.instagramUrl && <a href={store.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors text-surface-700"><Instagram className="w-5 h-5" /></a>}
              {store.twitterUrl && <a href={store.twitterUrl} target="_blank" rel="noreferrer" className="w-10 h-10 bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors text-surface-700"><Twitter className="w-5 h-5" /></a>}
              {store.tiktokUrl && <a href={store.tiktokUrl} target="_blank" rel="noreferrer" className="w-10 h-10 bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors text-surface-700"><TiktokIcon className="w-5 h-5" /></a>}
              {store.snapchatUrl && <a href={store.snapchatUrl} target="_blank" rel="noreferrer" className="w-10 h-10 bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors text-surface-700"><SnapchatIcon className="w-5 h-5" /></a>}
            </div>
            
            <div className="text-xs text-surface-400 mt-8 pt-4 border-t border-surface-100">
              مدعوم بواسطة منصتك &copy; {new Date().getFullYear()}
            </div>
          </div>
        </footer>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 start-6 z-40 flex flex-col gap-3">
          {store.whatsappNumber && (
            <a 
              href={`https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-14 h-14 bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors border-2 border-white"
            >
              <MessageCircle className="w-7 h-7" />
            </a>
          )}
          {store.phone && (
            <a 
              href={`tel:${store.phone}`} 
              className="w-14 h-14 bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors border-2 border-white"
            >
              <Phone className="w-7 h-7" />
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
