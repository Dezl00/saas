"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

type Banner = {
  id: string;
  image: string;
  title: string | null;
  link: string | null;
};

type Props = {
  banners: Banner[];
};

export function StoreBannersCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const total = banners.length;

  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    resetAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [total, resetAutoplay]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setTranslateX(0);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(translateX) > 50) {
      if (translateX > 0) {
        setCurrent((prev) => (prev - 1 + total) % total);
      } else {
        setCurrent((prev) => (prev + 1) % total);
      }
    }
    setTranslateX(0);
    resetAutoplay();
  };

  if (banners.length === 0) return null;

  return (
    <div className="w-full h-full relative">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden w-full h-full touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full w-full"
          style={{
            transform: `translateX(calc(${current * -100}% + ${isDragging ? translateX : 0}px))`,
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full shrink-0">
              {banner.link ? (
                <a href={banner.link} target="_blank" rel="noreferrer" className="block w-full h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={banner.image}
                      alt={banner.title || "عرض"}
                      fill
                      sizes="(max-width: 768px) 100vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </a>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={banner.image}
                    alt={banner.title || "عرض"}
                    fill
                    sizes="(max-width: 768px) 100vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
