import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { openAdminLoginDialog } from '../../features/admin/adminSlice.ts';
import { setMobileMenuOpen } from '../../features/ui/uiSlice.ts';
import { SocialLinks } from './SocialLinks.tsx';

const NAV_ITEMS = [
  { label: 'Models', to: '/models' },
  { label: 'Events', to: '/events' },
  { label: 'Services', to: '/services' },
  { label: 'Journal', to: '/blog' },
  { label: 'Become a Model', to: '/become-a-model' },
];

export function Navbar() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const mobileMenuOpen = useAppSelector((s) => s.ui.mobileMenuOpen);
  const isAdminSignedIn = useAppSelector((s) => Boolean(s.admin.authSession));
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  const isHomeHero = pathname === '/' && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    dispatch(setMobileMenuOpen(false));
  }, [pathname, dispatch]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(setMobileMenuOpen(false));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen, dispatch]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
          isHomeHero
            ? 'bg-transparent text-[#FAF8F4] border-b border-white/10'
            : 'bg-[#F5F1EA]/95 backdrop-blur-md text-[#101010] border-b border-[#101010]/10'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-16 md:h-20 flex items-center justify-between gap-3 lg:gap-5 xl:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            className="font-serif text-sm sm:text-base lg:text-lg xl:text-xl tracking-[0.1em] sm:tracking-[0.12em] font-semibold uppercase whitespace-nowrap shrink-0"
          >
            House of Fashion Nepal
          </Link>

          {/* Zone 2: 5 Single-line Nav Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-5 xl:gap-7"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative py-1 text-xs uppercase tracking-[0.16em] font-medium whitespace-nowrap shrink-0 transition-opacity duration-150 ${
                    isActive ? 'opacity-100' : 'opacity-75 hover:opacity-100'
                  } group`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span
                      className={`absolute left-0 right-0 -bottom-0.5 h-px bg-current transition-transform duration-200 origin-left ${
                        isActive
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Drawer Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/book"
              className={`hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-[0.16em] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 border ${
                isHomeHero
                  ? 'border-[#FAF8F4]/70 text-[#FAF8F4] hover:bg-[#FAF8F4] hover:text-[#101010]'
                  : 'border-[#101010] bg-[#101010] text-[#FAF8F4] hover:bg-[#632B37] hover:border-[#632B37]'
              }`}
            >
              Book a Model
            </Link>

            <motion.button
              type="button"
              whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
              onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="nav-close"
                    initial={prefersReducedMotion ? false : { rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.16 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="nav-open"
                    initial={prefersReducedMotion ? false : { rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.16 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-[#101010] text-[#FAF8F4] pt-20 sm:pt-24 pb-10 px-5 sm:px-6 flex flex-col justify-between lg:hidden overflow-y-auto"
          >
            <motion.nav
              aria-label="Mobile navigation"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col divide-y divide-white/10"
            >
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `py-3 sm:py-3.5 font-serif text-2xl sm:text-3xl tracking-wide transition-colors ${
                    isActive ? 'text-[#B6A48D]' : 'text-[#FAF8F4]'
                  }`
                }
              >
                Home
              </NavLink>
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `py-3 sm:py-3.5 font-serif text-2xl sm:text-3xl tracking-wide transition-colors ${
                      isActive ? 'text-[#B6A48D]' : 'text-[#FAF8F4]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `py-3 sm:py-3.5 font-serif text-2xl sm:text-3xl tracking-wide transition-colors ${
                    isActive ? 'text-[#B6A48D]' : 'text-[#FAF8F4]'
                  }`
                }
              >
                About Agency
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `py-3 sm:py-3.5 font-serif text-2xl sm:text-3xl tracking-wide transition-colors ${
                    isActive ? 'text-[#B6A48D]' : 'text-[#FAF8F4]'
                  }`
                }
              >
                Clients &amp; Projects
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `py-3 sm:py-3.5 font-serif text-2xl sm:text-3xl tracking-wide transition-colors ${
                    isActive ? 'text-[#B6A48D]' : 'text-[#FAF8F4]'
                  }`
                }
              >
                Contact
              </NavLink>
              {isAdminSignedIn ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `py-3 sm:py-3.5 font-serif text-2xl sm:text-3xl tracking-wide transition-colors ${
                      isActive ? 'text-[#B6A48D]' : 'text-[#FAF8F4]'
                    }`
                  }
                >
                  Admin Panel
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setMobileMenuOpen(false));
                    dispatch(openAdminLoginDialog('/admin'));
                  }}
                  className="py-3 sm:py-3.5 font-serif text-2xl sm:text-3xl tracking-wide text-left text-[#FAF8F4] hover:text-[#B6A48D] transition-colors cursor-pointer"
                >
                  Admin Panel
                </button>
              )}
            </motion.nav>

            <div className="pt-8 space-y-6 border-t border-white/10">
              <Link
                to="/book"
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className="block w-full py-3.5 text-center bg-[#FAF8F4] text-[#101010] text-xs uppercase tracking-[0.18em] font-medium"
              >
                Book a Model
              </Link>
              <div className="flex flex-col gap-4">
                <SocialLinks variant="icons" tone="dark" />
                <div className="text-xs text-[#B6A48D] space-y-1">
                  <p>Jhamsikhel, Lalitpur · Kathmandu Valley, Nepal</p>
                  <p>bookings@houseoffashionnepal.com.np</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
