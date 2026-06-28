"use client";

import { useState, useEffect, useRef } from "react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";
import Image from "next/image";
import { LayoutGrid, List, Filter, X, Plus, Minus, Check, ShoppingBag, Loader2 } from "lucide-react";

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
type Store = { name: string; currency: string; primaryColor?: string | null; secondaryColor?: string | null };

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
  const isManualScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrolling.current) return;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("category-", "");
            setActiveTab(id);
            // Scroll the tab bar to show the active tab
            document.getElementById(`tab-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(`category-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);
  const [gridCols, setGridCols] = useState<1 | 2>(2);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price_desc" | "price_asc" | "popular">("default");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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
    
    // Push state to browser history to catch back button
    window.history.pushState({ modal: `product-${item.id}` }, "", `#product-${item.id}`);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    if (window.location.hash.startsWith("#product-")) {
      window.history.back(); // Remove the hash from URL cleanly
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      // If user presses back button, the hash will change/disappear
      if (selectedProduct && !window.location.hash.startsWith("#product-")) {
        setSelectedProduct(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedProduct]);

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

    setIsAddingToCart(true);

    setTimeout(() => {
      addItem({
        id: uniqueCartItemId, // Use unique ID to separate different sizes/addons of same product
        name: nameWithDetails,
        price: finalPrice,
        quantity,
        image: selectedProduct.image,
      });

      setToastItem({ name: nameWithDetails, image: selectedProduct.image });
      setIsAddingToCart(false);
      closeProductModal(); // close modal

      // Auto close toast after 5s
      setTimeout(() => setToastItem(null), 5000);
    }, 400); // fraction of a second loading
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
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-white border border-surface-200 rounded-3xl p-4 shadow-2xl flex flex-col gap-3 animate-slide-in-top">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-surface-100 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border border-surface-200">
              {toastItem.image ? (
                <Image src={toastItem.image} alt={toastItem.name} width={48} height={48} className="w-full h-full object-cover" />
              ) : (
                <ShoppingBag className="w-5 h-5 text-surface-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-success-600 text-sm flex items-center gap-1"><Check className="w-4 h-4"/> تمت الإضافة</p>
              <p className="text-xs text-surface-600 line-clamp-1 mt-0.5">{toastItem.name}</p>
            </div>
            <button onClick={() => setToastItem(null)} className="text-surface-400 hover:text-surface-950 bg-surface-100 p-1.5 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setToastItem(null); setIsCartOpen(true); }}
              className="flex-1 py-2 text-white font-bold text-sm rounded-xl transition-colors"
              style={{ backgroundColor: store.primaryColor || 'var(--color-primary-600)' }}
            >
              عرض السلة
            </button>
            <button 
              onClick={() => setToastItem(null)}
              className="flex-1 py-2 bg-surface-100 text-surface-950 font-bold text-sm border border-surface-200 rounded-xl transition-colors hover:bg-surface-200"
            >
              متابعة التسوق
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
              id={`tab-${cat.id}`}
              onClick={() => {
                isManualScrolling.current = true;
                setActiveTab(cat.id);
                document.getElementById(`category-${cat.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                
                // Reset manual scrolling flag after scroll animation
                if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
                scrollTimeout.current = setTimeout(() => {
                  isManualScrolling.current = false;
                }, 1000);
              }}
              className={`whitespace-nowrap px-4 py-2 font-bold text-sm transition-colors border rounded-2xl ${
                activeTab === cat.id
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-surface-600 border-surface-200 hover:bg-surface-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1 border-s border-surface-200 ps-2 relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`w-10 h-10 border flex items-center justify-center transition-colors rounded-xl ${isFilterOpen ? 'bg-surface-950 text-white border-surface-950' : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-100'}`}
          >
            <Filter className="w-4 h-4" />
          </button>
          
          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute top-12 end-0 w-40 bg-white border border-surface-200 rounded-xl shadow-xl z-50 py-1 animate-zoom-in">
                <h4 className="px-3 py-1.5 text-[10px] font-bold text-surface-400 border-b border-surface-100 mb-1">ترتيب حسب</h4>
                <div className="flex flex-col">
                  {[
                    { id: 'default', label: 'الافتراضي' },
                    { id: 'price_desc', label: 'الأعلى سعراً' },
                    { id: 'price_asc', label: 'الأقل سعراً' },
                    { id: 'popular', label: 'الأكثر طلباً' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id as any);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-start px-3 py-2 text-xs transition-colors ${sortBy === option.id ? 'bg-primary-50 text-primary-700 font-bold' : 'text-surface-700 hover:bg-surface-50'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button 
            onClick={() => setGridCols(gridCols === 1 ? 2 : 1)}
            className="w-10 h-10 bg-white border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-100 sm:hidden rounded-xl"
          >
            {gridCols === 1 ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-12">
        {categories.map((category) => {
          let items = menuItems.filter((item) => item.categoryId === category.id);
          if (items.length === 0) return null;

          if (sortBy === 'price_asc') {
            items = [...items].sort((a, b) => Number(a.price) - Number(b.price));
          } else if (sortBy === 'price_desc') {
            items = [...items].sort((a, b) => Number(b.price) - Number(a.price));
          }

          return (
            <div key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
              <h2 className="text-xl font-black text-surface-950 mb-4">{category.name}</h2>
              
              <div className={`grid gap-4 ${gridCols === 1 ? "grid-cols-1" : "grid-cols-2"} sm:grid-cols-2 lg:grid-cols-3`}>
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleOpenProduct(item)}
                    className="bg-white border border-surface-200 rounded-3xl overflow-hidden flex flex-col cursor-pointer hover:border-surface-400 transition-colors shadow-none"
                  >
                    {item.image ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-surface-100 border-b border-surface-200">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          loading="lazy"
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-none p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeProductModal();
          }}
        >
          <div className="bg-white w-full max-w-md max-h-[85vh] flex flex-col animate-zoom-in overflow-hidden border border-surface-200 rounded-[2rem] shadow-none">
            {/* Modal Header Image */}
            <div className="relative h-48 sm:h-56 bg-surface-100 shrink-0">
              {selectedProduct.image ? (
                <Image src={selectedProduct.image} alt={selectedProduct.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-10 h-10 text-surface-300" /></div>
              )}
              <button 
                onClick={closeProductModal}
                className="absolute top-4 end-4 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-xl font-medium text-surface-950">{selectedProduct.name}</h2>
                {selectedProduct.description && (
                  <p className="text-surface-500 text-sm mt-2">{selectedProduct.description}</p>
                )}
                <div className="mt-3 font-medium text-primary-600 text-lg">
                  {formatPrice(selectedProduct.price, store.currency)}
                </div>
              </div>

              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div>
                  <h3 className="font-medium text-surface-950 mb-3 bg-surface-50 rounded-xl p-2.5 border border-surface-200">اختر الحجم (إجباري)</h3>
                  <div className="space-y-2">
                    {selectedProduct.sizes.map(size => (
                      <label key={size.id} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${selectedSize?.id === size.id ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:bg-surface-50'}`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="size" 
                            checked={selectedSize?.id === size.id}
                            onChange={() => setSelectedSize(size)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="font-normal text-surface-950">{size.name}</span>
                        </div>
                        <span className="font-medium text-surface-950">{formatPrice(size.price, store.currency)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons */}
              {selectedProduct.addons && selectedProduct.addons.length > 0 && (
                <div>
                  <h3 className="font-medium text-surface-950 mb-3 bg-surface-50 rounded-xl p-2.5 border border-surface-200">إضافات (اختياري)</h3>
                  <div className="space-y-2">
                    {selectedProduct.addons.map(addon => {
                      const isSelected = selectedAddons.some(a => a.id === addon.id);
                      return (
                        <label key={addon.id} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:bg-surface-50'}`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleToggleAddon(addon)}
                              className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span className="font-normal text-surface-950">{addon.name}</span>
                          </div>
                          <span className="font-medium text-surface-500">+{formatPrice(addon.price, store.currency)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Quantity + Add to Cart) */}
            <div className="p-4 border-t border-surface-200 bg-white flex items-center gap-3">
              <div className="flex items-center bg-primary-50 rounded-xl p-1 border border-primary-100/50 h-12">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center bg-white rounded-lg text-primary-600 hover:bg-primary-100 transition-colors active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium text-lg w-8 text-center text-primary-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center bg-white rounded-lg text-primary-600 hover:bg-primary-100 transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-[2] h-12 text-white font-medium rounded-2xl transition-all flex items-center justify-center gap-2 px-4 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] disabled:opacity-80"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>إضافة</span>
                    <span className="text-white/50 font-normal">|</span>
                    <span>{formatPrice(calculateModalTotal(), store.currency)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
