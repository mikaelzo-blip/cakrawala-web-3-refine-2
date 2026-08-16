'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { companyInfo, mainNavItems } from '@/data/company';
import { resolveSectionHref, cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('/');
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (pathname !== '/') return;

      const sections = ['layanan', 'keahlian', 'cara-kerja', 'mengapa-cbl', 'kontak'];

      if (window.scrollY < 200) {
        setActiveSection('/');
        return;
      }

      const scrollPosition = window.scrollY + 140;
      let current = '/';

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = `#${id}`;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const checkIsActive = (itemHref: string) => {
    if (pathname === '/') {
      if (itemHref === '/') return activeSection === '/';
      if (itemHref.startsWith('#')) return activeSection === itemHref;
      return pathname === itemHref;
    }
    return pathname === itemHref;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, itemHref: string) => {
    if (pathname === '/' && itemHref.startsWith('#')) {
      e.preventDefault();
      const sectionId = itemHref.substring(1);
      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        window.history.pushState(null, '', `/#${sectionId}`);
        setActiveSection(itemHref);
      }
    } else if (pathname === '/' && itemHref === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
      setActiveSection('/');
    }
  };

  const whatsappHref = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(
    'Halo CBL, saya ingin konsultasi kebutuhan teknik fasilitas kami.'
  )}`;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b bg-[#F4F1EA]/95 backdrop-blur-sm transition-colors duration-200',
          isScrolled ? 'border-[#102A43]/20' : 'border-[#102A43]/10'
        )}
      >
        <Container className="flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="group flex min-w-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-[#8C3B16] focus-visible:outline-offset-4"
          >
            <Image
              src="/logo/cbl-logo.png"
              alt="Logo CV Cakrawala Buana Lestari"
              width={38}
              height={38}
              className="h-[38px] w-[38px] shrink-0 object-contain"
              priority
            />
            <div className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-[-0.015em] text-[#102A43] sm:text-[0.95rem]">
                CV Cakrawala Buana Lestari
              </span>
              <span className="mt-0.5 hidden text-[0.62rem] font-medium uppercase tracking-[0.13em] text-[#657482] sm:block">
                Engineering · Technical Services
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 xl:flex" aria-label="Navigasi Utama">
            {mainNavItems.map((item) => {
              const href = resolveSectionHref(item.href, pathname);
              const isActive = checkIsActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    'border-b py-1 text-[0.72rem] font-semibold tracking-[0.04em] transition-colors',
                    isActive
                      ? 'border-[#8C3B16] text-[#8C3B16]'
                      : 'border-transparent text-[#536474] hover:border-[#102A43]/35 hover:text-[#102A43]'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 xl:block">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-b border-[#8C3B16] pb-1 text-sm font-semibold text-[#8C3B16] transition-colors hover:text-[#6F2E12]"
            >
              Project inquiry
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-[#102A43] transition-colors hover:text-[#8C3B16] focus-visible:outline-2 focus-visible:outline-[#8C3B16] xl:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Buka menu navigasi"
          >
            <DynamicIcon name="Menu" size={24} />
          </button>
        </Container>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        pathname={pathname}
        activeSection={activeSection}
        handleNavClick={handleNavClick}
      />
    </>
  );
}
