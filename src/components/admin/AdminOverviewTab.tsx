import {
  ArrowRight,
  Briefcase,
  Calendar,
  CalendarRange,
  FolderKanban,
  Inbox,
  Plus,
  UserPlus,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks.ts';
import { openCreateModelEditor } from '../../features/admin/adminSlice.ts';
import type {
  AgencyEvent,
  AgencyProject,
  ApplicationRecord,
  BookingRecord,
  ClientPartner,
  ContactRecord,
  EventRegistrationRecord,
  Model,
  Testimonial,
} from '../../types/index.ts';
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from './DataTable.tsx';

interface AdminOverviewTabProps {
  models: Model[];
  clients: ClientPartner[];
  projects: AgencyProject[];
  events: AgencyEvent[];
  eventRegistrations: EventRegistrationRecord[];
  testimonials: Testimonial[];
  bookings: BookingRecord[];
  applications: ApplicationRecord[];
  contacts: ContactRecord[];
}

interface UnifiedQueueRow {
  id: string;
  queueType: 'booking' | 'application' | 'enquiry' | 'event';
  queueLabel: string;
  targetRoute: string;
  title: string;
  subtitle: string;
  status: string;
  date: string;
}

export function AdminOverviewTab({
  models,
  clients,
  projects,
  events,
  eventRegistrations,
  testimonials,
  bookings,
  applications,
  contacts,
}: AdminOverviewTabProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeModels = models.filter((m) => (m.status || 'active') === 'active');
  const availableModels = activeModels.filter(
    (m) => m.availability === 'available',
  ).length;
  const pendingBookings = bookings.filter((b) => b.status !== 'confirmed');
  const openEnquiries = contacts.filter((c) => c.status !== 'resolved');
  const openApplications = applications.filter(
    (a) => a.status === 'new' || a.status === 'shortlisted',
  );
  const upcomingEvents = events.filter(
    (e) => e.status !== 'completed' && e.status !== 'cancelled',
  );
  const activeRegistrations = eventRegistrations.filter(
    (r) => r.status !== 'cancelled',
  );

  const metrics = [
    {
      label: 'Active Roster',
      value: activeModels.length,
      detail: `${availableModels} available · ${models.length} total records`,
      to: '/admin/models',
      icon: Users,
    },
    {
      label: 'Hosted Events',
      value: events.length,
      detail: `${upcomingEvents.length} upcoming · ${activeRegistrations.length} web RSVPs`,
      to: '/admin/events',
      icon: CalendarRange,
    },
    {
      label: 'Booking Requests',
      value: bookings.length,
      detail: `${pendingBookings.length} awaiting confirmation`,
      to: '/admin/bookings',
      icon: Calendar,
    },
    {
      label: 'New Model Queue',
      value: applications.length,
      detail: `${openApplications.length} active scouting profiles`,
      to: '/admin/applications',
      icon: UserPlus,
    },
    {
      label: 'Client Enquiries',
      value: contacts.length,
      detail: `${openEnquiries.length} unresolved messages`,
      to: '/admin/enquiries',
      icon: Inbox,
    },
    {
      label: 'Clients & Projects',
      value: clients.length + projects.length,
      detail: `${clients.length} houses · ${projects.length} projects · ${testimonials.length} stories`,
      to: '/admin/projects',
      icon: FolderKanban,
    },
  ];

  const unifiedQueue = useMemo<UnifiedQueueRow[]>(() => {
    const bookingRows: UnifiedQueueRow[] = bookings.map((b) => {
      const talentLabel = b.modelNames?.join(', ') || b.modelName;
      const genderLabel =
        b.requestedGender && b.requestedGender !== 'Any'
          ? `${b.requestedGender} Board`
          : '';
      const meta = [b.projectType, talentLabel, genderLabel]
        .filter(Boolean)
        .join(' · ');
      return {
        id: b.id,
        queueType: 'booking',
        queueLabel: 'Booking',
        targetRoute: '/admin/bookings',
        title: b.companyName ? `${b.clientName} · ${b.companyName}` : b.clientName,
        subtitle: meta,
        status: b.status,
        date: b.shootDate || b.createdAt.slice(0, 10),
      };
    });

    const applicationRows: UnifiedQueueRow[] = applications.map((a) => ({
      id: a.id,
      queueType: 'application',
      queueLabel: 'New Model',
      targetRoute: '/admin/applications',
      title: a.fullName,
      subtitle: `${a.gender} · ${a.height} cm · ${a.category}`,
      status: a.status,
      date: a.createdAt.slice(0, 10),
    }));

    const enquiryRows: UnifiedQueueRow[] = contacts.map((c) => ({
      id: c.id,
      queueType: 'enquiry',
      queueLabel: 'Enquiry',
      targetRoute: '/admin/enquiries',
      title: c.subject,
      subtitle: `${c.name}${c.company ? ` · ${c.company}` : ''}`,
      status: c.status,
      date: c.createdAt.slice(0, 10),
    }));

    const eventRows: UnifiedQueueRow[] = eventRegistrations.map((r) => ({
      id: r.id,
      queueType: 'event',
      queueLabel: 'Event RSVP',
      targetRoute: '/admin/events',
      title: `${r.fullName} · ${r.role}`,
      subtitle: r.eventTitle,
      status: r.status,
      date: r.createdAt.slice(0, 10),
    }));

    return [...bookingRows, ...applicationRows, ...enquiryRows, ...eventRows];
  }, [bookings, applications, contacts, eventRegistrations]);

  const queueColumns: DataTableColumn<UnifiedQueueRow>[] = [
    {
      id: 'id',
      header: 'Ref ID',
      sortable: true,
      accessor: (r) => r.id,
      cellClassName: 'font-mono text-xs text-[#632B37] whitespace-nowrap',
      render: (r) => <span>{r.id}</span>,
    },
    {
      id: 'queue',
      header: 'Desk',
      sortable: true,
      accessor: (r) => r.queueLabel,
      cellClassName: 'text-xs uppercase tracking-[0.14em] text-[#101010]/70 whitespace-nowrap',
      render: (r) => <span>{r.queueLabel}</span>,
    },
    {
      id: 'title',
      header: 'Subject / Contact',
      sortable: true,
      accessor: (r) => r.title,
      render: (r) => (
        <div className="min-w-[200px]">
          <p className="font-serif text-lg leading-tight text-[#101010]">
            {r.title}
          </p>
          <p className="text-xs text-[#101010]/60">{r.subtitle}</p>
        </div>
      ),
    },
    {
      id: 'date',
      header: 'Date',
      sortable: true,
      accessor: (r) => r.date,
      cellClassName: 'font-mono text-xs tabular-nums text-[#101010]/70 whitespace-nowrap',
      render: (r) => <span>{r.date}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      accessor: (r) => r.status,
      cellClassName: 'text-xs uppercase tracking-[0.14em] text-[#632B37] whitespace-nowrap',
      render: (r) => <span>{r.status}</span>,
    },
  ];

  const queueFilters: DataTableFilter<UnifiedQueueRow>[] = [
    {
      id: 'desk',
      label: 'Filter by studio desk',
      options: [
        { value: 'All', label: 'All Desks' },
        { value: 'event', label: 'Event RSVPs' },
        { value: 'booking', label: 'Bookings' },
        { value: 'application', label: 'New Models' },
        { value: 'enquiry', label: 'Enquiries' },
      ],
      predicate: (r, val) => r.queueType === val,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Quick Action Bar */}
      <div className="p-6 bg-[#FAF8F4] border border-[#101010]/15 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37] mb-1">
            Daily Studio Operations
          </p>
          <h2 className="font-serif text-3xl text-[#101010]">
            Nepal Casting &amp; Representation Desk
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(openCreateModelEditor())}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Model</span>
          </button>
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#101010]/25 bg-[#F5F1EA] text-xs uppercase tracking-[0.16em] hover:border-[#101010] transition-colors whitespace-nowrap"
          >
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Host Event</span>
          </Link>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#101010]/25 bg-[#F5F1EA] text-xs uppercase tracking-[0.16em] hover:border-[#101010] transition-colors whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bookings</span>
          </Link>
          <Link
            to="/admin/clients"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#101010]/25 bg-[#F5F1EA] text-xs uppercase tracking-[0.16em] hover:border-[#101010] transition-colors whitespace-nowrap"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Clients</span>
          </Link>
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#101010]/25 bg-[#F5F1EA] text-xs uppercase tracking-[0.16em] hover:border-[#101010] transition-colors whitespace-nowrap"
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Projects</span>
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link
              key={metric.label}
              to={metric.to}
              className="group text-left p-6 bg-[#FAF8F4] border border-[#101010]/15 hover:border-[#101010] transition-colors flex flex-col justify-between gap-5"
            >
              <div className="flex items-center justify-between text-[#101010]/55">
                <span className="text-[11px] uppercase tracking-[0.16em]">
                  {metric.label}
                </span>
                <Icon className="w-4 h-4 text-[#632B37]" />
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-serif text-4xl tabular-nums leading-none text-[#101010]">
                    {metric.value}
                  </p>
                  <p className="text-xs text-[#101010]/60 mt-2">{metric.detail}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-[#632B37] opacity-75 group-hover:opacity-100">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Unified Operations Queue */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37] mb-1">
              Incoming Agency Queues
            </p>
            <h3 className="font-serif text-3xl text-[#101010]">
              Bookings, Scouting &amp; Enquiries Ledger
            </h3>
          </div>
        </div>

        <DataTable
          data={unifiedQueue}
          columns={queueColumns}
          getRowId={(r) => `${r.queueType}-${r.id}`}
          searchPlaceholder="Search across all bookings, scouting applications, and enquiries..."
          searchAriaLabel="Search studio queues"
          searchPredicate={(r, q) =>
            r.id.toLowerCase().includes(q) ||
            r.title.toLowerCase().includes(q) ||
            r.subtitle.toLowerCase().includes(q) ||
            r.queueLabel.toLowerCase().includes(q) ||
            r.status.toLowerCase().includes(q)
          }
          filters={queueFilters}
          itemLabel="queue items"
          defaultPageSize={5}
          pageSizeOptions={[5, 10, 20]}
          defaultSort={{ columnId: 'date', direction: 'desc' }}
          toolbarActionItems={[
            {
              id: 'open-events',
              label: 'Open Events & Auditions',
              icon: CalendarRange,
              onClick: () => navigate('/admin/events'),
            },
            {
              id: 'open-models',
              label: 'Open Talent Roster',
              icon: Users,
              onClick: () => navigate('/admin/models'),
            },
            {
              id: 'open-bookings',
              label: 'Open Booking Desk',
              icon: Calendar,
              onClick: () => navigate('/admin/bookings'),
            },
            {
              id: 'open-apps',
              label: 'Open Scouting Queue',
              icon: UserPlus,
              onClick: () => navigate('/admin/applications'),
            },
            {
              id: 'open-enquiries',
              label: 'Open Enquiry Inbox',
              icon: Inbox,
              onClick: () => navigate('/admin/enquiries'),
            },
          ]}
          toolbarMenuLabel="Jump to Desk"
          rowActionItems={(r) => [
            {
              id: 'manage-desk',
              label: `Open ${r.queueLabel} Desk`,
              icon: ArrowRight,
              onClick: () => navigate(r.targetRoute),
            },
            {
              id: 'view-roster',
              label: 'Open Talent Roster',
              icon: Users,
              dividerBefore: true,
              onClick: () => navigate('/admin/models'),
            },
            {
              id: 'new-model',
              label: 'Create New Model',
              icon: Plus,
              onClick: () => dispatch(openCreateModelEditor()),
            },
          ]}
          emptyTitle="All incoming queues are clear"
          emptyDescription="New bookings, model scouting submissions, and client enquiries will surface here automatically."
        />
      </div>
    </div>
  );
}
