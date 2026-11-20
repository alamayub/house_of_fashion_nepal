import { Ruler } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Model } from '../../types/index.ts';

interface ModelStatsProps {
  model: Model;
}

interface StatRow {
  label: string;
  value: string;
  mono?: boolean;
}

export function ModelStats({ model }: ModelStatsProps) {
  const prefersReducedMotion = useReducedMotion();
  const rows: StatRow[] = [
    { label: 'Height', value: `${model.height} cm`, mono: true },
  ];

  if (model.weight !== undefined) {
    rows.push({ label: 'Weight', value: `${model.weight} kg`, mono: true });
  }
  if (model.bust !== undefined) {
    rows.push({ label: 'Bust', value: `${model.bust} cm`, mono: true });
  }
  if (model.chest !== undefined) {
    rows.push({ label: 'Chest', value: `${model.chest} cm`, mono: true });
  }
  if (model.waist !== undefined) {
    rows.push({ label: 'Waist', value: `${model.waist} cm`, mono: true });
  }
  if (model.hips !== undefined) {
    rows.push({ label: 'Hips', value: `${model.hips} cm`, mono: true });
  }
  if (model.dressSize) {
    rows.push({ label: 'Dress Size', value: model.dressSize, mono: true });
  }
  if (model.shoeSize) {
    rows.push({ label: 'Shoe Size', value: model.shoeSize, mono: true });
  }
  if (model.eyeColor) {
    rows.push({ label: 'Eye Color', value: model.eyeColor });
  }
  if (model.hairColor) {
    rows.push({ label: 'Hair Color', value: model.hairColor });
  }
  if (model.skinTone) {
    rows.push({ label: 'Skin Tone', value: model.skinTone });
  }
  if (model.bodyType) {
    rows.push({ label: 'Body Type', value: model.bodyType });
  }
  if (model.nationality) {
    rows.push({ label: 'Nationality', value: model.nationality });
  }
  rows.push({ label: 'Experience', value: model.experience });
  rows.push({ label: 'Languages', value: model.languages.join(', ') });

  return (
    <section aria-labelledby="model-stats-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 border-b border-[#101010]/15 pb-3">
        <div className="inline-flex items-center gap-2.5">
          <Ruler className="w-5 h-5 text-[#632B37] shrink-0" />
          <h2 id="model-stats-heading" className="font-serif text-2xl sm:text-3xl text-[#101010]">
            Specifications &amp; Profile
          </h2>
        </div>
        <span className="text-[11px] uppercase tracking-[0.16em] text-[#101010]/50">
          Consented Measurements
        </span>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
        {rows.map((row, idx) => (
          <motion.div
            key={row.label}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.4,
              delay: Math.min(idx * 0.03, 0.3),
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-baseline justify-between gap-4 py-3.5 border-b border-[#101010]/10"
          >
            <dt className="text-xs uppercase tracking-[0.16em] text-[#101010]/55 shrink-0">
              {row.label}
            </dt>
            <dd
              className={`text-sm text-[#101010] text-right ${
                row.mono ? 'font-mono tabular-nums' : 'font-medium'
              }`}
            >
              {row.value}
            </dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}
