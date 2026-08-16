import { Container } from '@/components/ui/Container';
import { projects } from '@/data/projects';
import { serviceDivisions } from '@/data/company';

const summaryItems = [
  { value: '2022–2026', label: 'Periode pekerjaan terdokumentasi' },
  { value: `${projects.length}`, label: 'Studi kasus yang dipublikasikan' },
  { value: `${serviceDivisions.length}`, label: 'Bidang layanan teknis' },
  { value: 'Berbasis proyek', label: 'Tenaga profesional sesuai kebutuhan' },
];

export function ExperienceSummarySection() {
  return (
    <section aria-label="Ringkasan pengalaman CBL" className="border-b border-[#D9E1E8] bg-white text-[#102A43]">
      <Container>
        <div className="grid grid-cols-1 border-x border-[#D9E1E8] sm:grid-cols-2 lg:grid-cols-4">
          {summaryItems.map((item, index) => (
            <div
              key={item.label}
              className="min-h-[10rem] border-b border-[#D9E1E8] p-5 sm:min-h-[11rem] sm:p-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:p-7 lg:[&:nth-child(odd)]:border-r lg:last:border-r-0"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-[0.65rem] font-semibold tracking-[0.16em] text-[#8C3B16]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="h-px w-8 bg-[#8C3B16]/45" aria-hidden="true" />
              </div>
              <p className="mt-7 text-2xl font-semibold tracking-[-0.035em] sm:text-[1.65rem]">{item.value}</p>
              <p className="mt-2 max-w-[15rem] text-xs leading-5 text-[#657482] sm:text-sm sm:leading-6">{item.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
