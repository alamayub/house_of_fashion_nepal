import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorialFaq } from '../components/common/EditorialFaq.tsx';
import { EditorialImage } from '../components/common/EditorialImage.tsx';
import { Loader } from '../components/common/Loader.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { BOOKING_RATE_TIERS, PRODUCTION_FAQS } from '../data/agencyContent.ts';
import { useGetServicesQuery } from '../features/models/modelsApi.ts';

export default function Services() {
  const { data: services, isLoading, isError } = useGetServicesQuery();
  const prefersReducedMotion = useReducedMotion();

  return (
    <PageTransition>
      <SeoHead
        title="Agency Services — Casting, Campaigns & Production"
        description="Explore House of Fashion Nepal's fashion, commercial, editorial, runway, talent casting, and nationwide Nepal photoshoot production services."
        services={services}
        faqs={PRODUCTION_FAQS}
      />

      <section className="pt-24 sm:pt-28 md:pt-36 pb-16 md:pb-24 bg-[#F5F1EA] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[#632B37]">
            Capabilities · Across Nepal &amp; International
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[0.98] max-w-4xl">
            Agency Services
          </h1>
          <p className="text-base sm:text-xl text-[#101010]/75 max-w-2xl leading-relaxed">
            From private couture presentations and daylight studio campaigns to multi-day commercial productions across Nepal’s plains, valleys, and high Himalayas, our bookers handle casting, licensing, and creative logistics.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#FAF8F4] text-[#101010]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          {isLoading && <Loader label="Loading Services" />}

          {isError && (
            <div className="py-16 text-center border border-[#101010]/15">
              <p className="font-serif text-2xl">Unable to load agency services.</p>
            </div>
          )}

          {services && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {services.map((service, idx) => (
                <motion.article
                  key={service.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.45, delay: (idx % 3) * 0.06 }}
                  className="flex flex-col border-b border-[#101010]/15 pb-8"
                >
                  <EditorialImage
                    src={service.image}
                    alt={service.title}
                    containerClassName="aspect-[4/3] w-full mb-6"
                    className="w-full h-full object-cover object-top"
                    fallbackTitle={service.title}
                  />

                  <div className="flex items-baseline justify-between gap-2 text-xs text-[#632B37] uppercase tracking-[0.18em] mb-2">
                    <span>{service.index}. {service.subtitle}</span>
                  </div>

                  <h2 className="font-serif text-3xl text-[#101010] mb-3">
                    {service.title}
                  </h2>

                  <p className="text-sm text-[#101010]/70 leading-relaxed mb-5 flex-1">
                    {service.description}
                  </p>

                  <ul className="space-y-1.5 text-xs text-[#101010]/60 mb-6">
                    {service.deliverables.map((del) => (
                      <li key={del}>· {del}</li>
                    ))}
                  </ul>

                  <Link
                    to="/book"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#101010] hover:text-[#632B37] transition-colors self-start"
                  >
                    <span>Book for {service.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Engagement Formats & Usage Licensing Guide */}
      <section className="py-20 md:py-28 bg-[#101010] text-[#FAF8F4] border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 mb-12 border-b border-white/15">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
                Commercial &amp; Editorial Structures
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl">
                Booking Formats &amp; Usage Licensing
              </h2>
            </div>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FAF8F4] text-[#101010] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#B6A48D] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Request Custom Rate Card</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/12">
            {BOOKING_RATE_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="p-6 sm:p-7 border-r border-b border-white/12 bg-[#141311] flex flex-col justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.16em] text-[#B6A48D]">
                    <span className="font-mono shrink-0">{tier.code}</span>
                    <span>{tier.duration}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#FAF8F4]">{tier.name}</h3>
                  <p className="text-xs text-[#FAF8F4]/70 leading-relaxed">
                    <span className="text-[#B6A48D]">Usage:</span> {tier.usageScope}
                  </p>
                  <p className="text-xs text-[#FAF8F4]/60 leading-relaxed">
                    Best for {tier.idealFor}
                  </p>
                </div>

                <ul className="space-y-2 pt-4 border-t border-white/10 text-xs text-[#FAF8F4]/80">
                  {tier.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#B6A48D] shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EditorialFaq
        items={PRODUCTION_FAQS}
        kicker="Production Protocol"
        heading="Bookings, Holds & Licensing FAQs"
        subheading="Standard booking answers for brand producers, fashion houses, and visiting international crews shooting in Nepal."
        tone="paper"
      />
    </PageTransition>
  );
}
