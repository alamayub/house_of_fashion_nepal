import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetFeaturedModelsQuery } from '../../features/models/modelsApi.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';
import { ModelGridSkeleton } from '../common/Loader.tsx';

export function FeaturedModels() {
  const { data: models, isLoading, isError } = useGetFeaturedModelsQuery();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="featured-models"
      className="bg-[#F5F1EA] text-[#101010] py-20 md:py-28 border-b border-[#101010]/10"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 mb-12 border-b border-[#101010]/10">
          <div className="space-y-3 max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#632B37]">
              Curated Board · Season 2026
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.02]">
              Featured Talent
            </h2>
          </div>

          <Link
            to="/models"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#101010] hover:text-[#632B37] transition-colors whitespace-nowrap shrink-0 group"
          >
            <span>Explore All Models</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading && <ModelGridSkeleton count={6} />}

        {isError && (
          <div className="py-16 text-center border border-[#101010]/10 bg-[#FAF8F4]">
            <p className="font-serif text-2xl mb-2">Unable to load featured talent</p>
            <p className="text-sm text-[#101010]/65">
              Please refresh or browse the full directory.
            </p>
          </div>
        )}

        {models && models.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {models.slice(0, 6).map((model, index) => (
              <motion.article
                key={model.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReducedMotion ? 0 : (index % 3) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group"
              >
                <Link to={`/models/${model.slug}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#1D1B18]">
                    <EditorialImage
                      src={model.coverImage}
                      alt={`${model.name} — ${model.category[0]} in ${model.location}`}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      fallbackTitle={model.name}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[#101010]/0 group-hover:bg-[#101010]/25 transition-colors duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5 flex items-center justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250 text-[#FAF8F4]">
                      <span className="text-xs uppercase tracking-[0.18em]">
                        View Profile
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="pt-4 space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#101010]/60 tabular-nums">
                      <span>{model.category[0]}</span>
                      <span>{model.height} cm</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-[28px] leading-snug text-[#101010] group-hover:text-[#632B37] transition-colors">
                      {model.name}
                    </h3>
                    <p className="text-xs text-[#101010]/55">
                      {model.location} · {model.id}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            to="/models"
            className="inline-flex items-center gap-3 px-9 py-4 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] transition-colors duration-150"
          >
            <span>Explore All Models</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
