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

  let categoriesToDisplay = store.categories;
  let menuItemsToDisplay = store.menuItems;

  if (store.categories.length === 0 && store.showDefaultProducts) {
    const defaultStore = await prisma.store.findUnique({
      where: { id: 'DEFAULT_STORE' },
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

    if (defaultStore) {
      categoriesToDisplay = defaultStore.categories;
      menuItemsToDisplay = defaultStore.menuItems;
    }
  }

  // Convert Decimal to numbers for client components
  const serializedMenuItems = menuItemsToDisplay.map(item => ({
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
        categories={categoriesToDisplay.map(c => ({ id: c.id, name: c.name }))}
        menuItems={serializedMenuItems}
      />
    </div>
  );
}
