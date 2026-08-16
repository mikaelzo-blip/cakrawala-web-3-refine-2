import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { companyInfo } from '@/data/company';

export function HeroSection() {
  const whatsappHref = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(
    'Halo CBL, saya ingin mendiskusikan kebutuhan teknis fasilitas kami.'
  )}`;

  return (
    <section className="border-b border-[#D9E1E8] bg-[#F4F1EA] text-[#102A43]">
      <Container className="pt-16 sm:pt-20 lg:pt-24">
        <div className="grid grid-cols-1 gap-10 border-t border-[#102A43]/20 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="max-w-[16rem] text-[0.72rem] font-semibold uppercase leading-5 tracking-[0.18em] text-[#8C3B16]">
              CV Cakrawala Buana Lestari
            </p>
            <p className="mt-3 max-w-[15rem] text-sm leading-6 text-[#536474]">
              Engineering, construction & technical services
              <br />
              Jakarta, Indonesia
            </p>
          </div>

          <div className="lg:col-span-9">
            <h1 className="max-w-[68rem] text-[clamp(3.2rem,7.2vw,7.6rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[#102A43]">
              Pekerjaan teknis yang direncanakan dengan jelas dan diselesaikan di lapangan.
            </h1>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 pb-12 lg:mt-14 lg:grid-cols-12 lg:items-end lg:pb-16">
          <div className="lg:col-start-4 lg:col-span-5">
            <p className="max-w-xl text-base leading-7 text-[#536474] sm:text-lg sm:leading-8">
              CBL menangani kebutuhan kelistrikan, otomasi, mekanikal, HVAC, sistem pompa, dan pencahayaan melalui pekerjaan yang terdokumentasi dari pemeriksaan awal hingga serah terima.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 lg:col-span-4 lg:justify-end">
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
      </Container>

      <div className="relative h-[56vh] min-h-[430px] w-full overflow-hidden sm:h-[64vh] lg:h-[72vh] lg:min-h-[620px]">
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
              Sistem conveyor — dokumentasi pekerjaan digunakan sebagai bukti visual, bukan elemen dekoratif.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
