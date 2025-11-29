"use client";

import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const rafIdRef = useRef<number | null>(null);

  // При смене страницы скроллим наверх
  useEffect(() => {
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      syncTouch: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    (window as any).lenis = lenis;

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}
