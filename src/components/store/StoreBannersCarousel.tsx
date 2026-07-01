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
  const total = banners.length;
  const [current, setCurrent] = useState(total > 1 ? 1 : 0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const isJumping = useRef(false);

  const displayBanners = total > 1 ? [banners[total - 1], ...banners, banners[0]] : banners;
  const [isTransitioning, setIsTransitioning] = useState(true);

  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrent((prev) => prev + 1);
    }, 4000);
  }, []);

  useEffect(() => {
    if (total <= 1) return;
    resetAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [total, resetAutoplay]);

  // Handle infinite scroll jump
  useEffect(() => {
    if (total <= 1) return;
    
    let timeout: NodeJS.Timeout;
    if (current === 0) {
      timeout = setTimeout(() => {
        isJumping.current = true;
        setIsTransitioning(false);
        setCurrent(total);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            isJumping.current = false;
            setIsTransitioning(true);
          });
        });
      }, 400);
    } else if (current === total + 1) {
      timeout = setTimeout(() => {
        isJumping.current = true;
        setIsTransitioning(false);
        setCurrent(1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            isJumping.current = false;
            setIsTransitioning(true);
          });
        });
      }, 400);
    }
    return () => clearTimeout(timeout);
  }, [current, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isJumping.current) return;
    setIsDragging(true);
    setIsTransitioning(false);
    setStartX(e.touches[0].clientX);
    setTranslateX(0);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isJumping.current) return;
    const diff = e.touches[0].clientX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsTransitioning(true);
    if (Math.abs(translateX) > 50) {
      if (translateX > 0) {
        setCurrent((prev) => prev - 1);
      } else {
        setCurrent((prev) => prev + 1);
      }
    }
    setTranslateX(0);
    resetAutoplay();
  };

  if (banners.length === 0) return null;

  return (
    <div className="w-full h-full relative bg-surface-100">
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
          dir="ltr"
          style={{
            transform: `translateX(calc(${current * -100}% + ${isDragging ? translateX : 0}px))`,
            transition: isTransitioning ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
            willChange: "transform",
          }}
        >
          {displayBanners.map((banner, index) => (
            <div key={`${banner.id}-${index}`} className="w-full h-full shrink-0 bg-surface-100">
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
