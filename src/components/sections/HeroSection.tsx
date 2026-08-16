import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { companyInfo } from '@/data/company';
import { IndustrialGearbox3D } from '@/components/visuals/IndustrialGearbox3D';

export function HeroSection() {
  const whatsappHref = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(
    'Halo CBL, saya ingin mendiskusikan kebutuhan teknis fasilitas kami.'
  )}`;

  return (
    <section className="border-b border-[#D9E1E8] bg-[#F4F1EA] text-[#102A43]">
      <Container className="pt-12 sm:pt-16 lg:pt-20">
        <div className="border-t border-[#102A43]/20 pt-5">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6 xl:col-span-7">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.19em] text-[#8C3B16]">
                CV Cakrawala Buana Lestari
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#536474]">
                Engineering, construction &amp; technical services<br />
                Jakarta, Indonesia
              </p>

              <h1 className="mt-10 max-w-[48rem] text-[clamp(3.3rem,6.4vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-[#102A43]">
                Sistem teknis yang dipahami sampai ke komponennya.
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-[#536474] sm:text-lg sm:leading-8">
                CBL menangani kelistrikan, otomasi, mekanikal, HVAC, pompa, dan pencahayaan melalui pemeriksaan, pelaksanaan, pengujian, serta dokumentasi pekerjaan di lapangan.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
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
            </div>

            <div className="lg:col-span-6 xl:col-span-5 lg:-mt-5">
              <div className="border-b border-[#102A43]/20 pb-3 text-[0.66rem] font-semibold uppercase tracking-[0.17em] text-[#536474]">
                01 / Mechanical system study
              </div>
              <IndustrialGearbox3D />
            </div>
          </div>
        </div>
      </Container>

      <div className="mt-10 border-t border-[#D9E1E8] sm:mt-14 lg:mt-16">
        <Container className="py-5">
          <div className="grid grid-cols-1 gap-4 text-xs leading-5 text-[#536474] sm:grid-cols-3 sm:gap-8">
            <p><span className="font-semibold text-[#102A43]">Mechanical</span><br />Gearbox · shaft · bearing · conveyor</p>
            <p><span className="font-semibold text-[#102A43]">Control</span><br />Panel · PLC/HMI · drive · soft starter</p>
            <p><span className="font-semibold text-[#102A43]">Utilities</span><br />Pump · HVAC · water system · lighting</p>
          </div>
        </Container>
      </div>

      <div className="relative h-[46vh] min-h-[360px] w-full overflow-hidden sm:h-[58vh] lg:h-[68vh] lg:min-h-[560px]">
        <Image
          src="/images/hero-conveyor-maintenance.jpg"
          alt="Dokumentasi pekerjaan teknis CBL pada sistem conveyor"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-[1200ms] ease-out motion-safe:hover:scale-[1.015]"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-4 pb-5 pt-28 sm:px-6 lg:px-8 lg:pb-7">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 border-t border-white/50 pt-4 text-white sm:flex-row sm:items-end sm:justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.16em]">Dokumentasi proyek CBL</p>
            <p className="max-w-md text-xs leading-5 text-white/80 sm:text-right">
              Model 3D menjelaskan sistem. Dokumentasi lapangan menunjukkan pekerjaan yang benar-benar ditangani.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
