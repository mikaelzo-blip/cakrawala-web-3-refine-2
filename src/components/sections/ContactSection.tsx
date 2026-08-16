import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { companyInfo } from '@/data/company';
import { ContactForm } from '@/components/forms/ContactForm';

export function ContactSection() {
  return (
    <section id="kontak" className="border-b border-[#D9E1E8] bg-[#F4F1EA] py-20 text-[#102A43] md:py-28 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-t border-[#102A43]/20 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">Contact</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-[#657482]">
              Jakarta Utara · Indonesia
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-4xl text-[clamp(2.5rem,5vw,5.2rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
              Ceritakan kondisi fasilitas dan kebutuhan teknis Anda.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#657482] sm:text-lg sm:leading-8">
              Informasi awal mengenai peralatan, lokasi, dan target pekerjaan membantu pembahasan sebelum peninjauan lapangan.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 border-t border-[#102A43]/20 pt-8 lg:mt-20 lg:grid-cols-12 lg:gap-10 lg:pt-10">
          <aside className="lg:col-span-4">
            <dl>
              <div className="border-b border-[#102A43]/15 pb-5">
                <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#657482]">Alamat kantor</dt>
                <dd className="mt-2 max-w-sm text-sm leading-6">{companyInfo.address}</dd>
              </div>

              <div className="border-b border-[#102A43]/15 py-5">
                <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#657482]">Telepon</dt>
                <dd className="mt-2">
                  <a href={`tel:${companyInfo.phoneRaw}`} className="border-b border-[#102A43]/35 pb-0.5 text-sm font-semibold hover:border-[#8C3B16] hover:text-[#8C3B16]">
                    {companyInfo.phone}
                  </a>
                </dd>
              </div>

              <div className="border-b border-[#102A43]/15 py-5">
                <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#657482]">WhatsApp</dt>
                <dd className="mt-2">
                  <a
                    href={`https://wa.me/${companyInfo.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-[#8C3B16] pb-0.5 text-sm font-semibold text-[#8C3B16]"
                  >
                    {companyInfo.whatsappFormatted} ↗
                  </a>
                </dd>
              </div>

              <div className="border-b border-[#102A43]/15 py-5">
                <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#657482]">Email</dt>
                <dd className="mt-2 break-words text-sm">
                  <a href={`mailto:${companyInfo.email}`} className="border-b border-[#102A43]/35 pb-0.5 font-semibold hover:border-[#8C3B16] hover:text-[#8C3B16]">
                    {companyInfo.email}
                  </a>
                </dd>
              </div>

              <div className="border-b border-[#102A43]/15 py-5">
                <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#657482]">Jam layanan</dt>
                <dd className="mt-2 text-sm leading-6">{companyInfo.serviceHours}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col items-start gap-4 text-sm font-semibold">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(companyInfo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-[#102A43]/35 pb-1 transition-colors hover:border-[#8C3B16] hover:text-[#8C3B16]"
              >
                Lihat lokasi di Google Maps ↗
              </a>
              <Link
                href="/legalitas"
                className="border-b border-[#102A43]/35 pb-1 transition-colors hover:border-[#8C3B16] hover:text-[#8C3B16]"
              >
                Legalitas & registrasi vendor →
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
