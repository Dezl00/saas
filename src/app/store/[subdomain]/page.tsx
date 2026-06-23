import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StorefrontView } from "@/components/store/StorefrontView";

export default async function StorePage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const store = await prisma.store.findUnique({
    where: { subdomain: params.subdomain },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      },
      menuItems: {
        where: { isAvailable: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          sizes: true,
          addons: true,
        }
      }
    }
  });

  if (!store) {
    notFound();
  }

  // Convert Decimal to numbers for client components
  const serializedMenuItems = store.menuItems.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    image: item.image,
    categoryId: item.categoryId,
    sizes: item.sizes.map(size => ({ id: size.id, name: size.name, price: Number(size.price) })),
    addons: item.addons.map(addon => ({ id: addon.id, name: addon.name, price: Number(addon.price) }))
  }));

  return (
    <div className="animate-fade-in">
      <StorefrontView 
        store={{ name: store.name, currency: store.currency }}
        categories={store.categories.map(c => ({ id: c.id, name: c.name }))}
        menuItems={serializedMenuItems}
      />
    </div>
  );
}
