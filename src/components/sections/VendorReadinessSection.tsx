import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { legalDocuments } from '@/data/legal';

export function VendorReadinessSection() {
  return (
    <section className="border-b border-[#D9E1E8] bg-[#F4F1EA] py-20 text-[#102A43] md:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-t border-[#102A43]/20 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">Vendor readiness</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-[#657482]">
              Informasi administratif untuk mendukung proses pengadaan dan registrasi resmi.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-4xl text-[clamp(2.3rem,4.5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
              Dokumen legal disampaikan sesuai kebutuhan proses vendor.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#657482] sm:text-base">
              Informasi perusahaan ditampilkan secara ringkas. Salinan yang memuat data sensitif hanya disampaikan melalui permintaan resmi.
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-[#102A43]/20 md:mt-18">
          {legalDocuments.map((document, index) => (
            <div
              key={document.id}
              className="grid grid-cols-1 gap-3 border-b border-[#102A43]/20 py-6 md:grid-cols-12 md:items-center md:gap-8 md:py-7"
            >
              <div className="md:col-span-1">
                <span className="text-[0.66rem] font-semibold tracking-[0.16em] text-[#8C3B16]">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="md:col-span-3">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#657482]">{document.category}</p>
              </div>
              <div className="md:col-span-6">
                <h3 className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">{document.title}</h3>
              </div>
              <div className="md:col-span-2 md:text-right">
                <span className="text-xs text-[#657482]">Tersedia sesuai kebutuhan</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex justify-end">
          <Link
            href="/legalitas"
            className="inline-flex border-b border-[#8C3B16] pb-1 text-sm font-semibold text-[#8C3B16] transition-colors hover:text-[#6F2E12]"
          >
            Informasi legalitas lengkap →
          </Link>
        </div>
      </Container>
    </section>
  );
}
