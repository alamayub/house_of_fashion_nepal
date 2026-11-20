import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Expand, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CAMPAIGN_GALLERY } from '../../data/mockServices.ts';
import type { CampaignItem } from '../../types/index.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';

export function CampaignGallery() {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!selectedCampaign) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCampaign(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedCampaign]);

  const spanClasses: Record<CampaignItem['span'], string> = {
    large: 'aspect-[4/3] sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:aspect-auto',
    wide: 'aspect-[4/3] sm:aspect-[16/10] lg:col-span-2 lg:aspect-auto',
    tall: 'aspect-[4/3] sm:aspect-[3/4] lg:row-span-2 lg:aspect-auto',
    standard: 'aspect-[4/3] lg:aspect-auto',
  };

  return (
    <section className="bg-[#F5F1EA] text-[#101010] py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 mb-12 border-b border-[#101010]/10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[#632B37]">
              Selected Productions · 2025–2026
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.03]">
              Campaign &amp; Editorial Archive
            </h2>
          </div>
          <div className="space-y-3 md:text-right">
            <p className="text-sm text-[#101010]/65 max-w-md leading-relaxed">
              Recent commissions across Nepal’s heritage ateliers, daylight studios, mountain ridges, and runway presentations.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#101010] hover:text-[#632B37] transition-colors"
            >
              <span>View Full Project Dossiers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[260px] gap-4 sm:gap-5">
          {CAMPAIGN_GALLERY.map((item, idx) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setSelectedCampaign(item)}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : idx * 0.05 }}
              className={`group relative overflow-hidden bg-[#1D1B18] text-left cursor-pointer ${spanClasses[item.span]}`}
            >
              <EditorialImage
                src={item.image}
                alt={`${item.title} — ${item.client}`}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                fallbackTitle={item.title}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#101010]/85 via-[#101010]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"
              />
              <div className="absolute top-4 right-4 w-9 h-9 bg-[#101010]/60 text-[#FAF8F4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Expand className="w-4 h-4" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-[#FAF8F4]">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#B6A48D]">
                  {item.category} · {item.year}
                </p>
                <h3 className="font-serif text-2xl mt-0.5">{item.title}</h3>
                <p className="text-xs text-[#FAF8F4]/70 mt-1">
                  {item.client} · {item.location}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Campaign Lightbox */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedCampaign.title} campaign preview`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#101010]/92 backdrop-blur-sm flex items-center justify-center p-3 sm:p-8 overflow-y-auto"
            onClick={() => setSelectedCampaign(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl w-full max-h-[90dvh] overflow-y-auto bg-[#181715] text-[#FAF8F4] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                aria-label="Close campaign view"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 bg-[#101010]/80 text-[#FAF8F4] flex items-center justify-center hover:bg-[#632B37] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="max-h-[65dvh] sm:max-h-[75vh] overflow-hidden bg-[#101010]">
                <img
                  src={selectedCampaign.image}
                  alt={selectedCampaign.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full max-h-[65dvh] sm:max-h-[75vh] object-contain mx-auto"
                />
              </div>
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#B6A48D]">
                    {selectedCampaign.category} · {selectedCampaign.year}
                  </p>
                  <h4 className="font-serif text-2xl sm:text-3xl mt-1">{selectedCampaign.title}</h4>
                </div>
                <div className="text-xs text-[#FAF8F4]/70 sm:text-right">
                  <p>Client: {selectedCampaign.client}</p>
                  <p>Location: {selectedCampaign.location}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
