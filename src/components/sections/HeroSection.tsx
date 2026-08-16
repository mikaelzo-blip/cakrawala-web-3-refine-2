import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { companyInfo } from '@/data/company';

export function HeroSection() {
  const whatsappHref = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(
    'Halo CBL, saya ingin mendiskusikan kebutuhan teknis fasilitas kami.'
  )}`;

  return (
    <section className="border-b border-[#0F2942]/15 bg-[#F4F1EA] text-[#0F2942]">
      <Container className="py-5 sm:py-6 lg:py-8">
        <div className="border-t border-[#0F2942]/30 pt-4 sm:pt-5">
          <div className="grid gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#5F6D78] sm:grid-cols-2 sm:text-[0.68rem] lg:grid-cols-12">
            <p className="text-[#B34718] sm:col-span-1 lg:col-span-5">CV Cakrawala Buana Lestari</p>
            <p className="sm:text-right lg:col-span-4 lg:text-left">Engineering · Construction · Technical Services</p>
            <p className="hidden lg:col-span-3 lg:block lg:text-right">Jakarta Utara · Indonesia</p>
          </div>

          <div className="grid gap-8 pb-10 pt-14 sm:pb-12 sm:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-16 lg:pt-24">
            <div className="hero-enter lg:col-span-8">
              <h1 className="max-w-[18ch] text-[clamp(3.15rem,10.8vw,6.9rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-[#0F2942] lg:max-w-[15ch] lg:text-[clamp(5rem,7.2vw,8.4rem)]">
                Pekerjaan teknis fasilitas, dari pemeriksaan awal sampai serah terima.
              </h1>
            </div>

            <div className="hero-enter hero-enter-delayed flex flex-col justify-end lg:col-span-4 lg:pb-2">
              <p className="max-w-xl text-sm leading-6 text-[#536474] sm:text-base sm:leading-7 lg:max-w-sm">
                CBL menangani pekerjaan kelistrikan, otomasi, mekanikal, HVAC, sistem pompa, dan pencahayaan dengan pendekatan yang disesuaikan terhadap kondisi proyek di lapangan.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 border-b border-[#B34718] pb-1 text-[#B34718] transition-colors duration-200 hover:text-[#8F3413]"
                >
                  Diskusikan kebutuhan
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">↗</span>
                </a>
                <Link
                  href="/proyek"
                  className="group inline-flex items-center gap-2 border-b border-[#0F2942]/40 pb-1 text-[#0F2942] transition-colors duration-200 hover:border-[#0F2942]"
                >
                  Lihat pekerjaan
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <figure className="hero-enter hero-enter-delayed">
          <div className="relative min-h-[420px] overflow-hidden bg-[#D8D6D0] sm:min-h-[520px] lg:min-h-[640px]">
            <Image
              src="/images/hero-conveyor-maintenance.jpg"
              alt="Dokumentasi pekerjaan teknis CBL pada sistem conveyor"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.015]"
            />
          </div>

          <figcaption className="grid gap-3 border-b border-[#0F2942]/20 py-4 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#6B7780] sm:grid-cols-2 sm:text-[0.66rem] lg:grid-cols-12">
            <span className="text-[#0F2942] lg:col-span-5">Dokumentasi proyek CBL</span>
            <span className="lg:col-span-4">Electrical / Automation / Mechanical / HVAC</span>
            <span className="sm:text-right lg:col-span-3">Project evidence, not stock imagery</span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
