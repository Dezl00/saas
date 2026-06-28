"use client";

import dynamic from "next/dynamic";

export const DynamicCartSidebar = dynamic(
  () => import("@/components/store/CartSidebar").then(mod => mod.CartSidebar),
  { ssr: false }
);
