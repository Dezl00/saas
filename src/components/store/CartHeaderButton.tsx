"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import Link from "next/link";
import { useParams } from "next/navigation";

export function CartHeaderButton() {
  const { items } = useCart();
  const params = useParams();
  const subdomain = params?.subdomain as string;
  
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href={`/store/${subdomain}/cart`}
      className="relative p-2 hover:opacity-80 transition-opacity active:scale-95 flex items-center justify-center"
    >
      <ShoppingBag className="w-6 h-6 text-surface-700" />
      {totalQuantity > 0 && (
        <span className="absolute top-0 end-0 -mt-1 -me-1 w-5 h-5 rounded-full bg-error-500 text-white text-xs font-bold flex items-center justify-center shadow-sm animate-fade-in">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}
