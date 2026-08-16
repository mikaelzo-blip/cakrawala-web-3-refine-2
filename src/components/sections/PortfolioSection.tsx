import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { projects } from '@/data/projects';
import { portfolioConfidentialityNotice } from '@/data/company';

export function PortfolioSection() {
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 4);
  const [leadProject, ...supportingProjects] = featuredProjects;

  if (!leadProject) return null;

  return (
    <section id="proyek" className="border-b border-[#D9E1E8] bg-[#F4F1EA] py-20 text-[#102A43] md:py-28 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-t border-[#102A43]/25 pt-5 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">Selected work</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-6 text-[#657482]">
              Pekerjaan terpilih dari arsip proyek CBL.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-4xl text-[clamp(2.5rem,5vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              Bukti pekerjaan lebih penting daripada klaim pemasaran.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#657482] sm:text-lg sm:leading-8">
              Setiap studi kasus merangkum kebutuhan, cakupan, tahapan pelaksanaan, dan hasil berdasarkan dokumentasi pekerjaan yang tersedia.
            </p>
          </div>
        </div>

        <article className="mt-14 border-t border-[#102A43]/25 pt-6 md:mt-20 md:pt-8">
          <div className="mb-5 flex items-end justify-between gap-6">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">01 / Featured project</p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#657482]">
                {leadProject.categoryLabel} · {leadProject.sector}
              </p>
            </div>
            <Link
              href={`/proyek/${leadProject.slug}`}
              className="hidden border-b border-[#102A43]/40 pb-1 text-sm font-semibold transition-colors hover:border-[#102A43] md:inline-flex"
            >
              Buka studi kasus →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-8">
            <Link
              href={`/proyek/${leadProject.slug}`}
              className="group relative block aspect-[16/10] overflow-hidden bg-[#D9E1E8] lg:col-span-8"
              aria-label={`Buka studi kasus ${leadProject.title}`}
            >
              <Image
                src={leadProject.images?.cover ?? leadProject.image}
                alt={leadProject.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
              />
            </Link>

            <div className="flex flex-col lg:col-span-4 lg:pl-4">
              <h3 className="text-3xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-[2.7rem]">
                <Link href={`/proyek/${leadProject.slug}`} className="transition-colors hover:text-[#8C3B16]">
                  {leadProject.title}
                </Link>
              </h3>
              <p className="mt-5 text-sm leading-7 text-[#657482] sm:text-base">{leadProject.summary}</p>

              <div className="mt-8 border-t border-[#102A43]/20 pt-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#657482]">Cakupan utama</p>
                <p className="mt-3 text-sm leading-6 text-[#102A43]">{leadProject.scope.slice(0, 3).join(' · ')}</p>
              </div>

              <Link
                href={`/proyek/${leadProject.slug}`}
                className="mt-8 inline-flex w-fit border-b border-[#8C3B16] pb-1 text-sm font-semibold text-[#8C3B16] transition-colors hover:text-[#6F2E12] md:hidden"
              >
                Buka studi kasus →
              </Link>
            </div>
          </div>
        </article>

        <div className="mt-16 md:mt-24">
          {supportingProjects.map((project, index) => {
            const projectNumber = String(index + 2).padStart(2, '0');

            return (
              <article
                key={project.slug}
                className="grid grid-cols-1 gap-6 border-t border-[#102A43]/25 py-8 md:grid-cols-12 md:gap-8 md:py-10"
              >
                <div className="md:col-span-2">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8C3B16]">{projectNumber}</p>
                  <p className="mt-2 text-xs leading-5 text-[#657482]">{project.categoryLabel}</p>
                </div>

                <Link
                  href={`/proyek/${project.slug}`}
                  className="group relative block aspect-[16/10] overflow-hidden bg-[#D9E1E8] md:col-span-4"
                  aria-label={`Buka studi kasus ${project.title}`}
                >
                  <Image
                    src={project.images?.cover ?? project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 34vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
                  />
                </Link>

                <div className="md:col-span-5 md:col-start-8">
                  <p className="text-xs uppercase tracking-[0.12em] text-[#657482]">{project.sector}</p>
                  <h3 className="mt-3 max-w-xl text-2xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-3xl">
                    <Link href={`/proyek/${project.slug}`} className="transition-colors hover:text-[#8C3B16]">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-[#657482]">{project.summary}</p>
                  <Link
                    href={`/proyek/${project.slug}`}
                    className="mt-5 inline-flex border-b border-[#102A43]/40 pb-1 text-sm font-semibold transition-colors hover:border-[#102A43]"
                  >
                    Lihat pekerjaan →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 border-t border-[#102A43]/25 pt-6 md:grid-cols-12 md:items-start">
          <p className="max-w-3xl text-xs leading-6 text-[#657482] md:col-span-8">
            <span className="font-semibold text-[#102A43]">Catatan kerahasiaan — </span>
            {portfolioConfidentialityNotice}
          </p>

          <div className="md:col-span-4 md:text-right">
            <Link
              href="/proyek"
              className="inline-flex border-b border-[#8C3B16] pb-1 text-sm font-semibold text-[#8C3B16] transition-colors hover:text-[#6F2E12]"
            >
              Jelajahi seluruh {projects.length} studi kasus →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
