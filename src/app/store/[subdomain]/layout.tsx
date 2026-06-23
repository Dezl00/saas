import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Store as StoreIcon, ShoppingBag } from "lucide-react";
import { CartProvider } from "@/components/store/CartProvider";
import { CartSidebar } from "@/components/store/CartSidebar";
import { CartHeaderButton } from "@/components/store/CartHeaderButton";

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

export default async function StoreLayout(props: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const params = await props.params;
  const store = await prisma.store.findUnique({
    where: { subdomain: params.subdomain },
  });

  if (!store) {
    notFound();
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-surface-50 pb-20">
        {/* Store Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-surface-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Store Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-inner">
                <StoreIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-surface-950 leading-none">{store.name}</h1>
                {store.description && (
                  <p className="text-xs text-surface-500 mt-1 line-clamp-1">
                    {store.description}
                  </p>
                )}
              </div>
            </div>

            {/* Cart Button */}
            <CartHeaderButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>

        {/* Global Cart Sidebar */}
        <CartSidebar />
      </div>
    </CartProvider>
  );
}
