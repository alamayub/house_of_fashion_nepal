import { ArrowLeft, Lock } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks.ts';
import { AdminLoginForm } from '../components/admin/AdminLoginForm.tsx';
import { EditorialImage } from '../components/common/EditorialImage.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { AGENCY_ASSETS } from '../data/assets.ts';

interface LoginLocationState {
  from?: string;
}

export default function AdminLogin() {
  const authSession = useAppSelector((s) => s.admin.authSession);
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LoginLocationState | null;
  const redirectTarget =
    state?.from && state.from.startsWith('/admin') && state.from !== '/admin/login'
      ? state.from
      : '/admin';

  if (authSession) {
    return <Navigate to={redirectTarget} replace />;
  }

  return (
    <div className="min-h-dvh w-full bg-[#F5F1EA] text-[#101010] grid grid-cols-1 lg:grid-cols-12">
      <SeoHead
        title="Admin Sign In — House of Fashion Nepal"
        description="Authorized studio sign-in for House of Fashion Nepal talent roster, client bookings, and scouting operations."
        noIndex
      />

      {/* Left Editorial Identity Column */}
      <aside className="relative hidden lg:flex lg:col-span-5 xl:col-span-6 bg-[#101010] text-[#FAF8F4] flex-col justify-between overflow-hidden">
        <div className="absolute inset-0">
          <EditorialImage
            src={AGENCY_ASSETS.AGENCY_STUDIO}
            alt="House of Fashion Nepal daylight casting studio"
            priority
            className="w-full h-full object-cover opacity-55"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/60 to-[#101010]/45"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 p-10 xl:p-14 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="font-serif text-lg xl:text-xl tracking-[0.12em] uppercase font-semibold text-[#FAF8F4]"
          >
            House of Fashion Nepal
          </Link>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#B6A48D] shrink-0">
            Studio Portal
          </span>
        </div>

        <div className="relative z-10 p-10 xl:p-14 space-y-6 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#B6A48D]">
            Authorized Representation Desk
          </p>
          <h1 className="font-serif text-4xl xl:text-5xl leading-[1.08] text-balance text-[#FAF8F4]">
            Talent roster, bookings, and scouting across Nepal.
          </h1>
          <p className="text-sm text-[#FAF8F4]/75 leading-relaxed">
            Manage editorial and commercial model boards, review incoming client casting briefs, and onboard new faces from across all seven provinces.
          </p>
          <div className="pt-4 border-t border-white/15 flex items-center gap-4 text-xs text-[#FAF8F4]/60">
            <span>Jhamsikhel Atelier Wing, Lalitpur</span>
            <span aria-hidden="true">·</span>
            <span>Nepal</span>
          </div>
        </div>
      </aside>

      {/* Right Sign-In Column */}
      <main className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#101010]/65 hover:text-[#101010] transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </Link>

          <Link
            to="/"
            className="lg:hidden font-serif text-sm sm:text-base tracking-[0.1em] uppercase font-semibold text-[#101010]"
          >
            House of Fashion Nepal
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto py-12 space-y-8">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#632B37]">
              <Lock className="w-3 h-3" />
              <span>House of Fashion Nepal · Admin</span>
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-none text-[#101010]">
              Sign In
            </h2>
            <p className="text-sm text-[#101010]/65 leading-relaxed">
              Enter your studio credentials to open the internal bookings and representation workspace.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-[#FAF8F4] border border-[#101010]/15">
            <AdminLoginForm
              idPrefix="admin-page"
              onSuccess={() => {
                navigate(redirectTarget, { replace: true });
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 text-xs text-[#101010]/50">
          <span>House of Fashion Nepal Pvt. Ltd.</span>
          <span>Internal Desk Access</span>
        </div>
      </main>
    </div>
  );
}
