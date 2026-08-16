'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { companyInfo } from '@/data/company';
import { IndustrialGearbox3D } from '@/components/visuals/IndustrialGearbox3D';

const storySteps = [
  {
    index: '01',
    kicker: 'Mechanical system study',
    title: 'Sistem teknis yang dipahami sampai ke komponennya.',
    body: 'Scroll ke bawah untuk mengikuti cara CBL membaca sistem mekanikal: dari unit utuh, titik transmisi, shaft dan bearing, sampai area yang perlu diperiksa di lapangan.',
  },
  {
    index: '02',
    kicker: 'Transmission',
    title: 'Gerak, beban, dan alignment dibaca sebagai satu rangkaian.',
    body: 'Gearbox tidak berdiri sendiri. Hubungan motor, coupling, shaft, bearing, sprocket, chain, dan conveyor menentukan bagaimana sistem harus diperiksa dan ditangani.',
  },
  {
    index: '03',
    kicker: 'Inspection logic',
    title: 'Masalah dicari dari gejala ke sumbernya.',
    body: 'Pemeriksaan diarahkan ke kondisi aktual: suara, getaran, alignment, sambungan, keausan, kondisi komponen, dan kebutuhan penggantian atau penyetelan.',
  },
  {
    index: '04',
    kicker: 'Field execution',
    title: 'Model menjelaskan sistem. Dokumentasi membuktikan pekerjaan.',
    body: 'Setelah memahami sistem secara visual, halaman bergerak ke dokumentasi proyek nyata: pekerjaan mekanikal, panel kontrol, pompa, HVAC, dan layanan teknis lainnya.',
  },
];

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const whatsappHref = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(
    'Halo CBL, saya ingin mendiskusikan kebutuhan teknis fasilitas kami.'
  )}`;

  useEffect(() => {
    let raf = 0;

    const updateProgress = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const travelled = Math.max(0, -rect.top);
      setProgress(clamp01(travelled / scrollable));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const currentStep = Math.min(storySteps.length - 1, Math.floor(progress * storySteps.length));
  const localPhase = (progress * storySteps.length) % 1;
  const objectScale = 0.92 + Math.sin(progress * Math.PI) * 0.08;
  const objectShiftY = 2 - progress * 6;

  return (
    <section
      ref={sectionRef}
      className="relative h-[420svh] w-full max-w-full overflow-x-clip bg-[#F4F1EA] text-[#102A43]"
      aria-label="Pengantar teknis interaktif CBL"
    >
      <div className="sticky top-0 h-[100svh] w-full max-w-full overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(0, ${objectShiftY}vh, 0) scale(${objectScale})` }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 lg:left-[27%]">
            <IndustrialGearbox3D />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,241,234,0.98)_0%,rgba(244,241,234,0.92)_25%,rgba(244,241,234,0.36)_48%,rgba(244,241,234,0)_70%)] lg:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-[#F4F1EA] via-[#F4F1EA]/45 to-transparent lg:hidden" />

        <Container className="relative z-20 h-full">
          <div className="flex h-full flex-col justify-between py-6 sm:py-8 lg:py-10">
            <div className="flex items-start justify-between border-t border-[#102A43]/25 pt-4">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">
                  CV Cakrawala Buana Lestari
                </p>
                <p className="mt-2 text-xs leading-5 text-[#536474]">
                  Engineering · construction · technical services<br />Jakarta, Indonesia
                </p>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-[#536474]">Immersive system study</p>
                <p className="mt-1 text-xs text-[#102A43]">Scroll vertically ↓</p>
              </div>
            </div>

            <div className="relative max-w-[48rem] pb-20 sm:pb-24 lg:max-w-[39rem] lg:pb-12">
              {storySteps.map((step, index) => {
                const distance = Math.abs(index - currentStep);
                const isCurrent = index === currentStep;
                const leaving = isCurrent && localPhase > 0.78 && currentStep < storySteps.length - 1;
                const opacity = isCurrent ? (leaving ? 1 - (localPhase - 0.78) / 0.22 : 1) : distance === 1 ? 0 : 0;
                const translate = isCurrent ? (leaving ? -18 : 0) : 22;

                return (
                  <div
                    key={step.index}
                    className={`${index === 0 ? 'relative' : 'absolute inset-x-0 bottom-20 sm:bottom-24 lg:bottom-12'} transition-[opacity,transform] duration-300 ease-out`}
                    style={{ opacity, transform: `translate3d(0, ${translate}px, 0)` }}
                    aria-hidden={!isCurrent}
                  >
                    <div className="mb-4 flex items-center gap-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">
                      <span>{step.index}</span>
                      <span className="h-px w-10 bg-[#8C3B16]/45" />
                      <span>{step.kicker}</span>
                    </div>

                    <h1 className="max-w-[46rem] text-[clamp(2.8rem,6.2vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[#102A43] lg:text-[clamp(3.2rem,5.3vw,5.8rem)]">
                      {step.title}
                    </h1>

                    <p className="mt-6 max-w-xl text-sm leading-6 text-[#536474] sm:text-base sm:leading-7">
                      {step.body}
                    </p>

                    {index === 0 && (
                      <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-3 border-b border-[#8C3B16] pb-1 text-sm font-semibold text-[#8C3B16] transition-colors hover:text-[#6F2E12]"
                        >
                          Diskusikan proyek
                          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">↗</span>
                        </a>
                        <Link
                          href="/proyek"
                          className="group inline-flex items-center gap-3 border-b border-[#102A43]/45 pb-1 text-sm font-semibold text-[#102A43] transition-colors hover:border-[#102A43]"
                        >
                          Lihat pekerjaan
                          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-5 right-4 z-30 flex items-end gap-3 sm:right-6 lg:bottom-8 lg:right-8">
              <div className="hidden text-right text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#536474] md:block">
                <p>{storySteps[currentStep].kicker}</p>
                <p className="mt-1 text-[#102A43]">{Math.round(progress * 100)}%</p>
              </div>
              <div className="relative h-28 w-px bg-[#102A43]/20">
                <div
                  className="absolute left-0 top-0 w-px bg-[#8C3B16] transition-[height] duration-100"
                  style={{ height: `${Math.max(4, progress * 100)}%` }}
                />
              </div>
              <div className="flex h-28 flex-col justify-between text-[0.58rem] font-semibold text-[#536474]">
                {storySteps.map((step, index) => (
                  <span key={step.index} className={index === currentStep ? 'text-[#8C3B16]' : ''}>{step.index}</span>
                ))}
              </div>
            </div>
          </div>
        </Container>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-[#102A43]/15" />
      </div>
    </section>
  );
}
