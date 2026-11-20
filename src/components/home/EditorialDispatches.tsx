import { ArrowRight, Compass, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  EDITORIAL_DISPATCHES,
  ETHICAL_CHARTER,
} from '../../data/agencyContent.ts';

export function EditorialDispatches() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-[#FAF8F4] text-[#101010] py-20 md:py-28 border-t border-[#101010]/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-14 sm:space-y-16">
        {/* Top Row: Agency Journal & Casting Dispatches */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 mb-10 border-b border-[#101010]/10">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#632B37]">
                <Compass className="w-3.5 h-3.5" />
                <span>Agency Dispatches · Season 2026</span>
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.03]">
                Casting Notes &amp; Production Desk
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#101010] hover:text-[#632B37] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Explore Production Capabilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#101010]/12">
            {EDITORIAL_DISPATCHES.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.45,
                  delay: prefersReducedMotion ? 0 : idx * 0.05,
                }}
                className="p-6 sm:p-7 bg-[#FAF8F4] border-r border-b border-[#101010]/12 flex flex-col justify-between gap-6 hover:bg-[#F5F1EA] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                    <span>{item.tag}</span>
                    <span className="font-mono text-[#101010]/55">{item.date}</span>
                  </div>
                  <h3 className="font-serif text-2xl leading-snug text-[#101010]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#101010]/70 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <p className="inline-flex items-center gap-1.5 text-xs text-[#101010]/55">
                    <MapPin className="w-3.5 h-3.5 text-[#632B37] shrink-0" />
                    <span>{item.location}</span>
                  </p>
                  <div>
                    <Link
                      to={item.ctaTo}
                      className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#101010] hover:text-[#632B37] transition-colors"
                    >
                      <span>{item.ctaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Bottom Strip: Representation Charter Highlights */}
        <div className="p-6 sm:p-8 lg:p-10 bg-[#F5F1EA] border border-[#101010]/12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-8 border-b border-[#101010]/10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#632B37] mb-1.5">
                Ethical Representation Charter
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#101010]">
                Principled Standards for Talent &amp; Producers
              </h3>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#101010] hover:text-[#632B37] transition-colors whitespace-nowrap"
            >
              <span>Read Full Agency Chronicle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {ETHICAL_CHARTER.map((pillar) => (
              <div key={pillar.index} className="space-y-2">
                <span className="font-mono text-xs text-[#632B37]">
                  {pillar.index}
                </span>
                <h4 className="font-serif text-xl text-[#101010]">{pillar.title}</h4>
                <p className="text-xs sm:text-sm text-[#101010]/70 leading-relaxed">
                  {pillar.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
