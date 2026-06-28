import { notFound } from "next/navigation";
import { StorefrontView } from "@/components/store/StorefrontView";
import { getStoreInfo, getStoreCatalog } from "./data";

export default async function StorePage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  
  const store = await getStoreInfo(params.subdomain);
  if (!store) {
    notFound();
  }

  const { categories: categoriesToDisplay, menuItems: menuItemsToDisplay } = await getStoreCatalog(store.id, store.showDefaultProducts);

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
