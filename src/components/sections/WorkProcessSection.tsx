import { Container } from '@/components/ui/Container';
import { workProcessSteps } from '@/data/company';

export function WorkProcessSection() {
  return (
    <section id="cara-kerja" className="border-b border-[#D9E1E8] bg-white py-20 text-[#102A43] md:py-28 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-t border-[#102A43]/20 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">Method</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-[#657482]">
              Tahapan disesuaikan dengan kondisi fasilitas, risiko, dan batas pekerjaan di lokasi proyek.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-4xl text-[clamp(2.5rem,5vw,5.2rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
              Dari pemeriksaan awal sampai serah terima, setiap tahap punya tujuan yang jelas.
            </h2>
          </div>
        </div>

        <ol className="mt-14 grid grid-cols-1 border-t border-[#102A43]/20 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {workProcessSteps.map((step, index) => (
            <li
              key={step.stepNumber}
              className="relative border-b border-[#102A43]/20 py-7 md:min-h-[25rem] md:px-6 md:py-8 md:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:px-7 lg:[&:nth-child(odd)]:border-r lg:last:border-r-0"
            >
              <div className="flex items-start justify-between gap-5">
                <span className="text-[0.68rem] font-semibold tracking-[0.18em] text-[#8C3B16]">
                  {String(step.stepNumber).padStart(2, '0')}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[#8A959F]">Step {index + 1}</span>
              </div>

              <h3 className="mt-12 max-w-xs text-2xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-3xl">
                {step.title}
              </h3>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#657482]">{step.description}</p>

              {step.details.length > 0 && (
                <p className="mt-8 border-t border-[#102A43]/15 pt-4 text-xs leading-6 text-[#657482]">
                  {step.details.slice(0, 2).join(' · ')}
                </p>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
