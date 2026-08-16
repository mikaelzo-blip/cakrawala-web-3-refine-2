import { Container } from '@/components/ui/Container';
import { expertiseItems } from '@/data/company';

export function ExpertiseSection() {
  return (
    <section id="keahlian" className="border-b border-[#D9E1E8] bg-[#F4F1EA] py-20 text-[#102A43] md:py-28 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-t border-[#102A43]/20 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">Technical experience</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-[#657482]">
              Kompetensi yang tercatat melalui pekerjaan dan kebutuhan nyata di lapangan.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-4xl text-[clamp(2.5rem,5vw,5.2rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
              Keahlian dibangun dari sistem yang benar-benar kami tangani.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#657482] sm:text-lg sm:leading-8">
              Metode kerja, alat, dan kebutuhan personel tetap ditentukan berdasarkan karakter setiap pekerjaan dan hasil pemeriksaan lapangan.
            </p>
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          {expertiseItems.map((item, index) => (
            <article
              key={item.id}
              className="grid grid-cols-1 gap-4 border-t border-[#102A43]/20 py-7 md:grid-cols-12 md:gap-8 md:py-9"
            >
              <div className="md:col-span-1">
                <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-[#8C3B16]">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="max-w-sm text-2xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-3xl">
                  {item.title}
                </h3>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <p className="max-w-2xl text-sm leading-7 text-[#657482] sm:text-base">{item.description}</p>
              </div>
            </article>
          ))}
          <div className="border-t border-[#102A43]/20" />
        </div>
      </Container>
    </section>
  );
}
