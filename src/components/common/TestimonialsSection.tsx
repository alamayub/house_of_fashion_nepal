import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetTestimonialsQuery } from '../../features/testimonials/testimonialsApi.ts';
import type { TestimonialPerspective } from '../../types/index.ts';
import { EditorialImage } from './EditorialImage.tsx';
import { Loader } from './Loader.tsx';

interface TestimonialsSectionProps {
  kicker?: string;
  heading?: string;
  subheading?: string;
  lockedPerspective?: TestimonialPerspective;
  featuredOnly?: boolean;
  tone?: 'ivory' | 'paper' | 'dark';
  limit?: number;
}

export function TestimonialsSection({
  kicker = 'Client & Talent Perspectives',
  heading = 'Voices from Set & Roster',
  subheading = 'Verified reflections from fashion houses commissioning across Nepal and the represented models shaping the country’s editorial landscape.',
  lockedPerspective,
  featuredOnly = false,
  tone = 'paper',
  limit,
}: TestimonialsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedPerspective, setSelectedPerspective] = useState<
    TestimonialPerspective | 'All'
  >(lockedPerspective || 'All');

  const activeFilter = lockedPerspective || selectedPerspective;

  const { data: testimonials = [], isLoading } = useGetTestimonialsQuery({
    perspective: activeFilter,
    featured: featuredOnly ? true : undefined,
  });

  const displayed = limit ? testimonials.slice(0, limit) : testimonials;

  const toneClasses = {
    paper: {
      section: 'bg-[#FAF8F4] text-[#101010] border-[#101010]/10',
      kicker: 'text-[#632B37]',
      muted: 'text-[#101010]/65',
      border: 'border-[#101010]/12',
      cardBg: 'bg-[#F5F1EA]/65',
      tabActive: 'bg-[#101010] text-[#FAF8F4] border-[#101010]',
      tabIdle: 'bg-[#F5F1EA] text-[#101010]/70 border-[#101010]/15 hover:border-[#101010]',
      link: 'text-[#101010] hover:text-[#632B37]',
    },
    ivory: {
      section: 'bg-[#F5F1EA] text-[#101010] border-[#101010]/10',
      kicker: 'text-[#632B37]',
      muted: 'text-[#101010]/65',
      border: 'border-[#101010]/12',
      cardBg: 'bg-[#FAF8F4]',
      tabActive: 'bg-[#101010] text-[#FAF8F4] border-[#101010]',
      tabIdle: 'bg-[#FAF8F4] text-[#101010]/70 border-[#101010]/15 hover:border-[#101010]',
      link: 'text-[#101010] hover:text-[#632B37]',
    },
    dark: {
      section: 'bg-[#101010] text-[#FAF8F4] border-white/10',
      kicker: 'text-[#B6A48D]',
      muted: 'text-[#FAF8F4]/65',
      border: 'border-white/10',
      cardBg: 'bg-[#181715]',
      tabActive: 'bg-[#FAF8F4] text-[#101010] border-[#FAF8F4]',
      tabIdle: 'bg-transparent text-[#FAF8F4]/70 border-white/15 hover:border-[#B6A48D]',
      link: 'text-[#FAF8F4] hover:text-[#B6A48D]',
    },
  }[tone];

  return (
    <section className={`py-20 md:py-28 border-t ${toneClasses.section}`}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        <div
          className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b ${toneClasses.border}`}
        >
          <div className="space-y-3 max-w-2xl">
            <p className={`text-xs uppercase tracking-[0.22em] ${toneClasses.kicker}`}>
              {kicker}
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.03] text-balance">
              {heading}
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${toneClasses.muted}`}>
              {subheading}
            </p>
          </div>

          {!lockedPerspective && (
            <div
              role="tablist"
              aria-label="Filter testimonials by perspective"
              className="flex items-center gap-2 shrink-0 overflow-x-auto"
            >
              {(
                [
                  { id: 'All', label: 'All Voices' },
                  { id: 'client', label: 'Client Houses' },
                  { id: 'model', label: 'Represented Models' },
                ] as const
              ).map((tab) => {
                const isActive = selectedPerspective === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedPerspective(tab.id)}
                    className={`px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive ? toneClasses.tabActive : toneClasses.tabIdle
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isLoading ? (
          <Loader label="Loading Perspectives" />
        ) : displayed.length === 0 ? (
          <div className={`p-10 border ${toneClasses.border} text-center`}>
            <p className="font-serif text-2xl">No testimonials published in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((item, idx) => {
              const isModel = item.perspective === 'model';
              const targetHref = isModel
                ? item.relatedSlug
                  ? `/models/${item.relatedSlug}`
                  : '/models'
                : '/projects';

              return (
                <motion.article
                  key={item.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    duration: 0.45,
                    delay: prefersReducedMotion ? 0 : idx * 0.04,
                  }}
                  className={`p-6 sm:p-8 border ${toneClasses.border} ${toneClasses.cardBg} flex flex-col justify-between gap-8`}
                >
                  <div className="space-y-5">
                    <div
                      className={`flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em] ${toneClasses.kicker}`}
                    >
                      <span>{isModel ? 'Represented Talent' : 'Client Partner'}</span>
                      <span className="font-mono tabular-nums">{item.year}</span>
                    </div>

                    <blockquote className="font-serif text-xl sm:text-[22px] leading-[1.45] italic">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                  </div>

                  <div className={`pt-5 border-t ${toneClasses.border} space-y-4`}>
                    <div className="flex items-center gap-3.5">
                      {item.avatarImage && (
                        <EditorialImage
                          src={item.avatarImage}
                          alt={item.authorName}
                          containerClassName="w-12 h-12 shrink-0"
                          className="w-full h-full object-cover object-top"
                          fallbackTitle={item.authorName}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-serif text-xl leading-tight truncate">
                          {item.authorName}
                        </p>
                        <p className={`text-xs truncate ${toneClasses.muted}`}>
                          {item.authorRole} · {item.organizationOrBoard}
                        </p>
                        <p className={`text-[11px] truncate ${toneClasses.muted}`}>
                          {item.location}
                          {item.projectOrCampaign ? ` · ${item.projectOrCampaign}` : ''}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={targetHref}
                      className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors ${toneClasses.link}`}
                    >
                      <span>
                        {isModel ? 'View Talent Portfolio' : 'Explore Commission Archive'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
