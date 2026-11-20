import {
  AnimatePresence,
  motion,
  type PanInfo,
  useDragControls,
  useReducedMotion,
} from 'motion/react';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Maximize2,
  Minimize2,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import {
  initialFilterState,
  resetFilters,
  setFilterField,
} from '../../features/models/modelsSlice.ts';
import type { SortOption } from '../../types/index.ts';
import { SearchableSelect } from '../common/SearchableSelect.tsx';
import { ModelSearch } from './ModelSearch.tsx';

interface ModelFiltersProps {
  availableFilters?: {
    genders: string[];
    categories: string[];
    bodyTypes: string[];
    experienceLevels: string[];
    locations: string[];
  };
  totalCount: number;
}

const SORT_OPTIONS: Array<{
  value: SortOption;
  label: string;
  shortLabel: string;
}> = [
  { value: 'featured', label: 'Sort: Featured', shortLabel: 'Featured' },
  { value: 'newest', label: 'Sort: Newest', shortLabel: 'Newest' },
  { value: 'height_asc', label: 'Height: Low to High', shortLabel: 'Height ↑' },
  { value: 'height_desc', label: 'Height: High to Low', shortLabel: 'Height ↓' },
  { value: 'name_asc', label: 'Name: A–Z', shortLabel: 'Name A–Z' },
];

const AGE_OPTIONS = [
  { value: 'All', label: 'All Ages (18+)' },
  { value: '18-22', label: '18–22' },
  { value: '23-27', label: '23–27' },
  { value: '28+', label: '28+' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'All', label: 'Any Status' },
  { value: 'available', label: 'Available Now' },
  { value: 'booked', label: 'Booked / On Option' },
  { value: 'unavailable', label: 'Unavailable' },
];

type MobileSheetMode = 'filters' | 'sort' | null;
type SheetSnap = 'half' | 'full';

export function ModelFilters({ availableFilters, totalCount }: ModelFiltersProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.modelsFilter);
  const prefersReducedMotion = useReducedMotion();
  const dragControls = useDragControls();

  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [mobileSheet, setMobileSheet] = useState<MobileSheetMode>(null);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>('half');

  const genderList = availableFilters?.genders || ['Female', 'Male', 'Non-Binary'];
  const categoryList = availableFilters?.categories || [
    'Female Models',
    'Male Models',
    'Fashion Models',
    'Commercial Models',
    'Fitness Models',
    'Petite Models',
    'Plus-size Models',
    'New Faces',
    'Runway',
    'Editorial',
    'Video',
  ];
  const bodyTypeList = availableFilters?.bodyTypes || [
    'Editorial',
    'Tall Editorial',
    'Athletic Lean',
    'Athletic',
    'Proportional',
    'Petite',
    'Curve',
    'Classic',
    'Lean',
  ];
  const experienceList = availableFilters?.experienceLevels || [
    'New Face',
    'Emerging',
    'Established',
    'Principal',
  ];
  const locationList = availableFilters?.locations || [
    'Kathmandu',
    'Lalitpur',
    'Pokhara',
    'Bhaktapur',
  ];

  // Lock background scroll & close mobile bottom sheet on Escape or desktop resize
  useEffect(() => {
    if (!mobileSheet) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSheet(null);
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSheet(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileSheet]);

  const openMobileSheet = (mode: Exclude<MobileSheetMode, null>) => {
    setMobileSheet((prev) => {
      if (prev === mode) return null;
      if (mode === 'filters') {
        setSheetSnap('half');
      }
      return mode;
    });
  };

  const handleSheetDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const { offset, velocity } = info;

    if (mobileSheet === 'sort') {
      if (offset.y > 70 || velocity.y > 360) {
        setMobileSheet(null);
      }
      return;
    }

    // Filters sheet supports 3-state drag: full <-> half <-> closed
    if (velocity.y > 550 || offset.y > 160) {
      if (sheetSnap === 'full' && velocity.y < 900 && offset.y < 240) {
        setSheetSnap('half');
      } else {
        setMobileSheet(null);
      }
      return;
    }

    if (offset.y > 70) {
      if (sheetSnap === 'full') {
        setSheetSnap('half');
      } else {
        setMobileSheet(null);
      }
      return;
    }

    if (offset.y < -60 || velocity.y < -400) {
      setSheetSnap('full');
    }
  };

  const activeFilters: { label: string; isSearch?: boolean; onClear: () => void }[] = [];

  if (filters.search) {
    activeFilters.push({
      label: `Search: "${filters.search}"`,
      isSearch: true,
      onClear: () => dispatch(setFilterField({ key: 'search', value: '' })),
    });
  }
  if (filters.gender !== 'All') {
    activeFilters.push({
      label: `Gender: ${filters.gender}`,
      onClear: () => dispatch(setFilterField({ key: 'gender', value: 'All' })),
    });
  }
  if (filters.category !== 'All') {
    activeFilters.push({
      label: `Category: ${filters.category}`,
      onClear: () => dispatch(setFilterField({ key: 'category', value: 'All' })),
    });
  }
  if (
    filters.heightMin !== initialFilterState.heightMin ||
    filters.heightMax !== initialFilterState.heightMax
  ) {
    activeFilters.push({
      label: `Height: ${filters.heightMin}–${filters.heightMax} cm`,
      onClear: () => {
        dispatch(
          setFilterField({ key: 'heightMin', value: initialFilterState.heightMin }),
        );
        dispatch(
          setFilterField({ key: 'heightMax', value: initialFilterState.heightMax }),
        );
      },
    });
  }
  if (filters.ageGroup !== 'All') {
    activeFilters.push({
      label: `Age: ${filters.ageGroup}`,
      onClear: () => dispatch(setFilterField({ key: 'ageGroup', value: 'All' })),
    });
  }
  if (filters.bodyType !== 'All') {
    activeFilters.push({
      label: `Body Type: ${filters.bodyType}`,
      onClear: () => dispatch(setFilterField({ key: 'bodyType', value: 'All' })),
    });
  }
  if (filters.experienceLevel !== 'All') {
    activeFilters.push({
      label: `Experience: ${filters.experienceLevel}`,
      onClear: () =>
        dispatch(setFilterField({ key: 'experienceLevel', value: 'All' })),
    });
  }
  if (filters.availability !== 'All') {
    activeFilters.push({
      label: `Status: ${filters.availability}`,
      onClear: () =>
        dispatch(setFilterField({ key: 'availability', value: 'All' })),
    });
  }
  if (filters.location !== 'All') {
    activeFilters.push({
      label: `Location: ${filters.location}`,
      onClear: () => dispatch(setFilterField({ key: 'location', value: 'All' })),
    });
  }

  const drawerFilterCount = activeFilters.filter((f) => !f.isSearch).length;
  const currentSort =
    SORT_OPTIONS.find((opt) => opt.value === filters.sort) || SORT_OPTIONS[0];

  const labelClass =
    'block text-[11px] uppercase tracking-[0.16em] text-[#101010]/60 mb-1.5';

  const sheetOptionClass = (active: boolean) =>
    `px-3 py-2 text-xs border text-left transition-colors cursor-pointer ${
      active
        ? 'bg-[#101010] text-[#FAF8F4] border-[#101010] font-medium'
        : 'bg-[#F5F1EA] text-[#101010]/80 border-[#101010]/15 hover:border-[#101010]'
    }`;

  const targetSheetHeight =
    mobileSheet === 'sort'
      ? 'auto'
      : sheetSnap === 'full'
        ? '90dvh'
        : '60dvh';

  const mobileBottomSheetUI =
    typeof document !== 'undefined'
      ? createPortal(
          <>
            {/* Sticky Mobile Bottom Sheet Bar */}
            <motion.div
              role="region"
              aria-label="Mobile talent filter and sort bar"
              initial={prefersReducedMotion ? false : { y: 72, opacity: 0 }}
              animate={{
                y: mobileSheet ? 16 : 0,
                opacity: mobileSheet ? 0 : 1,
              }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className={`fixed inset-x-0 bottom-0 z-40 md:hidden bg-[#FAF8F4]/95 backdrop-blur-md border-t border-[#101010]/15 shadow-[0_-8px_28px_rgba(16,16,16,0.08)] pb-[env(safe-area-inset-bottom)] ${
                mobileSheet ? 'pointer-events-none' : ''
              }`}
            >
              <div className="grid grid-cols-2 divide-x divide-[#101010]/15">
                <motion.button
                  type="button"
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  onClick={() => openMobileSheet('filters')}
                  aria-expanded={mobileSheet === 'filters'}
                  aria-controls="mobile-model-filters-sheet"
                  className={`flex items-center justify-center gap-2 py-3.5 px-4 text-xs uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer ${
                    drawerFilterCount > 0
                      ? 'bg-[#101010] text-[#FAF8F4]'
                      : 'text-[#101010] active:bg-[#F5F1EA]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>Filters</span>
                  <AnimatePresence initial={false}>
                    {drawerFilterCount > 0 && (
                      <motion.span
                        key={drawerFilterCount}
                        initial={prefersReducedMotion ? false : { scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="px-1.5 py-0.5 bg-[#632B37] text-[#FAF8F4] font-mono text-[10px] leading-none tabular-nums"
                      >
                        {drawerFilterCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  onClick={() => openMobileSheet('sort')}
                  aria-expanded={mobileSheet === 'sort'}
                  aria-controls="mobile-model-sort-sheet"
                  className="flex items-center justify-center gap-2 py-3.5 px-4 text-xs uppercase tracking-[0.14em] text-[#101010] active:bg-[#F5F1EA] transition-colors cursor-pointer min-w-0"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{currentSort.shortLabel}</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Interactive Slide-Up / Resizable Mobile Bottom Sheet Drawer */}
            <AnimatePresence>
              {mobileSheet !== null && (
                <div className="fixed inset-0 z-50 md:hidden">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    onClick={() => setMobileSheet(null)}
                    aria-hidden="true"
                    className="fixed inset-0 bg-[#101010]/65 backdrop-blur-[2px]"
                  />

                  {/* Sheet Surface with Drag-to-Resize & Drag-to-Dismiss */}
                  <motion.div
                    id={
                      mobileSheet === 'filters'
                        ? 'mobile-model-filters-sheet'
                        : 'mobile-model-sort-sheet'
                    }
                    role="dialog"
                    aria-modal="true"
                    aria-label={
                      mobileSheet === 'filters'
                        ? 'Filter models directory'
                        : 'Sort models directory'
                    }
                    drag={prefersReducedMotion ? false : 'y'}
                    dragControls={dragControls}
                    dragListener={false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0.14, bottom: 0.45 }}
                    onDragEnd={handleSheetDragEnd}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { y: '100%', height: targetSheetHeight }
                    }
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1, height: targetSheetHeight }
                        : { y: 0, height: targetSheetHeight }
                    }
                    exit={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.15 }
                        : {
                            y: { type: 'spring', stiffness: 410, damping: 38 },
                            height: { type: 'spring', stiffness: 360, damping: 36 },
                          }
                    }
                    className="fixed inset-x-0 bottom-0 max-h-[92dvh] bg-[#FAF8F4] text-[#101010] border-t border-[#101010]/20 flex flex-col shadow-2xl will-change-transform"
                  >
                    {/* Draggable Handle & Header Zone */}
                    <div
                      onPointerDown={(e) => {
                        if (!prefersReducedMotion) {
                          dragControls.start(e);
                        }
                      }}
                      className="shrink-0 border-b border-[#101010]/12 px-5 pt-2.5 pb-3.5 select-none touch-none cursor-grab active:cursor-grabbing"
                    >
                      {/* Drag Pill Indicator (also clickable to toggle half/full size) */}
                      <button
                        type="button"
                        onClick={() => {
                          if (mobileSheet === 'filters') {
                            setSheetSnap((prev) =>
                              prev === 'half' ? 'full' : 'half',
                            );
                          }
                        }}
                        aria-label={
                          mobileSheet === 'filters'
                            ? sheetSnap === 'full'
                              ? 'Resize sheet to compact height'
                              : 'Expand sheet to full height'
                            : 'Drag down to close'
                        }
                        className="w-full py-1.5 flex items-center justify-center cursor-pointer"
                      >
                        <span className="w-11 h-1 bg-[#101010]/25 block transition-colors hover:bg-[#101010]/50" />
                      </button>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#632B37] tabular-nums">
                            {totalCount} {totalCount === 1 ? 'Model' : 'Models'} Matched
                          </p>
                          <h2 className="font-serif text-2xl leading-tight text-[#101010]">
                            {mobileSheet === 'filters'
                              ? 'Refine Talent Board'
                              : 'Sort Directory'}
                          </h2>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {mobileSheet === 'filters' && (
                            <button
                              type="button"
                              onClick={() =>
                                setSheetSnap((prev) =>
                                  prev === 'half' ? 'full' : 'half',
                                )
                              }
                              aria-label={
                                sheetSnap === 'full'
                                  ? 'Compact filter sheet'
                                  : 'Expand filter sheet'
                              }
                              className="w-9 h-9 flex items-center justify-center text-[#101010]/65 hover:text-[#101010] hover:bg-[#101010]/5 transition-colors cursor-pointer"
                            >
                              {sheetSnap === 'full' ? (
                                <Minimize2 className="w-4 h-4" />
                              ) : (
                                <Maximize2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setMobileSheet(null)}
                            aria-label="Close panel"
                            className="w-9 h-9 -mr-1.5 flex items-center justify-center text-[#101010]/65 hover:text-[#101010] hover:bg-[#101010]/5 transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Interactive Mode Switcher inside Sheet */}
                      <div className="mt-3 pt-2.5 border-t border-[#101010]/10 grid grid-cols-2 gap-2">
                        {(
                          [
                            {
                              id: 'filters',
                              label:
                                drawerFilterCount > 0
                                  ? `Filters (${drawerFilterCount})`
                                  : 'Filters',
                            },
                            { id: 'sort', label: `Sort · ${currentSort.shortLabel}` },
                          ] as const
                        ).map((tab) => {
                          const isCurrent = mobileSheet === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setMobileSheet(tab.id)}
                              className={`relative py-2 px-3 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors cursor-pointer truncate ${
                                isCurrent
                                  ? 'text-[#FAF8F4]'
                                  : 'text-[#101010]/65 hover:text-[#101010]'
                              }`}
                            >
                              {isCurrent && (
                                <motion.span
                                  layoutId="mobile-sheet-mode-pill"
                                  transition={{
                                    type: 'spring',
                                    stiffness: 450,
                                    damping: 36,
                                  }}
                                  className="absolute inset-0 bg-[#101010]"
                                />
                              )}
                              <span className="relative z-10">{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Animated Sheet Body Mode Switch */}
                    <AnimatePresence mode="wait" initial={false}>
                      {mobileSheet === 'filters' ? (
                        <motion.div
                          key="sheet-body-filters"
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className="flex-1 min-h-0 flex flex-col"
                        >
                          {/* Scrollable Filter Controls */}
                          <div className="flex-1 overflow-y-auto overscroll-y-contain px-5 py-5 space-y-6">
                            {/* Gender / Board */}
                            <div>
                              <p className={labelClass}>Gender / Board</p>
                              <div className="flex flex-wrap gap-2">
                                {['All', ...genderList].map((g) => (
                                  <motion.button
                                    key={g}
                                    type="button"
                                    whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                                    onClick={() =>
                                      dispatch(setFilterField({ key: 'gender', value: g }))
                                    }
                                    className={sheetOptionClass(filters.gender === g)}
                                  >
                                    {g === 'All' ? 'All Genders' : g}
                                  </motion.button>
                                ))}
                              </div>
                            </div>

                            {/* Category */}
                            <div>
                              <p className={labelClass}>Category</p>
                              <div className="flex flex-wrap gap-2">
                                {['All', ...categoryList].map((c) => (
                                  <motion.button
                                    key={c}
                                    type="button"
                                    whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                                    onClick={() =>
                                      dispatch(setFilterField({ key: 'category', value: c }))
                                    }
                                    className={sheetOptionClass(filters.category === c)}
                                  >
                                    {c === 'All' ? 'All Categories' : c}
                                  </motion.button>
                                ))}
                              </div>
                            </div>

                            {/* Availability */}
                            <div>
                              <p className={labelClass}>Availability</p>
                              <div className="grid grid-cols-2 gap-2">
                                {AVAILABILITY_OPTIONS.map((opt) => (
                                  <motion.button
                                    key={opt.value}
                                    type="button"
                                    whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                                    onClick={() =>
                                      dispatch(
                                        setFilterField({
                                          key: 'availability',
                                          value: opt.value,
                                        }),
                                      )
                                    }
                                    className={sheetOptionClass(
                                      filters.availability === opt.value,
                                    )}
                                  >
                                    {opt.label}
                                  </motion.button>
                                ))}
                              </div>
                            </div>

                            {/* Age Bracket */}
                            <div>
                              <p className={labelClass}>Age Bracket</p>
                              <div className="grid grid-cols-2 gap-2">
                                {AGE_OPTIONS.map((opt) => (
                                  <motion.button
                                    key={opt.value}
                                    type="button"
                                    whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                                    onClick={() =>
                                      dispatch(
                                        setFilterField({
                                          key: 'ageGroup',
                                          value: opt.value,
                                        }),
                                      )
                                    }
                                    className={sheetOptionClass(
                                      filters.ageGroup === opt.value,
                                    )}
                                  >
                                    {opt.label}
                                  </motion.button>
                                ))}
                              </div>
                            </div>

                            {/* Height Range */}
                            <div>
                              <p className={labelClass}>Height Range (cm)</p>
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  min={150}
                                  max={200}
                                  value={filters.heightMin}
                                  onChange={(e) =>
                                    dispatch(
                                      setFilterField({
                                        key: 'heightMin',
                                        value: Number(e.target.value) || 150,
                                      }),
                                    )
                                  }
                                  aria-label="Minimum height in cm"
                                  className="w-1/2 px-3.5 py-2.5 text-sm bg-[#F5F1EA] border border-[#101010]/20 tabular-nums focus:outline-none focus:border-[#632B37]"
                                />
                                <span className="text-xs text-[#101010]/45">–</span>
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  min={155}
                                  max={210}
                                  value={filters.heightMax}
                                  onChange={(e) =>
                                    dispatch(
                                      setFilterField({
                                        key: 'heightMax',
                                        value: Number(e.target.value) || 200,
                                      }),
                                    )
                                  }
                                  aria-label="Maximum height in cm"
                                  className="w-1/2 px-3.5 py-2.5 text-sm bg-[#F5F1EA] border border-[#101010]/20 tabular-nums focus:outline-none focus:border-[#632B37]"
                                />
                              </div>
                            </div>

                            {/* Experience Level */}
                            <div>
                              <p className={labelClass}>Experience Level</p>
                              <div className="flex flex-wrap gap-2">
                                {['All', ...experienceList].map((exp) => (
                                  <motion.button
                                    key={exp}
                                    type="button"
                                    whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                                    onClick={() =>
                                      dispatch(
                                        setFilterField({
                                          key: 'experienceLevel',
                                          value: exp,
                                        }),
                                      )
                                    }
                                    className={sheetOptionClass(
                                      filters.experienceLevel === exp,
                                    )}
                                  >
                                    {exp === 'All' ? 'All Levels' : exp}
                                  </motion.button>
                                ))}
                              </div>
                            </div>

                            {/* Body Type */}
                            <div>
                              <p className={labelClass}>Body Type</p>
                              <div className="flex flex-wrap gap-2">
                                {['All', ...bodyTypeList].map((bt) => (
                                  <motion.button
                                    key={bt}
                                    type="button"
                                    whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                                    onClick={() =>
                                      dispatch(
                                        setFilterField({ key: 'bodyType', value: bt }),
                                      )
                                    }
                                    className={sheetOptionClass(filters.bodyType === bt)}
                                  >
                                    {bt === 'All' ? 'All Body Types' : bt}
                                  </motion.button>
                                ))}
                              </div>
                            </div>

                            {/* City / Base */}
                            <div>
                              <p className={labelClass}>City / Base</p>
                              <div className="flex flex-wrap gap-2">
                                {['All', ...locationList].map((loc) => (
                                  <motion.button
                                    key={loc}
                                    type="button"
                                    whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                                    onClick={() =>
                                      dispatch(
                                        setFilterField({ key: 'location', value: loc }),
                                      )
                                    }
                                    className={sheetOptionClass(filters.location === loc)}
                                  >
                                    {loc === 'All' ? 'All Locations' : loc}
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Sticky Sheet Footer Actions */}
                          <div className="shrink-0 px-5 pt-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] border-t border-[#101010]/15 bg-[#FAF8F4] flex items-center gap-3">
                            <motion.button
                              type="button"
                              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                              disabled={activeFilters.length === 0}
                              onClick={() => dispatch(resetFilters())}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 border border-[#101010]/25 text-xs uppercase tracking-[0.14em] text-[#101010] disabled:opacity-35 hover:border-[#101010] transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset</span>
                            </motion.button>
                            <motion.button
                              type="button"
                              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                              onClick={() => setMobileSheet(null)}
                              className="flex-1 py-3 px-5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] transition-colors cursor-pointer tabular-nums"
                            >
                              Show {totalCount} {totalCount === 1 ? 'Model' : 'Models'}
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        /* Sort Sheet Options */
                        <motion.div
                          key="sheet-body-sort"
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className="px-5 pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))] divide-y divide-[#101010]/10"
                        >
                          {SORT_OPTIONS.map((opt) => {
                            const isSelected = filters.sort === opt.value;
                            return (
                              <motion.button
                                key={opt.value}
                                type="button"
                                whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                                onClick={() => {
                                  dispatch(
                                    setFilterField({ key: 'sort', value: opt.value }),
                                  );
                                  setMobileSheet(null);
                                }}
                                className={`w-full py-3.5 flex items-center justify-between gap-4 text-left text-xs uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'text-[#632B37] font-semibold'
                                    : 'text-[#101010]/80 hover:text-[#101010]'
                                }`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check className="w-4 h-4 shrink-0" />}
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>,
          document.body,
        )
      : null;

  return (
    <div className="space-y-5 pb-8 border-b border-[#101010]/10">
      {/* Top Toolbar: Search (All Viewports) + Desktop Filter Drawer Toggle & Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <ModelSearch />

        <div className="hidden md:flex items-center gap-3">
          <motion.button
            type="button"
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            onClick={() => setFiltersExpanded((v) => !v)}
            aria-expanded={filtersExpanded}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.16em] border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              filtersExpanded || activeFilters.length > 0
                ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
                : 'bg-[#FAF8F4] text-[#101010] border-[#101010]/20 hover:border-[#101010]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilters.length > 0 && (
              <span className="tabular-nums text-[#B6A48D]">
                ({activeFilters.length})
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                filtersExpanded ? 'rotate-180' : ''
              }`}
            />
          </motion.button>

          <div className="relative flex items-center flex-initial min-w-[215px]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#101010]/55 pointer-events-none block absolute left-3.5 z-10" />
            <label htmlFor="sort-models" className="sr-only">
              Sort models
            </label>
            <SearchableSelect
              id="sort-models"
              ariaLabel="Sort models"
              value={filters.sort}
              onChange={(val) =>
                dispatch(
                  setFilterField({ key: 'sort', value: val as SortOption }),
                )
              }
              options={SORT_OPTIONS.map(({ value, label }) => ({ value, label }))}
              searchPlaceholder="Search sort order..."
              tone="alabaster"
              menuMinWidth={220}
              className="pl-9 py-3 text-xs uppercase tracking-[0.14em]"
            />
          </div>
        </div>
      </div>

      {/* Desktop Expandable Filter Matrix — Smooth Height Resize */}
      <AnimatePresence initial={false}>
        {filtersExpanded && (
          <motion.div
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block overflow-hidden"
          >
            <div className="p-6 bg-[#FAF8F4] border border-[#101010]/15 grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label htmlFor="filter-gender" className={labelClass}>
                  Gender / Board
                </label>
                <SearchableSelect
                  id="filter-gender"
                  value={filters.gender}
                  onChange={(val) =>
                    dispatch(setFilterField({ key: 'gender', value: val }))
                  }
                  options={[
                    { value: 'All', label: 'All Genders' },
                    ...genderList.map((g) => ({ value: g, label: g })),
                  ]}
                  searchPlaceholder="Search gender / board..."
                  tone="alabaster"
                />
              </div>

              <div>
                <label htmlFor="filter-category" className={labelClass}>
                  Category
                </label>
                <SearchableSelect
                  id="filter-category"
                  value={filters.category}
                  onChange={(val) =>
                    dispatch(setFilterField({ key: 'category', value: val }))
                  }
                  options={[
                    { value: 'All', label: 'All Categories' },
                    ...categoryList.map((c) => ({ value: c, label: c })),
                  ]}
                  searchPlaceholder="Search categories..."
                  tone="alabaster"
                />
              </div>

              <div>
                <label htmlFor="filter-age" className={labelClass}>
                  Age Bracket
                </label>
                <SearchableSelect
                  id="filter-age"
                  value={filters.ageGroup}
                  onChange={(val) =>
                    dispatch(setFilterField({ key: 'ageGroup', value: val }))
                  }
                  options={AGE_OPTIONS}
                  searchPlaceholder="Search age bracket..."
                  tone="alabaster"
                />
              </div>

              <div>
                <label htmlFor="filter-bodyType" className={labelClass}>
                  Body Type
                </label>
                <SearchableSelect
                  id="filter-bodyType"
                  value={filters.bodyType}
                  onChange={(val) =>
                    dispatch(setFilterField({ key: 'bodyType', value: val }))
                  }
                  options={[
                    { value: 'All', label: 'All Body Types' },
                    ...bodyTypeList.map((bt) => ({ value: bt, label: bt })),
                  ]}
                  searchPlaceholder="Search body types..."
                  tone="alabaster"
                />
              </div>

              <div>
                <label htmlFor="filter-experience" className={labelClass}>
                  Experience Level
                </label>
                <SearchableSelect
                  id="filter-experience"
                  value={filters.experienceLevel}
                  onChange={(val) =>
                    dispatch(
                      setFilterField({ key: 'experienceLevel', value: val }),
                    )
                  }
                  options={[
                    { value: 'All', label: 'All Levels' },
                    ...experienceList.map((exp) => ({ value: exp, label: exp })),
                  ]}
                  searchPlaceholder="Search experience levels..."
                  tone="alabaster"
                />
              </div>

              <div>
                <label htmlFor="filter-availability" className={labelClass}>
                  Availability
                </label>
                <SearchableSelect
                  id="filter-availability"
                  value={filters.availability}
                  onChange={(val) =>
                    dispatch(setFilterField({ key: 'availability', value: val }))
                  }
                  options={AVAILABILITY_OPTIONS}
                  searchPlaceholder="Search availability..."
                  tone="alabaster"
                />
              </div>

              <div>
                <label htmlFor="filter-location" className={labelClass}>
                  City / Base
                </label>
                <SearchableSelect
                  id="filter-location"
                  value={filters.location}
                  onChange={(val) =>
                    dispatch(setFilterField({ key: 'location', value: val }))
                  }
                  options={[
                    { value: 'All', label: 'All Locations' },
                    ...locationList.map((loc) => ({ value: loc, label: loc })),
                  ]}
                  searchPlaceholder="Search cities..."
                  tone="alabaster"
                />
              </div>

              <div>
                <span className={labelClass}>Height Range (cm)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={150}
                    max={200}
                    value={filters.heightMin}
                    onChange={(e) =>
                      dispatch(
                        setFilterField({
                          key: 'heightMin',
                          value: Number(e.target.value) || 150,
                        }),
                      )
                    }
                    aria-label="Minimum height in cm"
                    className="w-1/2 px-3 py-2 text-sm bg-[#FAF8F4] border border-[#101010]/20 tabular-nums focus:outline-none focus:border-[#632B37]"
                  />
                  <span className="text-xs text-[#101010]/40">–</span>
                  <input
                    type="number"
                    min={155}
                    max={210}
                    value={filters.heightMax}
                    onChange={(e) =>
                      dispatch(
                        setFilterField({
                          key: 'heightMax',
                          value: Number(e.target.value) || 200,
                        }),
                      )
                    }
                    aria-label="Maximum height in cm"
                    className="w-1/2 px-3 py-2 text-sm bg-[#FAF8F4] border border-[#101010]/20 tabular-nums focus:outline-none focus:border-[#632B37]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary & Animated Active Interactive Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <p className="text-[#101010]/65 uppercase tracking-[0.14em] tabular-nums">
          Showing {totalCount} {totalCount === 1 ? 'Model' : 'Models'}
        </p>

        <AnimatePresence initial={false}>
          {activeFilters.length > 0 && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap items-center gap-2"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {activeFilters.map((af) => (
                  <motion.button
                    key={af.label}
                    layout
                    type="button"
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                    onClick={af.onClear}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F4] border border-[#101010]/20 text-[#101010] hover:border-[#632B37] hover:text-[#632B37] transition-colors cursor-pointer"
                  >
                    <span>{af.label}</span>
                    <X className="w-3 h-3" />
                  </motion.button>
                ))}
              </AnimatePresence>
              <button
                type="button"
                onClick={() => dispatch(resetFilters())}
                className="px-2 py-1.5 text-xs uppercase tracking-[0.14em] text-[#632B37] underline underline-offset-4 cursor-pointer"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mobileBottomSheetUI}
    </div>
  );
}
