'use client';

import React, { useEffect, useState } from 'react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const immersiveHero = document.getElementById('immersive-gearmotor');
      const heroEnd = immersiveHero
        ? immersiveHero.offsetTop + immersiveHero.offsetHeight - window.innerHeight
        : 300;

      setIsVisible(window.scrollY > Math.max(300, heroEnd));
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    window.addEventListener('resize', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Kembali ke atas halaman"
      className="fixed bottom-20 right-6 z-40 rounded-full border border-white/15 bg-[#0F2942] p-3.5 text-white shadow-sm transition-colors duration-200 hover:bg-[#15426B] focus-visible:outline-2 focus-visible:outline-[#0E6BA8]"
    >
      <DynamicIcon name="ChevronRight" size={20} className="-rotate-90" />
    </button>
  );
}
