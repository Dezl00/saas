"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { InfinityLoader } from "./InfinityLoader";

function InnerLoader({ colorClass }: { colorClass: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return <InfinityLoader colorClass={colorClass} />;
}

export function PageTransitionLoader({ colorClass = "text-primary-600" }: { colorClass?: string }) {
  return (
    <Suspense fallback={null}>
      <InnerLoader colorClass={colorClass} />
    </Suspense>
  );
}
