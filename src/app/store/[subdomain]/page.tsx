import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StorefrontView } from "@/components/store/StorefrontView";
import { cacheTag } from "next/cache";

async function getCachedStorefrontData(subdomain: string) {
  "use cache";
  cacheTag(`store-${subdomain}`);

  const store = await prisma.store.findFirst({
    where: {
      OR: [
        { subdomain: subdomain },
        { domains: { some: { name: subdomain } } }
      ]
    },
    select: {
      name: true,
      currency: true,
      showDefaultProducts: true,
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true }
      },
      menuItems: {
        where: { isAvailable: true },
        orderBy: [
          { sortOrder: 'asc' },
          { id: 'asc' }
        ],
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          categoryId: true,
          sizes: { select: { id: true, name: true, price: true } },
          addons: { select: { id: true, name: true, price: true } }
        }
      }
    }
  });

  if (!store) {
    return null;
  }

  cacheTag(`store-${store.id}`);

  let categoriesToDisplay = store.categories;
  let menuItemsToDisplay = store.menuItems;

  if (store.categories.length === 0 && store.showDefaultProducts) {
    const defaultStore = await prisma.store.findUnique({
      where: { id: 'DEFAULT_STORE' },
      select: {
        categories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: { id: true, name: true }
        },
        menuItems: {
          where: { isAvailable: true },
          orderBy: [
            { sortOrder: 'asc' },
            { id: 'asc' }
          ],
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            categoryId: true,
            sizes: { select: { id: true, name: true, price: true } },
            addons: { select: { id: true, name: true, price: true } }
          }
        }
      }
    });

    if (defaultStore) {
      categoriesToDisplay = defaultStore.categories;
      menuItemsToDisplay = defaultStore.menuItems;
    }
  }

  return { store, categoriesToDisplay, menuItemsToDisplay };
}

export default async function StorePage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  
  const data = await getCachedStorefrontData(params.subdomain);
  if (!data) {
    notFound();
  }

  const { store, categoriesToDisplay, menuItemsToDisplay } = data;

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
