'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { companyInfo } from '@/data/company';
import { GearmotorRenderSequence } from '@/components/visuals/GearmotorRenderSequence';

const storySteps = [
  {
    index: '00',
    label: 'Inside the drive system',
    title: 'Sistem teknis dipahami sampai ke komponennya.',
    body: 'Visualisasi ini menunjukkan prinsip kerja sebuah industrial gearmotor dari unit utuh sampai komponen transmisi di dalamnya. Bukan representasi produk atau model manufacturer tertentu.',
    technical: 'TECHNICAL VISUALIZATION / UNBRANDED',
  },
  {
    index: '01',
    label: 'Drive motor',
    title: 'Where rotational power begins.',
    body: 'Motor menghasilkan putaran awal yang diteruskan ke gearbox untuk dikurangi kecepatannya dan ditingkatkan torsinya sesuai kebutuhan equipment.',
    technical: 'INPUT POWER → ROTATIONAL MOTION',
  },
  {
    index: '02',
    label: 'Input shaft',
    title: 'Transfers power into the gearbox.',
    body: 'Input shaft menghubungkan motor dengan tahap reduksi pertama. Alignment dan kondisi bearing pada area ini berpengaruh langsung terhadap kestabilan sistem.',
    technical: 'MOTOR → INPUT SHAFT → REDUCTION',
  },
  {
    index: '03',
    label: 'Reduction gearing',
    title: 'Lower speed. Higher usable torque.',
    body: 'Susunan gear mengurangi kecepatan motor melalui beberapa tahap sekaligus meningkatkan torsi sebelum tenaga diteruskan menuju output.',
    technical: 'MULTI-STAGE REDUCTION',
  },
  {
    index: '04',
    label: 'Bevel gear set',
    title: 'Redirecting power through the drivetrain.',
    body: 'Bevel gear memungkinkan arah transmisi tenaga berubah di dalam gearbox sekaligus mempertahankan transfer torsi menuju tahap output.',
    technical: 'RIGHT-ANGLE POWER TRANSFER',
  },
  {
    index: '05',
    label: 'Bearing set',
    title: 'Supporting every rotating component.',
    body: 'Bearing mempertahankan alignment shaft dan mengurangi friction selama operasi. Wear, contamination, atau lubrication yang tidak sesuai dapat memicu vibration, noise, dan temperatur berlebih.',
    technical: 'ALIGNMENT / LOAD / LUBRICATION',
  },
  {
    index: '06',
    label: 'Oil seal',
    title: 'Keeping lubricant in. Contamination out.',
    body: 'Oil seal membantu mempertahankan lubricant di dalam gearbox sekaligus membatasi masuknya debu, air, dan kontaminan dari lingkungan kerja.',
    technical: 'SEALING / CONTAMINATION CONTROL',
  },
  {
    index: '07',
    label: 'Output shaft',
    title: 'Where torque reaches the machine.',
    body: 'Setelah melewati tahap reduksi, output shaft meneruskan torsi menuju conveyor, pump, agitator, atau equipment lain yang digerakkan.',
    technical: 'REDUCED SPEED / INCREASED TORQUE',
  },
  {
    index: '08',
    label: 'Housing',
    title: 'More than an enclosure.',
    body: 'Housing menjaga posisi gear, shaft, bearing, dan lubricant dalam satu struktur mekanis sekaligus melindungi komponen internal selama operasi.',
    technical: 'STRUCTURE / ALIGNMENT / PROTECTION',
  },
  {
    index: '09',
    label: 'Technical support',
    title: 'Components work as a system.',
    body: 'Reliability tidak bergantung pada satu komponen saja. Foto unit, spesifikasi awal, ukuran shaft, atau gejala di lapangan sudah cukup untuk memulai diskusi teknis dengan CBL.',
    technical: 'INSPECT → IDENTIFY → PLAN → EXECUTE',
    final: true,
  },
] as const;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const whatsappHref = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(
    'Halo CBL, saya ingin mendiskusikan kebutuhan spare part atau maintenance equipment kami.'
  )}`;

  useEffect(() => {
    let raf = 0;

    const updateProgress = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(clamp01(Math.max(0, -rect.top) / scrollable));
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
  const step = storySteps[currentStep];
  const phase = (progress * storySteps.length) % 1;
  const edgeFade = currentStep === storySteps.length - 1 ? 1 : Math.min(1, (1 - phase) / 0.12);

  return (
    <section
      ref={sectionRef}
      className="relative h-[700svh] w-full overflow-x-clip bg-[#F1EFE9] text-[#102A43]"
      aria-label="Visualisasi interaktif sistem gearmotor CBL"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden border-b border-[#102A43]/15">
        <Container className="h-full">
          <div className="grid h-full grid-rows-[auto_1fr] py-4 sm:py-5 lg:py-6">
            <div className="flex items-start justify-between border-t border-[#102A43]/25 pt-3 sm:pt-4">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.19em] text-[#8C3B16] sm:text-[0.66rem]">
                  CV Cakrawala Buana Lestari
                </p>
                <p className="mt-1.5 text-[0.64rem] leading-5 text-[#536474] sm:mt-2 sm:text-xs">
                  Engineering · construction · technical services
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-[#536474]">Interactive technical study</p>
                <p className="mt-1 text-xs text-[#102A43]">Scroll vertically ↓</p>
              </div>
            </div>

            <div className="grid min-h-0 grid-rows-[48%_52%] lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-8">
              <div className="order-2 relative flex min-h-0 items-end pb-8 pr-10 sm:pb-9 sm:pr-0 lg:order-1 lg:col-span-5 lg:items-center lg:pb-0">
                <div
                  key={step.index}
                  className="w-full max-w-[43rem] transition-[opacity,transform] duration-300 ease-out"
                  style={{ opacity: edgeFade, transform: `translate3d(0, ${edgeFade < 1 ? -8 : 0}px, 0)` }}
                >
                  <div className="mb-3 flex items-center gap-3 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16] sm:mb-5 sm:gap-4 sm:text-[0.62rem]">
                    <span>{step.index}</span>
                    <span className="h-px w-8 bg-[#8C3B16]/45 sm:w-9" />
                    <span>{step.label}</span>
                  </div>

                  <h1 className="max-w-[42rem] text-[clamp(2rem,8vw,4.2rem)] font-semibold leading-[0.94] tracking-[-0.048em] text-[#102A43] lg:text-[clamp(3rem,4.6vw,5.4rem)]">
                    {step.title}
                  </h1>

                  <p className="mt-3 max-w-xl text-[0.82rem] leading-5 text-[#536474] sm:mt-5 sm:text-base sm:leading-7">
                    {step.body}
                  </p>

                  <p className="mt-4 border-t border-[#102A43]/18 pt-2.5 text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#6A767F] sm:mt-5 sm:pt-3 sm:text-[0.64rem]">
                    {step.technical}
                  </p>

                  {'final' in step && step.final && (
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-6 sm:gap-x-7 sm:gap-y-4">
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 border-b border-[#8C3B16] pb-1 text-[0.78rem] font-semibold text-[#8C3B16] transition-colors hover:text-[#6F2E12] sm:gap-3 sm:text-sm"
                      >
                        Diskusikan kebutuhan teknis
                        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">↗</span>
                      </a>
                      <Link
                        href="/proyek"
                        className="group inline-flex items-center gap-2 border-b border-[#102A43]/40 pb-1 text-[0.78rem] font-semibold text-[#102A43] transition-colors hover:border-[#102A43] sm:gap-3 sm:text-sm"
                      >
                        Lihat pekerjaan kami
                        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-1 relative min-h-0 lg:order-2 lg:col-span-7">
                <div className="absolute inset-[-8%_-18%_-7%_-18%] sm:inset-[-9%_-15%_-8%_-15%] lg:inset-[-11%_-12%_-10%_-16%]">
                  <GearmotorRenderSequence progress={progress} activeStep={currentStep} />
                </div>
              </div>
            </div>
          </div>
        </Container>

        <div className="pointer-events-none absolute bottom-7 right-8 z-30 hidden items-end gap-3 md:flex">
          <div className="text-right text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-[#6A767F]">
            <p>{step.label}</p>
            <p className="mt-1 text-[#102A43]">{Math.round(progress * 100)}%</p>
          </div>
          <div className="relative h-24 w-px bg-[#102A43]/18">
            <div
              className="absolute left-0 top-0 w-px bg-[#8C3B16] transition-[height] duration-100"
              style={{ height: `${Math.max(3, progress * 100)}%` }}
            />
          </div>
          <div className="flex h-24 flex-col justify-between text-[0.5rem] font-semibold text-[#6A767F]">
            <span>00</span>
            <span className="text-[#8C3B16]">{step.index}</span>
            <span>09</span>
          </div>
        </div>
      </div>
    </section>
  );
}
