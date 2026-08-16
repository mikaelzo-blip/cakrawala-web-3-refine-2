import { Container } from '@/components/ui/Container';
import { whyUsPoints } from '@/data/company';

export function WhyUsSection() {
  return (
    <section id="mengapa-cbl" className="border-b border-white/10 bg-[#102A43] py-20 text-white md:py-28 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-t border-white/25 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#F29A67]">Working principles</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-white/60">
              Cara CBL menjaga pekerjaan tetap jelas dari kebutuhan awal sampai dokumentasi akhir.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-4xl text-[clamp(2.5rem,5vw,5.2rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
              Koordinasi teknis yang jelas lebih bernilai daripada janji yang berlebihan.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Kejelasan kebutuhan, kesesuaian spesifikasi, koordinasi lapangan, dan dokumentasi menjadi dasar setiap pekerjaan.
            </p>
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          {whyUsPoints.map((point, index) => (
            <article
              key={point.id}
              className="grid grid-cols-1 gap-4 border-t border-white/20 py-7 md:grid-cols-12 md:gap-8 md:py-9"
            >
              <div className="md:col-span-1">
                <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-[#F29A67]">
                  {String(index + 1).padStart(2, '0')}
                </p>
              </div>
              <div className="md:col-span-4">
                <h3 className="max-w-sm text-2xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-3xl">
                  {point.title}
                </h3>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">{point.description}</p>
              </div>
            </article>
          ))}
          <div className="border-t border-white/20" />
        </div>
      </Container>
    </section>
  );
}
