import { Container } from '@/components/ui/Container';
import { companyInfo } from '@/data/company';

export function ClosingCtaSection() {
  const whatsappHref = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(
    'Halo CBL, saya ingin konsultasi teknis kebutuhan fasilitas operasional kami.'
  )}`;

  return (
    <section className="border-b border-white/10 bg-[#102A43] py-20 text-white md:py-28 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-8 border-t border-white/25 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#F29A67]">Start a conversation</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-white/60">
              Mulai dari kondisi fasilitas dan target pekerjaan yang perlu dicapai.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-5xl text-[clamp(2.8rem,6vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
              Ceritakan masalahnya. Kita mulai dari apa yang benar-benar ada di lapangan.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Sampaikan kondisi awal, lokasi, dan target pekerjaan. CBL akan membantu memperjelas kebutuhan sebelum menentukan tindak lanjut yang relevan.
            </p>

            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 border-b border-[#F29A67] pb-1 text-sm font-semibold text-[#F29A67] transition-colors hover:text-white"
              >
                Konsultasi melalui WhatsApp
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
              <a
                href={`tel:${companyInfo.phoneRaw}`}
                className="inline-flex border-b border-white/40 pb-1 text-sm font-semibold text-white transition-colors hover:border-white"
              >
                Hubungi {companyInfo.phone} →
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
