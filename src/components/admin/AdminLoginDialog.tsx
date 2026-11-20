import { ArrowUpRight, Lock, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { closeAdminLoginDialog } from '../../features/admin/adminSlice.ts';
import { AdminLoginForm } from './AdminLoginForm.tsx';

export function AdminLoginDialog() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const { loginDialogOpen, loginRedirectTo } = useAppSelector((s) => s.admin);

  useEffect(() => {
    if (!loginDialogOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(closeAdminLoginDialog());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [loginDialogOpen, dispatch]);

  const handleClose = () => {
    dispatch(closeAdminLoginDialog());
  };

  return (
    <AnimatePresence>
      {loginDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-login-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#101010]/70 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 12, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.98 }
            }
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md bg-[#FAF8F4] text-[#101010] border border-[#101010]/20 max-h-[92dvh] overflow-y-auto"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-[#101010]/12 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#632B37]">
                  <Lock className="w-3 h-3" />
                  <span>House of Fashion Nepal · Studio Access</span>
                </p>
                <h2
                  id="admin-login-dialog-title"
                  className="font-serif text-3xl leading-none text-[#101010]"
                >
                  Admin Sign In
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close admin login dialog"
                className="p-2 -mr-2 text-[#101010]/60 hover:text-[#101010] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm text-[#101010]/70 leading-relaxed">
                Sign in with your agency account to access the Nepal talent roster, bookings desk, and scouting queue.
              </p>

              <AdminLoginForm
                idPrefix="admin-dialog"
                onSuccess={() => {
                  const target = loginRedirectTo || '/admin';
                  dispatch(closeAdminLoginDialog());
                  navigate(target);
                }}
              />

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#101010]/60">
                <span>Prefer full-screen view?</span>
                <Link
                  to="/admin/login"
                  state={{ from: loginRedirectTo || '/admin' }}
                  onClick={handleClose}
                  className="inline-flex items-center gap-1 text-[#101010] hover:text-[#632B37] transition-colors underline underline-offset-4 whitespace-nowrap"
                >
                  <span>Open Login Page</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
