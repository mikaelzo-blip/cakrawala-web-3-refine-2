import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { brandItems, brandDisclaimer } from '@/data/company';

export function BrandSection() {
  return (
    <section className="border-b border-[#D9E1E8] bg-white py-20 text-[#102A43] md:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-t border-[#102A43]/20 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">Technical ecosystem</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-[#657482]">
              Komponen dan merek yang pernah muncul dalam kebutuhan pekerjaan CBL.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-4xl text-[clamp(2.3rem,4.5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
              Pengalaman bekerja dengan beragam spesifikasi peralatan industri.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#657482] sm:text-base">
              Pencantuman merek menunjukkan pengalaman penanganan komponen dan tidak menyatakan hubungan distributor atau kemitraan resmi.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 border-l border-t border-[#D9E1E8] sm:grid-cols-3 md:mt-18 lg:grid-cols-4">
          {brandItems.map((brand) => (
            <div
              key={brand.id}
              className="flex min-h-[9rem] flex-col items-center justify-center border-b border-r border-[#D9E1E8] px-4 py-6 text-center sm:min-h-[10rem]"
            >
              <div className="flex h-14 w-full max-w-[10rem] items-center justify-center">
                {brand.logoPath ? (
                  <Image
                    src={brand.logoPath}
                    alt={brand.name}
                    width={brand.logoWidth || 160}
                    height={brand.logoHeight || 52}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-lg font-semibold tracking-[-0.02em]">{brand.logoText}</span>
                )}
              </div>
              <span className="mt-4 text-[0.68rem] leading-5 text-[#657482]">{brand.category}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-6 text-[#657482]">
          <span className="font-semibold text-[#102A43]">Keterangan merek dagang — </span>
          {brandDisclaimer}
        </p>
      </Container>
    </section>
  );
}
