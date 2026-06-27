"use client";

import { InfinityLoader } from "./InfinityLoader";

export function PageTransitionLoader({ colorClass = "text-primary-600" }: { colorClass?: string }) {
  return <InfinityLoader colorClass={colorClass} />;
}
