"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Store as StoreIcon } from "lucide-react";

type Props = {
  logo: string | null;
  storeName: string;
  primaryColor?: string | null;
};

export function StoreSplashScreen({ logo, storeName, primaryColor }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => setIsVisible(false), 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const color = primaryColor || "#E74C3C";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white ${isFadingOut ? "animate-splash-fade-out" : ""}`}
    >
      <div className="flex flex-col items-center justify-center px-6">
        {/* Logo without border/circle */}
        <div className="relative">
          <div
            className="w-28 h-28 flex items-center justify-center overflow-hidden animate-splash-pulse"
            style={{
              "--splash-glow": `${color}66`,
            } as React.CSSProperties}
          >
            {logo ? (
              <Image
                src={logo}
                alt={storeName}
                width={112}
                height={112}
                className="w-full h-full object-contain"
                priority
              />
            ) : (
              <StoreIcon className="w-16 h-16" style={{ color }} />
            )}
          </div>

          {/* Animated rings */}
          <div className="absolute -inset-6">
            <div
              className="absolute inset-0 rounded-full border-2 animate-splash-ring-ping"
              style={{ borderColor: `${color}33` }}
            />
            <div
              className="absolute inset-3 rounded-full border animate-splash-ring-pulse"
              style={{ borderColor: `${color}22` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
