import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const systems = [
  {
    index: '01',
    discipline: 'Mechanical transmission',
    title: 'Gearbox & drivetrain',
    description:
      'Pengadaan dan penanganan komponen transmisi dilakukan dengan memperhatikan tipe, spesifikasi, kesesuaian pemasangan, dan kebutuhan sistem yang dilayani.',
    image: '/images/projects/pengadaan-gearbox-industri/01.webp',
    alt: 'Dokumentasi gearbox industri dalam pekerjaan CBL',
    href: '/layanan/mekanikal-presisi',
  },
  {
    index: '02',
    discipline: 'Electrical & control',
    title: 'Panel distribution & control',
    description:
      'Panel, proteksi, pengawatan, dan perangkat kendali diperiksa sebagai satu sistem agar perubahan komponen tetap sesuai dengan kebutuhan operasional.',
    image: '/images/projects/panel-kontrol-mccb-distribusi/panel-distribusi-utama-01.webp',
    alt: 'Dokumentasi panel distribusi dan kontrol dalam pekerjaan CBL',
    href: '/layanan/kelistrikan-panel',
  },
  {
    index: '03',
    discipline: 'Water systems',
    title: 'Pump & pressure systems',
    description:
      'Pemilihan pompa dan komponen pendukung disesuaikan dengan fungsi sistem, kebutuhan aliran, tekanan, serta kondisi instalasi yang tersedia.',
    image: '/images/projects/pengadaan-pompa-booster-air/01.webp',
    alt: 'Dokumentasi pompa booster air dalam pekerjaan CBL',
    href: '/layanan/pompa-perairan',
  },
];

export function SystemsFocusSection() {
  return (
    <section className="border-b border-white/10 bg-[#111820] py-20 text-white md:py-28 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-t border-white/20 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#F29A67]">Systems in focus</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-white/55">
              Detail peralatan dan sistem ditampilkan dari dokumentasi pekerjaan, bukan visual stok generik.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-4xl text-[clamp(2.5rem,5vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              Mesin, kontrol, dan sistem yang benar-benar menjadi bagian dari pekerjaan kami.
            </h2>
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          {systems.map((system, index) => {
            const imageFirst = index % 2 === 0;

            return (
              <article key={system.title} className="border-t border-white/20 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-center lg:gap-10">
                  <Link
                    href={system.href}
                    className={`group relative block aspect-[16/10] overflow-hidden bg-white/5 lg:col-span-7 ${
                      imageFirst ? 'lg:order-1' : 'lg:order-2 lg:col-start-6'
                    }`}
                    aria-label={`Pelajari ${system.title}`}
                  >
                    <Image
                      src={system.image}
                      alt={system.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
                    />
                  </Link>

                  <div
                    className={`lg:col-span-4 ${
                      imageFirst ? 'lg:order-2 lg:col-start-9' : 'lg:order-1 lg:col-start-1'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-6 border-b border-white/20 pb-4">
                      <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-[#F29A67]">{system.index}</span>
                      <span className="text-[0.66rem] uppercase tracking-[0.14em] text-white/45">{system.discipline}</span>
                    </div>
                    <h3 className="mt-6 text-3xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-4xl">
                      {system.title}
                    </h3>
                    <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">{system.description}</p>
                    <Link
                      href={system.href}
                      className="mt-7 inline-flex border-b border-[#F29A67] pb-1 text-sm font-semibold text-[#F29A67] transition-colors hover:text-white"
                    >
                      Lihat kompetensi terkait →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
