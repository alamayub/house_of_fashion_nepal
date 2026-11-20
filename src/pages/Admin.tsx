import {
  Briefcase,
  Calendar,
  CalendarRange,
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Plus,
  RotateCcw,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import type { AdminOutletContext } from '../components/admin/AdminRouteViews.tsx';
import { DeleteModelDialog } from '../components/admin/DeleteModelDialog.tsx';
import { ModelEditorModal } from '../components/admin/ModelEditorModal.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import {
  clearAdminSession,
  closeModelEditor,
  openCreateModelEditor,
  setDeleteTargetId,
} from '../features/admin/adminSlice.ts';
import { useUpdateApplicationMutation } from '../features/applications/applicationsApi.ts';
import {
  useGetAdminOverviewQuery,
  useResetAdminDemoDataMutation,
} from '../features/bookings/bookingsApi.ts';
import {
  useGetEventRegistrationsQuery,
  useGetEventsQuery,
} from '../features/events/eventsApi.ts';
import { useGetModelsQuery } from '../features/models/modelsApi.ts';
import { useGetClientsQuery, useGetProjectsQuery } from '../features/projects/projectsApi.ts';
import { useGetTestimonialsQuery } from '../features/testimonials/testimonialsApi.ts';

interface AdminRouteMeta {
  breadcrumb: string;
  heading: string;
}

const ROUTE_META: Record<string, AdminRouteMeta> = {
  '/admin': {
    breadcrumb: 'Overview',
    heading: 'Studio Admin Overview',
  },
  '/admin/models': {
    breadcrumb: 'Models Management',
    heading: 'Talent Roster Management',
  },
  '/admin/clients': {
    breadcrumb: 'Clients',
    heading: 'Client & Brand Houses',
  },
  '/admin/projects': {
    breadcrumb: 'Projects',
    heading: 'Campaigns & Productions',
  },
  '/admin/events': {
    breadcrumb: 'Events & Shows',
    heading: 'Hosted Events, Shows & Auditions',
  },
  '/admin/bookings': {
    breadcrumb: 'Bookings',
    heading: 'Client Booking Desk',
  },
  '/admin/enquiries': {
    breadcrumb: 'Enquiries',
    heading: 'General & Casting Enquiries',
  },
  '/admin/applications': {
    breadcrumb: 'New Models',
    heading: 'New Model Applications',
  },
  '/admin/testimonials': {
    breadcrumb: 'Testimonials',
    heading: 'Client & Talent Endorsements',
  },
};

function resolveAdminRouteMeta(pathname: string): AdminRouteMeta {
  const normalized = pathname.replace(/\/+$/, '') || '/admin';
  return ROUTE_META[normalized] || ROUTE_META['/admin'];
}

export default function Admin() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    authSession,
    editorOpen,
    editingModelId,
    onboardingApplication,
    deleteTargetId,
  } = useAppSelector((s) => s.admin);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { data: overview, isLoading: overviewLoading } = useGetAdminOverviewQuery();
  const { data: modelsData, isLoading: modelsLoading } = useGetModelsQuery({
    limit: 50,
    sort: 'newest',
    includeAllStatuses: true,
  });
  const { data: clients = [] } = useGetClientsQuery();
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: events = [], isLoading: eventsLoading } = useGetEventsQuery();
  const { data: eventRegistrations = [], isLoading: registrationsLoading } =
    useGetEventRegistrationsQuery();
  const { data: testimonials = [] } = useGetTestimonialsQuery();

  const [updateApplication] = useUpdateApplicationMutation();
  const [resetDemoData, { isLoading: resetting }] = useResetAdminDemoDataMutation();

  const allModels = modelsData?.data || [];
  const bookings = overview?.bookings || [];
  const applications = overview?.applications || [];
  const contacts = overview?.contacts || [];

  const editingModel = allModels.find((m) => m.id === editingModelId) || null;
  const deleteTargetModel = allModels.find((m) => m.id === deleteTargetId) || null;

  const navItems: Array<{
    to: string;
    end?: boolean;
    label: string;
    count?: number;
    icon: typeof LayoutDashboard;
  }> = [
    { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/models', label: 'Models', count: allModels.length, icon: Users },
    { to: '/admin/clients', label: 'Clients', count: clients.length, icon: Briefcase },
    { to: '/admin/projects', label: 'Projects', count: projects.length, icon: FolderKanban },
    { to: '/admin/events', label: 'Events', count: events.length, icon: CalendarRange },
    { to: '/admin/bookings', label: 'Bookings', count: bookings.length, icon: Calendar },
    { to: '/admin/enquiries', label: 'Enquiries', count: contacts.length, icon: Inbox },
    { to: '/admin/applications', label: 'New Models', count: applications.length, icon: UserPlus },
    {
      to: '/admin/testimonials',
      label: 'Testimonials',
      count: testimonials.length,
      icon: MessageSquareQuote,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  const handleReset = async () => {
    try {
      await resetDemoData().unwrap();
      setConfirmReset(false);
    } catch {
      setConfirmReset(false);
    }
  };

  const handleSignOut = () => {
    dispatch(clearAdminSession());
    navigate('/admin/login', { replace: true });
  };

  const activeMeta = resolveAdminRouteMeta(location.pathname);

  const outletContext: AdminOutletContext = {
    models: allModels,
    clients,
    projects,
    events,
    eventRegistrations,
    testimonials,
    bookings,
    applications,
    contacts,
    modelsLoading,
    overviewLoading,
    eventsLoading: eventsLoading || registrationsLoading,
  };

  return (
    <div
      data-admin-workspace
      className="min-h-dvh w-full bg-[#F5F1EA] text-[#101010] flex"
    >
      <SeoHead
        title={`${activeMeta.heading} — House of Fashion Nepal Admin`}
        description="Internal House of Fashion Nepal admin panel for models management, clients, projects, enquiries, bookings, and new model applications."
        noIndex
      />

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-[#101010]/60 backdrop-blur-[2px] lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Left Workspace Sidebar */}
      <aside
        aria-label="Admin workspace navigation"
        className={`fixed lg:sticky top-0 left-0 z-50 h-dvh w-64 shrink-0 bg-[#101010] text-[#FAF8F4] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Workspace Identity */}
          <div className="h-16 shrink-0 px-6 border-b border-white/10 flex items-center justify-between gap-3">
            <Link
              to="/admin"
              className="font-serif text-sm tracking-[0.12em] uppercase font-semibold text-[#FAF8F4] leading-tight"
            >
              House of Fashion
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close admin menu"
              className="lg:hidden p-1.5 text-[#FAF8F4]/70 hover:text-[#FAF8F4]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="flex-1 min-h-0 p-4 space-y-1 overflow-y-auto overscroll-y-contain">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left text-xs uppercase tracking-[0.14em] transition-colors ${
                      isActive
                        ? 'bg-[#632B37] text-[#FAF8F4]'
                        : 'text-[#FAF8F4]/70 hover:bg-white/5 hover:text-[#FAF8F4]'
                    }`
                  }
                >
                  <span className="inline-flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className="font-mono text-[11px] tabular-nums opacity-80">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Workspace Utilities */}
        <div className="shrink-0 p-4 border-t border-white/10 space-y-2 text-xs">
          {authSession && (
            <div className="px-3.5 py-2.5 mb-1 border-b border-white/10 space-y-0.5">
              <p className="text-xs font-medium text-[#FAF8F4] truncate">
                {authSession.name}
              </p>
              <p className="text-[11px] text-[#B6A48D] truncate">
                {authSession.role}
              </p>
            </div>
          )}

          <Link
            to="/models"
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-[#FAF8F4]/75 hover:bg-white/5 hover:text-[#FAF8F4] transition-colors"
          >
            <span>Public Directory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/"
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-[#FAF8F4]/75 hover:bg-white/5 hover:text-[#FAF8F4] transition-colors"
          >
            <span>Back to Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <AnimatePresence mode="wait" initial={false}>
            {!confirmReset ? (
              <motion.button
                key="reset-trigger"
                type="button"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setConfirmReset(true)}
                className="w-full px-3.5 py-2.5 flex items-center gap-2 text-[#B6A48D] hover:bg-white/5 transition-colors text-left cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>Reset Studio Data</span>
              </motion.button>
            ) : (
              <motion.div
                key="reset-confirm"
                initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-white/5 border border-white/15 space-y-2">
                  <p className="text-[11px] text-[#FAF8F4]/80">
                    Restore default roster, clients, projects, events, and queues?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={resetting}
                      onClick={handleReset}
                      className="px-2.5 py-1 bg-[#632B37] text-[#FAF8F4] text-[11px] uppercase tracking-[0.12em] cursor-pointer"
                    >
                      {resetting ? 'Resetting...' : 'Confirm'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="px-2.5 py-1 border border-white/20 text-[11px] uppercase tracking-[0.12em] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full px-3.5 py-2.5 flex items-center gap-2 text-[#FAF8F4]/75 hover:bg-[#632B37] hover:text-[#FAF8F4] transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Workspace Header Bar */}
        <header className="sticky top-0 z-30 h-16 shrink-0 bg-[#FAF8F4] border-b border-[#101010]/15 px-4 sm:px-8 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin navigation"
              className="lg:hidden p-2 -ml-2 text-[#101010]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs truncate">
              <Link
                to="/admin"
                className="hidden sm:inline uppercase tracking-[0.16em] text-[#101010]/55 hover:text-[#101010] whitespace-nowrap"
              >
                Studio Admin
              </Link>
              <span className="hidden sm:inline text-[#101010]/35">/</span>
              <span className="uppercase tracking-[0.16em] text-[#632B37] font-medium truncate">
                {activeMeta.breadcrumb}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-[#101010]/20 text-xs uppercase tracking-[0.14em] hover:border-[#101010] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => dispatch(openCreateModelEditor())}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] font-medium hover:bg-[#632B37] transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Model</span>
            </button>
          </div>
        </header>

        {/* Active Route Content */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1440px] w-full mx-auto space-y-8">
          <div className="pb-6 border-b border-[#101010]/12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#632B37] mb-1.5">
                House of Fashion Nepal · Studio Admin
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-none">
                {activeMeta.heading}
              </h1>
            </div>
          </div>

          <motion.div
            key={location.pathname}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet context={outletContext} />
          </motion.div>
        </main>
      </div>

      <ModelEditorModal
        isOpen={editorOpen}
        model={editingModel}
        onboardingApplication={onboardingApplication}
        onOnboardComplete={(appId) => {
          updateApplication({ id: appId, status: 'onboarded' });
        }}
        onClose={() => dispatch(closeModelEditor())}
      />

      <DeleteModelDialog
        model={deleteTargetModel}
        onClose={() => dispatch(setDeleteTargetId(null))}
      />
    </div>
  );
}
