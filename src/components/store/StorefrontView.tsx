"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { LayoutGrid, List, Filter, X, Plus, Minus, Check, ShoppingBag } from "lucide-react";

type Size = { id: string; name: string; price: number };
type Addon = { id: string; name: string; price: number };
type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  categoryId: string;
  sizes: Size[];
  addons: Addon[];
};
type Category = { id: string; name: string };
type Store = { name: string; currency: string };

export function StorefrontView({
  store,
  categories,
  menuItems,
}: {
  store: Store;
  categories: Category[];
  menuItems: MenuItem[];
}) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id || "");
  const [gridCols, setGridCols] = useState<1 | 2>(2);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // Modal State
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Toast State
  const [toastItem, setToastItem] = useState<{name: string, image: string | null} | null>(null);

  const { addItem, setIsCartOpen } = useCart();

  const handleOpenProduct = (item: MenuItem) => {
    setSelectedProduct(item);
    setSelectedSize(item.sizes.length > 0 ? item.sizes[0] : null);
    setSelectedAddons([]);
    setQuantity(1);
  };

  const handleToggleAddon = (addon: Addon) => {
    if (selectedAddons.find(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const calculateModalTotal = () => {
    if (!selectedProduct) return 0;
    const basePrice = selectedSize ? Number(selectedSize.price) : Number(selectedProduct.price);
    const addonsPrice = selectedAddons.reduce((acc, curr) => acc + Number(curr.price), 0);
    return (basePrice + addonsPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    const basePrice = selectedSize ? Number(selectedSize.price) : Number(selectedProduct.price);
    const addonsPrice = selectedAddons.reduce((acc, curr) => acc + Number(curr.price), 0);
    const finalPrice = basePrice + addonsPrice;

    // Create a unique ID if sizes or addons are selected, so they don't merge incorrectly
    const uniqueCartItemId = `${selectedProduct.id}-${selectedSize?.id || 'base'}-${selectedAddons.map(a => a.id).sort().join('-')}`;

    let addonsText = selectedAddons.map(a => a.name).join('، ');
    let nameWithDetails = selectedProduct.name;
    if (selectedSize) nameWithDetails += ` (${selectedSize.name})`;
    if (addonsText) nameWithDetails += ` + ${addonsText}`;

    addItem({
      id: uniqueCartItemId, // Use unique ID to separate different sizes/addons of same product
      name: nameWithDetails,
      price: finalPrice,
      quantity,
      image: selectedProduct.image,
    });

    setToastItem({ name: nameWithDetails, image: selectedProduct.image });
    setSelectedProduct(null); // close modal

    // Auto close toast after 5s
    setTimeout(() => setToastItem(null), 5000);
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-surface-200">
        <h2 className="text-2xl font-bold text-surface-950">المنيو قيد التجهيز</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastItem && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-white border-2 border-primary-500 p-4 shadow-xl flex flex-col gap-3 animate-slide-in-top">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 text-success-600 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-surface-950 text-sm">تمت الإضافة للسلة بنجاح</p>
              <p className="text-xs text-surface-500 line-clamp-1">{toastItem.name}</p>
            </div>
            <button onClick={() => setToastItem(null)} className="text-surface-400 hover:text-surface-950">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setToastItem(null); setIsCartOpen(true); }}
              className="flex-1 py-2 bg-primary-600 text-white font-bold text-sm"
            >
              عرض السلة
            </button>
            <button 
              onClick={() => setToastItem(null)}
              className="flex-1 py-2 bg-surface-100 text-surface-950 font-bold text-sm border border-surface-200"
            >
              إكمال التسوق
            </button>
          </div>
        </div>
      )}

      {/* Toolbar: Tabs, Grid Toggle, Filter */}
      <div className="sticky top-16 z-20 bg-surface-50 py-2 flex items-center gap-2 border-b border-surface-200">
        {/* Categories Tabs - Scrollable */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                document.getElementById(`category-${cat.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`whitespace-nowrap px-4 py-2 font-bold text-sm transition-colors border ${
                activeTab === cat.id
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-surface-600 border-surface-200 hover:bg-surface-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1 border-s border-surface-200 ps-2">
          <button className="w-10 h-10 bg-white border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-100">
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setGridCols(gridCols === 1 ? 2 : 1)}
            className="w-10 h-10 bg-white border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-100 sm:hidden"
          >
            {gridCols === 1 ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-12">
        {categories.map((category) => {
          const items = menuItems.filter((item) => item.categoryId === category.id);
          if (items.length === 0) return null;

          return (
            <div key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
              <h2 className="text-xl font-black text-surface-950 mb-4">{category.name}</h2>
              
              <div className={`grid gap-4 ${gridCols === 1 ? "grid-cols-1" : "grid-cols-2"} sm:grid-cols-2 lg:grid-cols-3`}>
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleOpenProduct(item)}
                    className="bg-white border border-surface-200 flex flex-col cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    {item.image ? (
                      <div className="aspect-video w-full overflow-hidden bg-surface-100 border-b border-surface-200">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-surface-100 border-b border-surface-200 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-surface-300" />
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-surface-950 leading-tight">{item.name}</h3>
                        <span className="font-black text-primary-600 text-sm whitespace-nowrap">
                          {formatPrice(item.price, store.currency)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-surface-500 line-clamp-2 mt-auto">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col animate-slide-in-bottom sm:animate-zoom-in overflow-hidden border border-surface-200">
            {/* Modal Header Image */}
            <div className="relative h-48 bg-surface-100 border-b border-surface-200">
              {selectedProduct.image ? (
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-12 h-12 text-surface-300" /></div>
              )}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 end-4 w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-2xl font-black text-surface-950">{selectedProduct.name}</h2>
                {selectedProduct.description && (
                  <p className="text-surface-500 text-sm mt-2">{selectedProduct.description}</p>
                )}
                <div className="mt-3 font-bold text-primary-600 text-lg">
                  {formatPrice(selectedProduct.price, store.currency)}
                </div>
              </div>

              {/* Sizes */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div>
                  <h3 className="font-bold text-surface-950 mb-3 bg-surface-100 p-2 border-s-4 border-primary-500">اختر الحجم (إجباري)</h3>
                  <div className="space-y-2">
                    {selectedProduct.sizes.map(size => (
                      <label key={size.id} className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${selectedSize?.id === size.id ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:bg-surface-50'}`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="size" 
                            checked={selectedSize?.id === size.id}
                            onChange={() => setSelectedSize(size)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="font-medium text-surface-950">{size.name}</span>
                        </div>
                        <span className="font-bold text-primary-600">{formatPrice(size.price, store.currency)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons */}
              {selectedProduct.addons && selectedProduct.addons.length > 0 && (
                <div>
                  <h3 className="font-bold text-surface-950 mb-3 bg-surface-100 p-2 border-s-4 border-primary-500">إضافات (اختياري)</h3>
                  <div className="space-y-2">
                    {selectedProduct.addons.map(addon => {
                      const isSelected = selectedAddons.some(a => a.id === addon.id);
                      return (
                        <label key={addon.id} className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:bg-surface-50'}`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleToggleAddon(addon)}
                              className="w-4 h-4 text-primary-600"
                            />
                            <span className="font-medium text-surface-950">{addon.name}</span>
                          </div>
                          <span className="font-bold text-primary-600">+{formatPrice(addon.price, store.currency)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center justify-between bg-surface-50 p-4 border border-surface-200">
                <span className="font-bold text-surface-950">العدد:</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-white border border-surface-200 flex items-center justify-center hover:bg-surface-100 text-surface-600"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-black text-xl w-6 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-white border border-surface-200 flex items-center justify-center hover:bg-surface-100 text-surface-600"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-surface-200 bg-surface-50">
              <button 
                onClick={handleAddToCart}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>إضافة للسلة</span>
                <span>•</span>
                <span>{formatPrice(calculateModalTotal(), store.currency)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
