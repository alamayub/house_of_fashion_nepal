import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import type { FaqEntry } from '../../data/agencyContent.ts';

interface EditorialFaqProps {
  items: FaqEntry[];
  kicker?: string;
  heading: string;
  subheading?: string;
  tone?: 'paper' | 'ivory' | 'dark';
}

export function EditorialFaq({
  items,
  kicker = 'Clarifications & Protocol',
  heading,
  subheading,
  tone = 'ivory',
}: EditorialFaqProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const prefersReducedMotion = useReducedMotion();

  const surface =
    tone === 'dark'
      ? 'bg-[#101010] text-[#FAF8F4] border-white/10'
      : tone === 'paper'
        ? 'bg-[#F5F1EA] text-[#101010] border-[#101010]/10'
        : 'bg-[#FAF8F4] text-[#101010] border-[#101010]/10';

  const kickerColor = tone === 'dark' ? 'text-[#B6A48D]' : 'text-[#632B37]';
  const mutedColor = tone === 'dark' ? 'text-[#FAF8F4]/70' : 'text-[#101010]/70';
  const itemBorder = tone === 'dark' ? 'border-white/12' : 'border-[#101010]/12';

  return (
    <section className={`py-20 md:py-28 border-t ${surface}`}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-4 space-y-4">
          <p className={`text-xs uppercase tracking-[0.22em] ${kickerColor}`}>
            {kicker}
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl leading-[1.05]">
            {heading}
          </h2>
          {subheading && (
            <p className={`text-sm leading-relaxed ${mutedColor}`}>
              {subheading}
            </p>
          )}
        </div>

        <div className={`lg:col-span-8 divide-y border-t border-b ${itemBorder}`}>
          {items.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="py-5">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-start justify-between gap-4 sm:gap-6 text-left cursor-pointer group"
                >
                  <div className="flex items-baseline gap-3 sm:gap-4">
                    <span
                      className={`font-mono text-xs tabular-nums shrink-0 ${kickerColor}`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-serif text-xl sm:text-2xl leading-snug group-hover:text-[#632B37] transition-colors">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 mt-1.5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className={`pt-3 pl-7 sm:pl-9 pr-1 sm:pr-8 text-sm leading-relaxed ${mutedColor}`}>
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
