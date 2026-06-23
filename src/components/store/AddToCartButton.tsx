"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

type Props = {
  item: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
  };
};

export function AddToCartButton({ item }: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(item)}
      className="flex items-center justify-center gap-2 w-full py-2.5 mt-4 bg-primary-50 text-primary-600 font-bold rounded-xl hover:bg-primary-500 hover:text-white transition-colors"
    >
      <ShoppingBag className="w-4 h-4" />
      إضافة للسلة
    </button>
  );
}
