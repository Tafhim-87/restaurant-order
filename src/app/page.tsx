// app/page.tsx
'use client';

import { useEffect } from 'react';
import Hero from '@/app/components/home/Hero';

export default function Home() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const initLenis = async () => {
      const Lenis = (await import('lenis')).default;
      
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Cleanup function
      return () => {
        lenis.destroy();
      };
    };

    initLenis();
  }, []);

  return (
    <div>
      <Hero />
    </div>
  );
}