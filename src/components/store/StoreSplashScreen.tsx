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
        {/* Logo with pulse */}
        <div className="relative mb-10">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl animate-splash-pulse overflow-hidden"
            style={{
              backgroundColor: color,
              "--splash-glow": `${color}66`,
            } as React.CSSProperties}
          >
            {logo ? (
              <Image
                src={logo}
                alt={storeName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <StoreIcon className="w-12 h-12 text-white" />
            )}
          </div>

          {/* Animated rings */}
          <div className="absolute -inset-5">
            <div
              className="absolute inset-0 rounded-full border-2 animate-splash-ring-ping"
              style={{ borderColor: `${color}33` }}
            />
            <div
              className="absolute inset-2 rounded-full border animate-splash-ring-pulse"
              style={{ borderColor: `${color}22` }}
            />
          </div>
        </div>

        {/* Animated text stages */}
        <div className="text-center">
          <div className="relative h-10 flex items-center justify-center w-72">
            <h2
              className="text-xl font-bold animate-splash-stage stage-1"
              style={{ color }}
            >
              جار تحميل المنيو
            </h2>
            <h2
              className="text-xl font-bold animate-splash-stage stage-2"
              style={{ color }}
            >
              نجهز لك أفضل المنتجات
            </h2>
            <h2
              className="text-xl font-bold animate-splash-stage stage-3"
              style={{ color }}
            >
              استعد لتجربة مميزة!
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
