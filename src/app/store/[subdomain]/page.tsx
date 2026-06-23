import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/store/AddToCartButton";

export default async function StorePage({ params }: { params: { subdomain: string } }) {
  const store = await prisma.store.findUnique({
    where: { subdomain: params.subdomain },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
      },
      menuItems: {
        where: { isAvailable: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!store) {
    notFound();
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {store.categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-surface-200">
          <h2 className="text-2xl font-bold text-surface-950">المنيو قيد التجهيز</h2>
          <p className="text-surface-500 mt-2">عذراً، هذا المطعم لم يقم بإضافة المنيو الخاص به بعد.</p>
        </div>
      ) : (
        store.categories.map(category => {
          // Filter items for this category
          const items = store.menuItems.filter(item => item.categoryId === category.id);
          
          if (items.length === 0) return null;

          return (
            <div key={category.id} id={`category-${category.id}`} className="scroll-mt-20">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-black text-surface-950">{category.name}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-surface-200 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all group">
                    {/* Item Image */}
                    {item.imageUrl ? (
                      <div className="aspect-video w-full overflow-hidden bg-surface-100">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-surface-100 flex items-center justify-center">
                        <span className="text-surface-400 font-medium">لا توجد صورة</span>
                      </div>
                    )}

                    {/* Item Content */}
                    <div className="p-5">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-lg text-surface-950 leading-tight">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-surface-500 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                          {formatPrice(Number(item.price), store.currency)}
                        </div>
                      </div>

                      <AddToCartButton 
                        item={{
                          id: item.id,
                          name: item.name,
                          price: Number(item.price),
                          image: item.imageUrl
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
