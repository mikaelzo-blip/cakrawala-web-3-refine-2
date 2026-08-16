import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExperienceSummarySection } from '@/components/sections/ExperienceSummarySection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { SystemsFocusSection } from '@/components/sections/SystemsFocusSection';
import { ExpertiseSection } from '@/components/sections/ExpertiseSection';
import { WorkProcessSection } from '@/components/sections/WorkProcessSection';
import { BrandSection } from '@/components/sections/BrandSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { WhyUsSection } from '@/components/sections/WhyUsSection';
import { ClosingCtaSection } from '@/components/sections/ClosingCtaSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { VendorReadinessSection } from '@/components/sections/VendorReadinessSection';
import { companyInfo } from '@/data/company';

export const metadata: Metadata = {
  alternates: {
    canonical: companyInfo.seo.siteUrl,
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExperienceSummarySection />
      <ServicesSection />
      <SystemsFocusSection />
      <PortfolioSection />
      <WhyUsSection />
      <WorkProcessSection />
      <ExpertiseSection />
      <BrandSection />
      <VendorReadinessSection />
      <ClosingCtaSection />
      <ContactSection />
    </>
  );
}
