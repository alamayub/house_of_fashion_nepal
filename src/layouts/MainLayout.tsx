import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AdminLoginDialog } from '../components/admin/AdminLoginDialog.tsx';
import { Footer } from '../components/common/Footer.tsx';
import { Loader } from '../components/common/Loader.tsx';
import { Navbar } from '../components/common/Navbar.tsx';

function FrozenOutlet() {
  const outlet = useOutlet();
  const [capturedOutlet] = useState(outlet);

  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F1EA]">
          <Loader label="Preparing House of Fashion Nepal" />
        </div>
      }
    >
      {capturedOutlet}
    </Suspense>
  );
}

export function MainLayout() {
  const { pathname, hash } = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const handleExitComplete = useCallback(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  useEffect(() => {
    if (prefersReducedMotion && !hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, prefersReducedMotion]);

  useEffect(() => {
    if (!hash) return;
    document.querySelector(hash)?.scrollIntoView();
  }, [hash, pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA] text-[#101010]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#101010] focus:text-[#FAF8F4] focus:text-xs focus:uppercase focus:tracking-[0.16em]"
      >
        Skip to main content
      </a>
      <Navbar />

      <main id="main-content" className="flex-1 relative">
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={handleExitComplete}
        >
          <motion.div
            key={pathname}
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
            }
            animate={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
            }
            exit={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.34,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            <FrozenOutlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <AdminLoginDialog />
    </div>
  );
}
