import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AGENCY_ASSETS } from '../../data/assets.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';

const AGENCY_METRICS = [
  { value: '48+', label: 'Represented Talent Across Boards' },
  { value: '140+', label: 'Editorial & Brand Campaigns' },
  { value: '12', label: 'International Runway Markets' },
  { value: '48h', label: 'Dedicated Casting Turnaround' },
];

export function AgencyIntro() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-[#FAF8F4] text-[#101010] border-b border-[#101010]/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <EditorialImage
              src={AGENCY_ASSETS.AGENCY_STUDIO}
              alt="House of Fashion Nepal daylight editorial studio"
              containerClassName="aspect-[4/3] lg:aspect-auto lg:h-full w-full"
              className="w-full h-full object-cover"
              fallbackTitle="House of Fashion Nepal Studio"
            />
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between py-2 lg:py-6"
          >
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[#632B37]">
                Across Nepal &amp; Beyond · Est. 2019
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.03]">
                Beyond The Frame.
              </h2>
              <p className="text-base sm:text-lg text-[#101010]/80 leading-relaxed max-w-xl">
                Representing talent from every province of Nepal — from the Terai plains and mid-hills to the Himalayas — House of Fashion Nepal champions Nepalese faces with the discipline of Paris and Milan’s premier boards.
              </p>
              <p className="text-sm sm:text-base text-[#101010]/65 leading-relaxed max-w-xl">
                From heritage cashmere houses and artisanal weaving ateliers across Nepal to international luxury lookbooks, we cultivate careers rooted in artistic integrity, transparent contracts, and long-term creative mentorship.
              </p>
            </div>

            <div className="pt-10">
              <Link
                to="/about"
                className="inline-flex items-center gap-3 px-7 py-3.5 border border-[#101010] text-xs uppercase tracking-[0.18em] font-medium text-[#101010] hover:bg-[#101010] hover:text-[#FAF8F4] transition-colors duration-150"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Full-width 4-column studio proof strip below the split */}
        <div className="mt-14 sm:mt-16 pt-10 border-t border-[#101010]/10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {AGENCY_METRICS.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#101010] tabular-nums">
                {item.value}
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-[#101010]/60">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
