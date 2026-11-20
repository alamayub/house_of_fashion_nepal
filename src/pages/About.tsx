import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MapPin, Mountain, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialImage } from '../components/common/EditorialImage.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import {
  AGENCY_MILESTONES,
  ETHICAL_CHARTER,
  PRODUCTION_LOCATIONS,
} from '../data/agencyContent.ts';
import { AGENCY_ASSETS } from '../data/assets.ts';
import { AGENCY_TEAM } from '../data/mockServices.ts';

const VALUES = [
  {
    index: '01',
    title: 'Bodily Autonomy & Consent',
    body: 'Talent retains full discretion over published measurements, usage boundaries, and working conditions on every set.',
  },
  {
    index: '02',
    title: 'Ethical Contracts',
    body: 'Transparent commissions, prompt artist payouts, and clear regional vs. international licensing terms.',
  },
  {
    index: '03',
    title: 'Craft Over Spectacle',
    body: 'We pair Nepal’s rich textile and artisanal heritage with disciplined contemporary art direction and editorial restraint.',
  },
  {
    index: '04',
    title: 'Long-Horizon Mentorship',
    body: 'Every new face receives movement coaching, camera testing, and international portfolio guidance.',
  },
];

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <PageTransition>
      <SeoHead
        title="About Us — Agency Story & Team"
        description="Learn about House of Fashion Nepal's story, vision, ethical representation standards, and nationwide fashion leadership across Nepal."
      />

      {/* Editorial Header */}
      <section className="pt-24 sm:pt-28 md:pt-36 pb-16 md:pb-24 bg-[#F5F1EA] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-6 sm:space-y-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#632B37]">
            About House of Fashion Nepal
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[0.98] max-w-4xl">
            Shaping Nepal’s Contemporary Fashion Identity.
          </h1>
          <p className="text-base sm:text-xl text-[#101010]/75 max-w-2xl leading-relaxed">
            Established in 2019, House of Fashion Nepal is an independent editorial fashion and commercial talent agency bridging Nepal’s creative ateliers with international fashion houses.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-[#FAF8F4] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6">
            <EditorialImage
              src={AGENCY_ASSETS.AGENCY_STUDIO}
              alt="House of Fashion Nepal daylight studio space"
              containerClassName="aspect-[4/3] lg:h-full w-full"
              className="w-full h-full object-cover"
              fallbackTitle="House of Fashion Nepal Studio"
            />
          </div>

          <div className="lg:col-span-6 space-y-6 lg:py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#632B37]">Our Story</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.04]">
              A Bridge Between Heritage Atelier &amp; Global Runway
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#101010]/75 leading-relaxed">
              <p>
                For decades, Nepal’s extraordinary craft — hand-loomed Dhaka textiles, high-altitude cashmere, and intricate Newari metalwork — reached international audiences without an equally structured talent ecosystem at home.
              </p>
              <p>
                House of Fashion Nepal was founded to change that narrative: building an agency grounded in editorial discernment, fair labor standards, and direct casting access for designers, photographers, and international production houses shooting in the Himalayas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 md:py-28 bg-[#101010] text-[#FAF8F4]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-4 pb-8 md:pb-0 border-b md:border-b-0 md:border-r border-white/10 md:pr-12">
            <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D]">Our Vision</p>
            <h2 className="font-serif text-3xl sm:text-4xl">
              To establish Nepal as a recognized creative capital for South Asian editorial talent.
            </h2>
            <p className="text-sm sm:text-base text-[#FAF8F4]/70 leading-relaxed">
              We envision a modeling industry where Nepalese faces are represented on equal footing across Milan, Paris, Tokyo, and Mumbai — celebrated for individuality rather than fleeting trends.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D]">Our Mission</p>
            <h2 className="font-serif text-3xl sm:text-4xl">
              Principled representation, creative mentorship, and seamless client production.
            </h2>
            <p className="text-sm sm:text-base text-[#FAF8F4]/70 leading-relaxed">
              We equip emerging models with international-standard portfolios while delivering responsive, reliable casting and on-ground shoot coordination for brands worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-28 bg-[#F5F1EA] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="pb-12 mb-12 border-b border-[#101010]/10">
            <p className="text-xs uppercase tracking-[0.22em] text-[#632B37] mb-3">
              Operating Ethos
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl">Our Values &amp; Why Work With Us</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((val, idx) => (
              <motion.div
                key={val.index}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="space-y-3 pt-6 border-t border-[#101010]/20"
              >
                <span className="font-mono text-xs text-[#632B37]">{val.index}</span>
                <h3 className="font-serif text-2xl text-[#101010]">{val.title}</h3>
                <p className="text-sm text-[#101010]/70 leading-relaxed">{val.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nepal Fashion Industry */}
      <section className="py-20 md:py-28 bg-[#FAF8F4] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#632B37]">
              Location &amp; Context
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.04]">
              The Nepal Fashion Landscape
            </h2>
            <p className="text-base text-[#101010]/75 leading-relaxed">
              From medieval brick courtyards in the Kathmandu Valley and misty alpine ridges in Pokhara and Mustang to the luminous plains of the Terai and eastern weaving hubs, Nepal offers an unmatched visual range for fashion campaigns.
            </p>
            <p className="text-sm sm:text-base text-[#101010]/65 leading-relaxed">
              Our team works alongside independent Nepalese designers, sustainable cashmere and Dhaka textile ateliers, cinematographers, and international editorial crews seeking authentic nationwide talent and seamless production fluency.
            </p>
            <div className="pt-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#101010] hover:text-[#632B37] transition-colors"
              >
                <span>Explore Agency Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <EditorialImage
              src={AGENCY_ASSETS.CAMPAIGN_MONOLITH}
              alt="Fashion campaign shot in Nepal"
              containerClassName="aspect-[4/3] w-full"
              className="w-full h-full object-cover"
              fallbackTitle="Nepal Editorial Campaign"
            />
          </div>
        </div>
      </section>

      {/* Agency Team */}
      <section className="py-20 md:py-28 bg-[#F5F1EA] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="pb-12 mb-12 border-b border-[#101010]/10">
            <p className="text-xs uppercase tracking-[0.22em] text-[#632B37] mb-3">
              Leadership
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl">Agency Directors</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {AGENCY_TEAM.map((member) => (
              <article key={member.id} className="space-y-4">
                <EditorialImage
                  src={member.image}
                  alt={member.name}
                  containerClassName="aspect-[3/4] w-full"
                  className="w-full h-full object-cover object-top"
                  fallbackTitle={member.name}
                />
                <div className="space-y-1.5 pt-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#632B37]">
                    {member.role}
                  </p>
                  <h3 className="font-serif text-3xl text-[#101010]">{member.name}</h3>
                  <p className="text-sm text-[#101010]/70 leading-relaxed">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Agency Chronicle Timeline */}
      <section className="py-20 md:py-28 bg-[#FAF8F4] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="pb-12 mb-12 border-b border-[#101010]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#632B37] mb-3">
                Chronicle · 2019–2026
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl">
                Seven Years of Agency Milestones
              </h2>
            </div>
            <p className="text-sm text-[#101010]/65 max-w-md">
              From an independent scouting desk in Patan to Nepal’s structured editorial and commercial talent board.
            </p>
          </div>

          <div className="divide-y divide-[#101010]/12 border-t border-b border-[#101010]/12">
            {AGENCY_MILESTONES.map((item) => (
              <div
                key={item.year}
                className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start"
              >
                <div className="md:col-span-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-serif text-4xl text-[#632B37] tabular-nums">
                    {item.year}
                  </span>
                  <span className="text-xs uppercase tracking-[0.14em] text-[#101010]/55">
                    {item.location}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-2xl text-[#101010]">{item.title}</h3>
                </div>
                <div className="md:col-span-5">
                  <p className="text-sm text-[#101010]/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Himalayan Production Network */}
      <section className="py-20 md:py-28 bg-[#101010] text-[#FAF8F4] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 mb-12 border-b border-white/15">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
                <Mountain className="w-3.5 h-3.5" />
                <span>On-Ground Location Footprint</span>
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl">
                Himalayan Production Corridors
              </h2>
            </div>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#FAF8F4] hover:text-[#B6A48D] transition-colors whitespace-nowrap"
            >
              <span>Commission a Location Shoot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTION_LOCATIONS.map((loc) => (
              <article
                key={loc.id}
                className="border border-white/12 bg-[#181715] flex flex-col justify-between"
              >
                <EditorialImage
                  src={loc.image}
                  alt={loc.name}
                  containerClassName="aspect-[4/3] w-full"
                  className="w-full h-full object-cover"
                  fallbackTitle={loc.name}
                />
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.16em] text-[#B6A48D]">
                      <span className="font-mono">{loc.index}</span>
                      <span className="font-mono tabular-nums">{loc.elevation}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#FAF8F4]">{loc.name}</h3>
                    <p className="inline-flex items-center gap-1.5 text-xs text-[#FAF8F4]/60">
                      <MapPin className="w-3 h-3 text-[#B6A48D] shrink-0" />
                      <span>{loc.region}</span>
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-[#FAF8F4]/75">
                    <p>{loc.lightingProfile}</p>
                    <p className="text-[#B6A48D]">Ideal for: {loc.bestFor}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ethical Representation Charter */}
      <section className="py-20 md:py-24 bg-[#F5F1EA] text-[#101010]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10 mb-10 border-b border-[#101010]/10">
            <div>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#632B37] mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Standards &amp; Welfare</span>
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl">
                Ethical Representation Charter
              </h2>
            </div>
            <Link
              to="/become-a-model"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#101010] hover:text-[#632B37] transition-colors whitespace-nowrap"
            >
              <span>Apply to Join Our Roster</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ETHICAL_CHARTER.map((pillar) => (
              <div
                key={pillar.index}
                className="p-6 bg-[#FAF8F4] border border-[#101010]/12 space-y-2.5"
              >
                <span className="font-mono text-xs text-[#632B37]">
                  {pillar.index}
                </span>
                <h3 className="font-serif text-2xl text-[#101010]">{pillar.title}</h3>
                <p className="text-sm text-[#101010]/70 leading-relaxed">
                  {pillar.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
