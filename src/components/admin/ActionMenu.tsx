import { ChevronDown, type LucideIcon, MoreHorizontal } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  to?: string;
  disabled?: boolean;
  variant?: 'default' | 'danger';
  dividerBefore?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  label?: string;
  ariaLabel?: string;
  triggerVariant?: 'button' | 'icon' | 'dark';
  align?: 'left' | 'right';
  disabled?: boolean;
}

interface MenuPosition {
  top: number;
  left: number;
  placement: 'bottom' | 'top';
}

export function ActionMenu({
  items,
  label = 'Actions',
  ariaLabel,
  triggerVariant = 'button',
  align = 'right',
  disabled = false,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth ?? 216;
    const menuHeight = menuRef.current?.offsetHeight ?? items.length * 38 + 16;
    const gap = 6;
    const viewportPadding = 12;

    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const placement: 'bottom' | 'top' =
      spaceBelow < menuHeight && spaceAbove > spaceBelow ? 'top' : 'bottom';

    const rawTop =
      placement === 'bottom' ? rect.bottom + gap : rect.top - menuHeight - gap;
    const top = Math.max(
      viewportPadding,
      Math.min(rawTop, window.innerHeight - menuHeight - viewportPadding),
    );

    const rawLeft = align === 'right' ? rect.right - menuWidth : rect.left;
    const left = Math.max(
      viewportPadding,
      Math.min(rawLeft, window.innerWidth - menuWidth - viewportPadding),
    );

    setPosition({ top, left, placement });
  }, [align, items.length]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

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
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleScrollOrResize = () => {
      setOpen(false);
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [open]);

  if (items.length === 0) return null;

  const triggerClass =
    triggerVariant === 'icon'
      ? `inline-flex items-center justify-center w-8 h-8 border transition-colors ${
          open
            ? 'border-[#101010] bg-[#101010] text-[#FAF8F4]'
            : 'border-[#101010]/20 bg-[#F5F1EA] text-[#101010] hover:border-[#101010]'
        }`
      : triggerVariant === 'dark'
        ? `inline-flex items-center gap-1.5 px-3.5 py-2 border text-xs uppercase tracking-[0.14em] transition-colors whitespace-nowrap shrink-0 ${
            open
              ? 'border-[#FAF8F4] bg-[#FAF8F4] text-[#101010]'
              : 'border-white/25 bg-white/10 text-[#FAF8F4] hover:bg-[#FAF8F4] hover:text-[#101010]'
          }`
        : `inline-flex items-center gap-1.5 px-3 py-1.5 border text-[11px] uppercase tracking-[0.14em] font-medium transition-colors whitespace-nowrap shrink-0 ${
            open
              ? 'border-[#101010] bg-[#101010] text-[#FAF8F4]'
              : 'border-[#101010]/20 bg-[#F5F1EA] text-[#101010] hover:border-[#101010]'
          }`;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={ariaLabel || label}
        onClick={() => setOpen((prev) => !prev)}
        className={`${triggerClass} disabled:opacity-45`}
      >
        {triggerVariant === 'icon' ? (
          <MoreHorizontal className="w-4 h-4" />
        ) : (
          <>
            <span>{label}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-150 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </>
        )}
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={menuRef}
                id={menuId}
                role="menu"
                aria-label={ariaLabel || label}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.96,
                        y: position?.placement === 'top' ? 6 : -6,
                      }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.96,
                        y: position?.placement === 'top' ? 4 : -4,
                      }
                }
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'fixed',
                  top: position?.top ?? -9999,
                  left: position?.left ?? -9999,
                  zIndex: 80,
                  transformOrigin:
                    position?.placement === 'top'
                      ? align === 'right'
                        ? 'bottom right'
                        : 'bottom left'
                      : align === 'right'
                        ? 'top right'
                        : 'top left',
                }}
                className="min-w-[210px] max-w-[260px] bg-[#FAF8F4] text-[#101010] border border-[#101010]/20 shadow-xl py-1.5"
              >
            {items.map((item) => {
              const Icon = item.icon;
              const isDanger = item.variant === 'danger';
              const itemClasses = `w-full px-3.5 py-2 text-left text-xs flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                item.disabled
                  ? 'opacity-45 cursor-not-allowed'
                  : isDanger
                    ? 'text-[#632B37] hover:bg-[#632B37] hover:text-[#FAF8F4]'
                    : 'text-[#101010] hover:bg-[#101010] hover:text-[#FAF8F4]'
              }`;

              const divider = item.dividerBefore && (
                <div
                  key={`${item.id}-div`}
                  role="separator"
                  className="my-1 border-t border-[#101010]/10"
                />
              );

              if (item.to && !item.disabled) {
                return (
                  <div key={item.id}>
                    {divider}
                    <Link
                      to={item.to}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className={itemClasses}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </div>
                );
              }

              if (item.href && !item.disabled) {
                return (
                  <div key={item.id}>
                    {divider}
                    <a
                      href={item.href}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className={itemClasses}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </a>
                  </div>
                );
              }

              return (
                <div key={item.id}>
                  {divider}
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      setOpen(false);
                      item.onClick?.();
                    }}
                    className={itemClasses}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                    <span className="truncate">{item.label}</span>
                  </button>
                </div>
              );
            })}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
