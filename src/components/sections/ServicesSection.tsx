import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { serviceDivisions } from '@/data/company';

export function ServicesSection() {
  return (
    <section id="layanan" className="border-b border-[#D9E1E8] bg-white py-20 text-[#102A43] md:py-28 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-t border-[#102A43]/20 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">Capabilities</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-[#657482]">
              Disiplin teknis yang dikoordinasikan berdasarkan kebutuhan dan kondisi lapangan.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-4xl text-[clamp(2.5rem,5vw,5.2rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
              Satu koordinasi untuk pekerjaan teknis lintas sistem.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#657482] sm:text-lg sm:leading-8">
              Cakupan ditentukan setelah survei, pemeriksaan kondisi peralatan, prioritas operasional, dan batas pekerjaan disepakati.
            </p>
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          {serviceDivisions.map((service, index) => (
            <article
              key={service.id}
              className="group grid grid-cols-1 gap-4 border-t border-[#102A43]/20 py-7 transition-colors hover:bg-[#F8F6F0] md:grid-cols-12 md:gap-8 md:py-9"
            >
              <div className="md:col-span-1">
                <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-[#8C3B16]">
                  {String(index + 1).padStart(2, '0')}
                </p>
              </div>

              <div className="md:col-span-4">
                <h3 className="max-w-sm text-2xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-3xl">
                  <Link
                    href={`/layanan/${service.slug}`}
                    className="transition-colors group-hover:text-[#8C3B16]"
                  >
                    {service.title}
                  </Link>
                </h3>
              </div>

              <div className="md:col-span-4">
                <p className="max-w-xl text-sm leading-7 text-[#657482] sm:text-[0.95rem]">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-col items-start md:col-span-3 md:items-end md:text-right">
                <p className="max-w-[15rem] text-xs leading-5 text-[#657482]">
                  {service.capabilities.slice(0, 2).join(' · ')}
                </p>
                <Link
                  href={`/layanan/${service.slug}`}
                  className="mt-4 inline-flex border-b border-[#102A43]/40 pb-1 text-sm font-semibold transition-colors group-hover:border-[#8C3B16] group-hover:text-[#8C3B16]"
                >
                  Detail layanan →
                </Link>
              </div>
            </article>
          ))}
          <div className="border-t border-[#102A43]/20" />
        </div>
      </Container>
    </section>
  );
}
