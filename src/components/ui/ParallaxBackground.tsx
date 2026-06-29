"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export const ParallaxBackground = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 150]);
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || prefersReducedMotion) {
    return (
      <div className="absolute inset-0 w-full h-full bg-slate-50 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[40rem] bg-gradient-to-b from-primary-50/50 to-transparent" />
      </div>
    );
  }

  return (
    <motion.div 
      style={{ y }} 
      className="absolute inset-0 w-full h-[120%] -top-[10%] bg-slate-50 z-[-1] pointer-events-none overflow-hidden"
    >
      <div className="absolute top-[10%] inset-x-0 h-[40rem] bg-gradient-to-b from-primary-50/50 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)]" />
    </motion.div>
  );
};
