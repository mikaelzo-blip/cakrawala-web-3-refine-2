<!-- BEGIN:nextjs-agent-rules -->
# Next.js & AI Agent Guidelines for CV Cakrawala Buana Lestari (CBL)

This file contains critical documentation, architectural patterns, and guidelines for AI agents working on this repository (`web-cakrawala-3`).

---

## 🏢 Corporate Brand & Design System

- **Company Name**: **CV Cakrawala Buana Lestari (CBL)** - Jasa Teknik Terpadu & Otomasi Fasilitas Industri.
- **Primary Brand Color**: **CBL Orange (`#F97316`)**
  - Used for: All primary WhatsApp buttons, CTA buttons, status indicator pulses, and corporate highlights.
- **Secondary Brand Colors**:
  - **CBL Navy (`#0F2942`)**: Main headings, dark containers, footer background.
  - **Engineering Blue (`#0E6BA8` / `#15426B`)**: Secondary links, outlines, badge backgrounds (`#F0F7FD`).
- **Official Logo**: `/logo/cbl-logo.png` & `/logo/cbl-logo.webp` (Transparent high-res orange circle CBL logo).

---

## 🎨 Human-Led Design Direction

Before changing visual layout, homepage sections, typography, animation, component styling, or responsive composition, read and follow `DESIGN_DIRECTION.md`.

The website must not look like a generic AI-generated SaaS template. Work section-by-section and use the actual CBL brand, project photography, and business content as the source of visual identity. Prefer editorial, industrial, and architectural composition over decorative UI patterns.

Do not add pills, floating cards, gradient blobs, glassmorphism, excessive rounded containers, repetitive icon cards, generic marketing statistics, or decorative motion unless the specific content genuinely requires them.

For visual redesign work, prioritize typography, spacing, image composition, asymmetry, project storytelling, restrained motion, and deliberately designed mobile layouts.

---

## 📞 Official Corporate Contact Details

Centralized in `src/data/company.ts`:
- **WhatsApp Fast Response**: `0851-8454-9522` / `+62 851-8454-9522` (URL: `https://wa.me/6285184549522`).
- **Office Telephone**: `(021) 2606-3396` (URL: `tel:02126063396`).
- **Office Address**: Jl. Papanggo II C No. 27, Papanggo, Tanjung Priok, Jakarta Utara, DKI Jakarta 14340.
- **Service Hours**: Senin–Jumat, pukul 07.00–15.00 WIB.

---

## 🛠️ Key Components & Implementation Patterns

1. **Header & Navigation (`src/components/layout/Header.tsx` & `MobileMenu.tsx`)**:
   - Uses **ScrollSpy** (`activeSection`) to dynamically highlight active nav tabs (`bg-[#F0F7FD] text-[#0E6BA8]`) as the user scrolls through homepage sections (`#layanan`, `#keahlian`, `#cara-kerja`, `#mengapa-cbl`, `#kontak`).
   - Uses `window.history.pushState` on hash clicks to prevent double-hash URL bugs.

2. **Hero Background (`src/components/sections/HeroSection.tsx`)**:
   - Menggunakan dokumentasi proyek lokal melalui `next/image`, bukan video stok autoplay.
   - Overlay menjaga kontras teks dan aset ditandai sebagai dekoratif.

3. **Running Marquee Logo Section (`src/components/sections/BrandSection.tsx`)**:
   - Renders 13 authentic industry brand logos (`public/logo/brands/`):
     - `Allen-Bradley`, `Schneider Electric`, `SEW Eurodrive`, `Rexnord`, `SKF`, `Timken`, `Fenner`, `Renold`, `Grundfos`, `Sta-Rite`, `in-Lite`, `Orphek`, `Philips`.
   - Uses two identical tracks for a seamless loop at 28 seconds on desktop and 22 seconds on mobile. The marquee remains continuous and slows to 72 seconds when the user enables reduced motion.

4. **Floating Action Controls**:
   - `FloatingWhatsapp.tsx`: Positioned at `fixed bottom-6 right-6 z-40` (`#F97316` orange).
   - `BackToTop.tsx`: Positioned at `fixed bottom-20 right-6 z-40` (Stacked vertically 80px above WhatsApp button to prevent overlap).

---

## 📋 Verification & Build Checklist for AI Agents

Before declaring any task complete or committing code:
1. **Typecheck**: `npx tsc --noEmit` must pass cleanly with 0 errors.
2. **Linting**: `npm run lint` must pass cleanly with 0 errors.
3. **Build**: `npm run build` must complete successfully.
4. **Git**: Commit with descriptive conventional commit messages (`feat`, `fix`, `perf`, `chore`, `style`).

<!-- END:nextjs-agent-rules -->
