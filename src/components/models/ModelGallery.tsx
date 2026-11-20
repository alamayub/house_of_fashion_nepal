import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EditorialImage } from '../common/EditorialImage.tsx';

interface ModelGalleryProps {
  modelName: string;
  images: string[];
}

export function ModelGallery({ modelName, images }: ModelGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIdx === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIdx(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) => (prev === null ? null : (prev + 1) % images.length));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev - 1 + images.length) % images.length,
        );
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx, images.length]);

  return (
    <section aria-labelledby="portfolio-gallery-heading" className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 border-b border-[#101010]/15 pb-3">
        <h2 id="portfolio-gallery-heading" className="font-serif text-2xl sm:text-3xl text-[#101010]">
          Portfolio &amp; Tearsheets
        </h2>
        <span className="text-xs uppercase tracking-[0.16em] text-[#101010]/55 tabular-nums">
          {images.length} Photographs
        </span>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => setLightboxIdx(idx)}
            className="group relative w-full block overflow-hidden bg-[#1D1B18] break-inside-avoid cursor-pointer text-left"
          >
            <EditorialImage
              src={img}
              alt={`${modelName} portfolio image ${idx + 1}`}
              containerClassName="w-full"
              className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              fallbackTitle={modelName}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#101010]/0 group-hover:bg-[#101010]/20 transition-colors duration-200"
            />
            <span className="absolute top-3 right-3 w-9 h-9 bg-[#101010]/70 text-[#FAF8F4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Expand className="w-4 h-4" />
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${modelName} portfolio lightbox`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#101010]/95 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxIdx(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close lightbox"
              className="absolute top-5 right-5 z-20 w-11 h-11 bg-[#181715] text-[#FAF8F4] border border-white/15 flex items-center justify-center hover:bg-[#632B37] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx((lightboxIdx - 1 + images.length) % images.length);
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-[#181715]/90 text-[#FAF8F4] border border-white/15 flex items-center justify-center hover:bg-[#632B37] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx((lightboxIdx + 1) % images.length);
                  }}
                  aria-label="Next image"
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-[#181715]/90 text-[#FAF8F4] border border-white/15 flex items-center justify-center hover:bg-[#632B37] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxIdx]}
                alt={`${modelName} full view ${lightboxIdx + 1}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-[78vh] w-auto object-contain"
              />
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#B6A48D] tabular-nums">
                {modelName} · {lightboxIdx + 1} / {images.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
