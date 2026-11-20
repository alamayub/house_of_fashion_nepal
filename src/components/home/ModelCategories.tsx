import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks.ts';
import { useGetCategoriesQuery } from '../../features/models/modelsApi.ts';
import { resetFilters, setFilterField } from '../../features/models/modelsSlice.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';

export function ModelCategories() {
  const { data: categories } = useGetCategoriesQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleSelectCategory = (categoryName: string) => {
    dispatch(resetFilters());
    dispatch(setFilterField({ key: 'category', value: categoryName }));
    navigate(`/models?category=${encodeURIComponent(categoryName)}`);
  };

  if (!categories) return null;

  return (
    <section className="bg-[#101010] text-[#FAF8F4] py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 mb-12 border-b border-white/15">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
              Representation Boards
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.03]">
              Divisions &amp; Categories
            </h2>
          </div>
          <p className="text-sm text-[#FAF8F4]/65 max-w-md leading-relaxed">
            Explore talent curated across eight specialized divisions for editorial, runway, commercial, and international productions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.name)}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45,
                delay: prefersReducedMotion ? 0 : (idx % 4) * 0.06,
              }}
              className="group text-left relative aspect-[3/4] overflow-hidden bg-[#1D1B18] border border-white/10 cursor-pointer"
            >
              <EditorialImage
                src={cat.image}
                alt={cat.name}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                fallbackTitle={cat.name}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#101010]/90 via-[#101010]/30 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#B6A48D] tabular-nums">
                  <span>{cat.count} Talent</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="font-serif text-2xl text-[#FAF8F4]">{cat.name}</h3>
                <p className="text-xs text-[#FAF8F4]/70 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
