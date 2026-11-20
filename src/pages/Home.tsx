import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { TestimonialsSection } from '../components/common/TestimonialsSection.tsx';
import { AgencyIntro } from '../components/home/AgencyIntro.tsx';
import { BecomeModelCta } from '../components/home/BecomeModelCta.tsx';
import { CampaignGallery } from '../components/home/CampaignGallery.tsx';
import { ClientsShowcase } from '../components/home/ClientsShowcase.tsx';
import { EditorialDispatches } from '../components/home/EditorialDispatches.tsx';
import { FeaturedModels } from '../components/home/FeaturedModels.tsx';
import { Hero } from '../components/home/Hero.tsx';
import { JournalSpotlight } from '../components/home/JournalSpotlight.tsx';
import { ModelCategories } from '../components/home/ModelCategories.tsx';
import { UpcomingEventsShowcase } from '../components/home/UpcomingEventsShowcase.tsx';

export default function Home() {
  return (
    <PageTransition>
      <SeoHead
        title="House of Fashion Nepal — Modeling & Talent Agency"
        description="Discover exceptional fashion, editorial, runway, and commercial modeling talent from across Nepal — bridging Nepal’s creative ateliers with international fashion houses."
      />
      <Hero />
      <FeaturedModels />
      <AgencyIntro />
      <ModelCategories />
      <ClientsShowcase />
      <CampaignGallery />
      <UpcomingEventsShowcase />
      <JournalSpotlight />
      <EditorialDispatches />
      <TestimonialsSection featuredOnly tone="paper" limit={6} />
      <BecomeModelCta />
    </PageTransition>
  );
}
