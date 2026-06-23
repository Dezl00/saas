import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string, currency: string = "EGP") {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `${num.toFixed(2)} ${currency === "EGP" ? "ج.م" : currency}`;
}

export function generateOrderNumber(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
