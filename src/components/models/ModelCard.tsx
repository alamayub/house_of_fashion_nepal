import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AvailabilityStatus, Model } from '../../types/index.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';

const AVAILABILITY_LABEL: Record<AvailabilityStatus, string> = {
  available: 'Available',
  booked: 'On Option / Booked',
  unavailable: 'Unavailable',
};

const AVAILABILITY_TONE: Record<AvailabilityStatus, string> = {
  available: 'text-[#101010]/70',
  booked: 'text-[#632B37]',
  unavailable: 'text-[#101010]/40',
};

interface ModelCardProps {
  model: Model;
  index?: number;
}

export function ModelCard({ model, index = 0 }: ModelCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: prefersReducedMotion ? 0 : Math.min(index, 5) * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group"
    >
      <Link to={`/models/${model.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#1D1B18]">
          <EditorialImage
            src={model.coverImage}
            alt={`${model.name} (${model.id}) — ${model.category[0]}`}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            fallbackTitle={model.name}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#101010]/0 group-hover:bg-[#101010]/20 transition-colors duration-300"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-[#FAF8F4]">
            <span className="text-xs uppercase tracking-[0.18em]">View Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div className="pt-4 space-y-1.5 border-b border-[#101010]/10 pb-4">
          <div className="flex items-center justify-between gap-2 text-xs text-[#101010]/55 font-mono tabular-nums">
            <span>{model.id}</span>
            <span>{model.height} cm</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-[26px] leading-snug text-[#101010] group-hover:text-[#632B37] transition-colors">
            {model.name}
          </h3>

          <p className="text-xs text-[#101010]/70 truncate">
            {model.gender} · {model.category[0]} · {model.location}
          </p>

          <p className={`text-[11px] uppercase tracking-[0.14em] ${AVAILABILITY_TONE[model.availability]}`}>
            {AVAILABILITY_LABEL[model.availability]}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
