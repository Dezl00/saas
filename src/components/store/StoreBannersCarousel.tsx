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
    <div className="mb-6">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(${current * -100}% + ${isDragging ? translateX : 0}px))`,
            transition: isDragging ? "none" : "transform 0.5s ease-out",
          }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full shrink-0">
              {banner.link ? (
                <a href={banner.link} target="_blank" rel="noreferrer">
                  <div className="relative aspect-[2.2/1] w-full">
                    <Image
                      src={banner.image}
                      alt={banner.title || "عرض"}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </a>
              ) : (
                <div className="relative aspect-[2.2/1] w-full">
                  <Image
                    src={banner.image}
                    alt={banner.title || "عرض"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrent(idx);
                resetAutoplay();
              }}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-6 h-2 bg-primary-500"
                  : "w-2 h-2 bg-surface-300 hover:bg-surface-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
