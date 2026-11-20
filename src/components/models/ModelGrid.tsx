import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useAppDispatch } from '../../app/hooks.ts';
import { resetFilters, setPage } from '../../features/models/modelsSlice.ts';
import type { Model } from '../../types/index.ts';
import { ModelGridSkeleton } from '../common/Loader.tsx';
import { ModelCard } from './ModelCard.tsx';

interface ModelGridProps {
  models: Model[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  onRetry?: () => void;
}

export function ModelGrid({
  models,
  isLoading,
  isFetching,
  isError,
  page,
  totalPages,
  onRetry,
}: ModelGridProps) {
  const dispatch = useAppDispatch();
  const prefersReducedMotion = useReducedMotion();

  if (isLoading) {
    return <ModelGridSkeleton count={9} />;
  }

  if (isError) {
    return (
      <div className="py-20 px-6 text-center border border-[#101010]/15 bg-[#FAF8F4]">
        <h3 className="font-serif text-3xl text-[#101010] mb-2">
          Unable to Load Talent Directory
        </h3>
        <p className="text-sm text-[#101010]/65 mb-6">
          There was a connection issue fetching the Nepal talent roster.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-3 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] cursor-pointer"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="py-24 px-6 text-center border border-[#101010]/15 bg-[#FAF8F4]"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[#B6A48D] mb-2">
          No Matching Talent
        </p>
        <h3 className="font-serif text-3xl text-[#101010] mb-3">
          No Models Match Your Current Filters
        </h3>
        <p className="text-sm text-[#101010]/65 max-w-md mx-auto mb-8">
          Try broadening your height range, clearing category restrictions, or contact our Nepal casting desk for bespoke scouting.
        </p>
        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="px-7 py-3 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] hover:bg-[#632B37] transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-14">
      <motion.div
        layout={!prefersReducedMotion}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 transition-opacity duration-200 ${
          isFetching ? 'opacity-65' : 'opacity-100'
        }`}
      >
        {models.map((model, idx) => (
          <motion.div
            key={model.id}
            layout={!prefersReducedMotion ? 'position' : false}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <ModelCard model={model} index={idx} />
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <nav
          aria-label="Models directory pagination"
          className="flex flex-wrap items-center justify-between gap-3 pt-8 border-t border-[#101010]/10"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => {
              dispatch(setPage(page - 1));
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 border border-[#101010]/20 text-xs uppercase tracking-[0.16em] disabled:opacity-35 hover:border-[#101010] transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs tabular-nums">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => {
                    dispatch(setPage(pageNum));
                    window.scrollTo(0, 0);
                  }}
                  aria-current={page === pageNum ? 'page' : undefined}
                  className={`w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${
                    page === pageNum
                      ? 'bg-[#101010] text-[#FAF8F4]'
                      : 'text-[#101010]/70 hover:bg-[#101010]/5'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => {
              dispatch(setPage(page + 1));
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 border border-[#101010]/20 text-xs uppercase tracking-[0.16em] disabled:opacity-35 hover:border-[#101010] transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
