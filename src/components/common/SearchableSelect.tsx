import { Check, ChevronDown, Search, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

export interface SearchableSelectOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  searchable?: boolean;
  size?: 'sm' | 'md';
  tone?: 'ivory' | 'alabaster' | 'dark';
  className?: string;
  menuMinWidth?: number;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  openUpward: boolean;
}

export function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search options...',
  ariaLabel,
  disabled = false,
  searchable = true,
  size = 'md',
  tone = 'ivory',
  className = '',
  menuMinWidth = 220,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = useId();

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) ?? null,
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        (opt.hint && opt.hint.toLowerCase().includes(q)),
    );
  }, [options, query]);

  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const viewportPadding = 12;
    const width = Math.min(
      Math.max(rect.width, menuMinWidth),
      window.innerWidth - viewportPadding * 2,
    );
    const measuredHeight = menuRef.current?.offsetHeight;
    const estimatedHeight =
      measuredHeight ?? Math.min(filteredOptions.length * 36 + 64, 300);
    const gap = 4;

    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUpward =
      spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

    const rawTop = openUpward
      ? rect.top - estimatedHeight - gap
      : rect.bottom + gap;
    const top = Math.max(
      viewportPadding,
      Math.min(rawTop, window.innerHeight - estimatedHeight - viewportPadding),
    );

    const left = Math.max(
      viewportPadding,
      Math.min(rect.left, window.innerWidth - width - viewportPadding),
    );

    setPosition({ top, left, width, openUpward });
  }, [filteredOptions.length, menuMinWidth]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition, filteredOptions.length]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const idx = Math.max(
      0,
      options.findIndex((opt) => opt.value === value && !opt.disabled),
    );
    setActiveIndex(idx);

    const frame = window.requestAnimationFrame(() => {
      if (searchable) {
        searchInputRef.current?.focus();
      }
      updatePosition();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, searchable]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleResize = () => setOpen(false);

    const handleScroll = (e: Event) => {
      const target = e.target as Node | null;
      if (target && menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelectOption = (opt: SearchableSelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDownInMenu = (e: React.KeyboardEvent) => {
    if (filteredOptions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => {
        let next = (prev + 1) % filteredOptions.length;
        let guard = 0;
        while (filteredOptions[next]?.disabled && guard < filteredOptions.length) {
          next = (next + 1) % filteredOptions.length;
          guard++;
        }
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => {
        let next =
          (prev - 1 + filteredOptions.length) % filteredOptions.length;
        let guard = 0;
        while (filteredOptions[next]?.disabled && guard < filteredOptions.length) {
          next = (next - 1 + filteredOptions.length) % filteredOptions.length;
          guard++;
        }
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = filteredOptions[activeIndex];
      if (chosen && !chosen.disabled) {
        handleSelectOption(chosen);
      }
    }
  };

  const isDark = tone === 'dark';

  const triggerToneClass = isDark
    ? 'bg-[#181715] border-white/15 text-[#FAF8F4] hover:border-[#B6A48D] focus:border-[#B6A48D]'
    : tone === 'alabaster'
      ? 'bg-[#FAF8F4] border-[#101010]/20 text-[#101010] hover:border-[#101010] focus:border-[#632B37]'
      : 'bg-[#F5F1EA] border-[#101010]/20 text-[#101010] hover:border-[#101010] focus:border-[#632B37]';

  const triggerSizeClass =
    size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2.5 text-sm';

  const menuContainerToneClass = isDark
    ? 'bg-[#181715] text-[#FAF8F4] border-white/20'
    : 'bg-[#FAF8F4] text-[#101010] border-[#101010]/20';

  const searchInputToneClass = isDark
    ? 'bg-[#101010] border-white/15 text-[#FAF8F4] placeholder:text-white/35 focus:border-[#B6A48D]'
    : 'bg-[#F5F1EA] border-[#101010]/15 text-[#101010] placeholder:text-[#101010]/40 focus:border-[#632B37]';

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full inline-flex items-center justify-between gap-2 border text-left transition-colors focus:outline-none disabled:opacity-50 ${triggerToneClass} ${triggerSizeClass} ${className}`}
      >
        <span className="truncate">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className={isDark ? 'text-white/40' : 'text-[#101010]/45'}>
              {placeholder}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 opacity-65 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={menuRef}
                onKeyDown={handleKeyDownInMenu}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.97,
                        y: position?.openUpward ? 6 : -6,
                      }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.97,
                        y: position?.openUpward ? 4 : -4,
                      }
                }
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'fixed',
                  top: position?.top ?? -9999,
                  left: position?.left ?? -9999,
                  width: position?.width ?? menuMinWidth,
                  zIndex: 85,
                  transformOrigin: position?.openUpward ? 'bottom center' : 'top center',
                }}
                className={`border shadow-xl flex flex-col ${menuContainerToneClass}`}
              >
            {searchable && (
              <div
                className={`p-2 border-b ${
                  isDark ? 'border-white/10' : 'border-[#101010]/10'
                }`}
              >
                <div className="relative">
                  <Search
                    className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isDark ? 'text-white/40' : 'text-[#101010]/45'
                    }`}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    className={`w-full pl-8 pr-7 py-1.5 text-xs border focus:outline-none ${searchInputToneClass}`}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear option search"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 ${
                        isDark
                          ? 'text-white/45 hover:text-[#FAF8F4]'
                          : 'text-[#101010]/45 hover:text-[#101010]'
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <ul
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel || placeholder}
              className="max-h-60 overflow-y-auto overscroll-y-contain py-1"
            >
              {filteredOptions.length === 0 ? (
                <li
                  className={`px-3.5 py-3 text-xs text-center ${
                    isDark ? 'text-white/50' : 'text-[#101010]/55'
                  }`}
                >
                  No matching options
                </li>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isHighlighted = idx === activeIndex;

                  return (
                    <li
                      key={`${opt.value}-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => handleSelectOption(opt)}
                      className={`px-3 py-2 text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        opt.disabled
                          ? 'opacity-40 cursor-not-allowed'
                          : isSelected
                            ? isDark
                              ? 'bg-[#632B37] text-[#FAF8F4]'
                              : 'bg-[#101010] text-[#FAF8F4]'
                            : isHighlighted
                              ? isDark
                                ? 'bg-white/10 text-[#FAF8F4]'
                                : 'bg-[#F5F1EA] text-[#101010]'
                              : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{opt.label}</p>
                        {opt.hint && (
                          <p className="text-[11px] opacity-65 truncate">
                            {opt.hint}
                          </p>
                        )}
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </li>
                  );
                })
              )}
            </ul>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

export interface SearchableMultiSelectProps {
  id?: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  searchable?: boolean;
  size?: 'sm' | 'md';
  tone?: 'ivory' | 'alabaster' | 'dark';
  className?: string;
  menuMinWidth?: number;
}

export function SearchableMultiSelect({
  id,
  values,
  onChange,
  options,
  placeholder = 'Select one or more options',
  searchPlaceholder = 'Search options...',
  ariaLabel,
  disabled = false,
  searchable = true,
  size = 'md',
  tone = 'ivory',
  className = '',
  menuMinWidth = 240,
}: SearchableMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = useId();

  const selectedOptions = useMemo(
    () =>
      values
        .map((v) => options.find((opt) => opt.value === v))
        .filter((opt): opt is SearchableSelectOption => Boolean(opt)),
    [options, values],
  );

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        (opt.hint && opt.hint.toLowerCase().includes(q)),
    );
  }, [options, query]);

  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const viewportPadding = 12;
    const width = Math.min(
      Math.max(rect.width, menuMinWidth),
      window.innerWidth - viewportPadding * 2,
    );
    const measuredHeight = menuRef.current?.offsetHeight;
    const estimatedHeight =
      measuredHeight ?? Math.min(filteredOptions.length * 40 + 88, 330);
    const gap = 4;

    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUpward =
      spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

    const rawTop = openUpward
      ? rect.top - estimatedHeight - gap
      : rect.bottom + gap;
    const top = Math.max(
      viewportPadding,
      Math.min(rawTop, window.innerHeight - estimatedHeight - viewportPadding),
    );

    const left = Math.max(
      viewportPadding,
      Math.min(rect.left, window.innerWidth - width - viewportPadding),
    );

    setPosition({ top, left, width, openUpward });
  }, [filteredOptions.length, menuMinWidth]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition, filteredOptions.length]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);

    const frame = window.requestAnimationFrame(() => {
      if (searchable) {
        searchInputRef.current?.focus();
      }
      updatePosition();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, searchable]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleResize = () => setOpen(false);

    const handleScroll = (e: Event) => {
      const target = e.target as Node | null;
      if (target && menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const toggleOption = (opt: SearchableSelectOption) => {
    if (opt.disabled) return;
    if (values.includes(opt.value)) {
      onChange(values.filter((v) => v !== opt.value));
    } else {
      onChange([...values, opt.value]);
    }
  };

  const handleKeyDownInMenu = (e: React.KeyboardEvent) => {
    if (filteredOptions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => {
        let next = (prev + 1) % filteredOptions.length;
        let guard = 0;
        while (filteredOptions[next]?.disabled && guard < filteredOptions.length) {
          next = (next + 1) % filteredOptions.length;
          guard++;
        }
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => {
        let next =
          (prev - 1 + filteredOptions.length) % filteredOptions.length;
        let guard = 0;
        while (filteredOptions[next]?.disabled && guard < filteredOptions.length) {
          next = (next - 1 + filteredOptions.length) % filteredOptions.length;
          guard++;
        }
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = filteredOptions[activeIndex];
      if (chosen && !chosen.disabled) {
        toggleOption(chosen);
      }
    }
  };

  const isDark = tone === 'dark';

  const triggerToneClass = isDark
    ? 'bg-[#181715] border-white/15 text-[#FAF8F4] hover:border-[#B6A48D] focus:border-[#B6A48D]'
    : tone === 'alabaster'
      ? 'bg-[#FAF8F4] border-[#101010]/20 text-[#101010] hover:border-[#101010] focus:border-[#632B37]'
      : 'bg-[#F5F1EA] border-[#101010]/20 text-[#101010] hover:border-[#101010] focus:border-[#632B37]';

  const triggerSizeClass =
    size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2.5 text-sm';

  const menuContainerToneClass = isDark
    ? 'bg-[#181715] text-[#FAF8F4] border-white/20'
    : 'bg-[#FAF8F4] text-[#101010] border-[#101010]/20';

  const searchInputToneClass = isDark
    ? 'bg-[#101010] border-white/15 text-[#FAF8F4] placeholder:text-white/35 focus:border-[#B6A48D]'
    : 'bg-[#F5F1EA] border-[#101010]/15 text-[#101010] placeholder:text-[#101010]/40 focus:border-[#632B37]';

  const triggerLabel =
    selectedOptions.length === 0
      ? null
      : selectedOptions.length <= 2
        ? selectedOptions.map((o) => o.label).join(', ')
        : `${selectedOptions[0].label}, ${selectedOptions[1].label} +${selectedOptions.length - 2}`;

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full inline-flex items-center justify-between gap-2 border text-left transition-colors focus:outline-none disabled:opacity-50 ${triggerToneClass} ${triggerSizeClass} ${className}`}
      >
        <span className="truncate">
          {triggerLabel ?? (
            <span className={isDark ? 'text-white/45' : 'text-[#101010]/50'}>
              {placeholder}
            </span>
          )}
        </span>
        <span className="inline-flex items-center gap-1.5 shrink-0">
          {values.length > 0 && (
            <span
              className={`font-mono text-[11px] tabular-nums px-1.5 py-0.5 ${
                isDark
                  ? 'bg-[#632B37] text-[#FAF8F4]'
                  : 'bg-[#101010] text-[#FAF8F4]'
              }`}
            >
              {values.length}
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 opacity-65 transition-transform duration-150 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={menuRef}
                onKeyDown={handleKeyDownInMenu}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.97,
                        y: position?.openUpward ? 6 : -6,
                      }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.97,
                        y: position?.openUpward ? 4 : -4,
                      }
                }
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'fixed',
                  top: position?.top ?? -9999,
                  left: position?.left ?? -9999,
                  width: position?.width ?? menuMinWidth,
                  zIndex: 85,
                  transformOrigin: position?.openUpward ? 'bottom center' : 'top center',
                }}
                className={`border shadow-xl flex flex-col ${menuContainerToneClass}`}
              >
            {searchable && (
              <div
                className={`p-2 border-b ${
                  isDark ? 'border-white/10' : 'border-[#101010]/10'
                }`}
              >
                <div className="relative">
                  <Search
                    className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isDark ? 'text-white/40' : 'text-[#101010]/45'
                    }`}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    className={`w-full pl-8 pr-7 py-1.5 text-xs border focus:outline-none ${searchInputToneClass}`}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear option search"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 ${
                        isDark
                          ? 'text-white/45 hover:text-[#FAF8F4]'
                          : 'text-[#101010]/45 hover:text-[#101010]'
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div
              className={`px-3 py-1.5 border-b flex items-center justify-between text-[11px] uppercase tracking-[0.14em] ${
                isDark
                  ? 'border-white/10 text-white/60'
                  : 'border-[#101010]/10 text-[#101010]/60'
              }`}
            >
              <span className="font-mono tabular-nums">
                {values.length} selected
              </span>
              <div className="flex items-center gap-3">
                {values.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange([])}
                    className="underline underline-offset-2 hover:text-[#632B37] cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className="font-medium text-[#632B37] hover:underline cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>

            <ul
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
              aria-label={ariaLabel || placeholder}
              className="max-h-60 overflow-y-auto overscroll-y-contain py-1"
            >
              {filteredOptions.length === 0 ? (
                <li
                  className={`px-3.5 py-3 text-xs text-center ${
                    isDark ? 'text-white/50' : 'text-[#101010]/55'
                  }`}
                >
                  No matching options
                </li>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = values.includes(opt.value);
                  const isHighlighted = idx === activeIndex;

                  return (
                    <li
                      key={`${opt.value}-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => toggleOption(opt)}
                      className={`px-3 py-2 text-xs flex items-center justify-between gap-2.5 cursor-pointer transition-colors ${
                        opt.disabled
                          ? 'opacity-40 cursor-not-allowed'
                          : isSelected
                            ? isDark
                              ? 'bg-[#632B37]/40 text-[#FAF8F4]'
                              : 'bg-[#101010]/[0.06] text-[#101010]'
                            : isHighlighted
                              ? isDark
                                ? 'bg-white/10 text-[#FAF8F4]'
                                : 'bg-[#F5F1EA] text-[#101010]'
                              : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{opt.label}</p>
                        {opt.hint && (
                          <p className="text-[11px] opacity-65 truncate">
                            {opt.hint}
                          </p>
                        )}
                      </div>
                      <span
                        className={`w-4 h-4 shrink-0 border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#632B37] border-[#632B37] text-[#FAF8F4]'
                            : isDark
                              ? 'border-white/30'
                              : 'border-[#101010]/25'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

