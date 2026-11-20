import {
  CalendarRange,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Lock,
  Mail,
  Plus,
  Star,
  Trash2,
  Unlock,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AGENCY_ASSETS } from '../../data/assets.ts';
import {
  EVENT_CATEGORIES,
  EVENT_STATUS_LABELS,
  formatEventDate,
} from '../../data/mockEvents.ts';
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useDeleteEventRegistrationMutation,
  useUpdateEventMutation,
  useUpdateEventRegistrationMutation,
} from '../../features/events/eventsApi.ts';
import type {
  AgencyEvent,
  EventCategory,
  EventEntryType,
  EventRegistrationRecord,
  EventRegistrationRole,
  EventRegistrationStatus,
  EventStatus,
  Model,
} from '../../types/index.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';
import { SearchableSelect } from '../common/SearchableSelect.tsx';
import {
  DataTable,
  type DataTableBulkAction,
  type DataTableColumn,
  type DataTableFilter,
} from './DataTable.tsx';

const EVENT_STATUS_OPTIONS: Array<{ value: EventStatus; label: string }> = [
  { value: 'registration-open', label: 'Registration Open' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'sold-out', label: 'Sold Out' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const ENTRY_TYPE_OPTIONS: EventEntryType[] = [
  'Ticketed',
  'Open Audition',
  'Free RSVP',
  'Invite Only',
];

const REGISTRATION_ROLE_OPTIONS: EventRegistrationRole[] = [
  'Attendee / Guest',
  'Aspiring Model (Audition)',
  'Designer / Brand',
  'Press & Media',
  'Sponsor / VIP',
];

const REGISTRATION_STATUS_OPTIONS: Array<{
  value: EventRegistrationStatus;
  label: string;
}> = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'cancelled', label: 'Cancelled' },
];

const EVENT_COVER_PRESETS = [
  { label: 'Couture Runway Show', url: AGENCY_ASSETS.EVENT_COUTURE_RUNWAY },
  { label: 'Open Casting Audition', url: AGENCY_ASSETS.EVENT_OPEN_AUDITION },
  { label: 'Designer Salon & Gala', url: AGENCY_ASSETS.EVENT_DESIGNER_GALA },
  { label: 'Runway Coaching Lab', url: AGENCY_ASSETS.BLOG_RUNWAY_POSING },
  { label: 'Atelier Gala Hall', url: AGENCY_ASSETS.HERO_ATELIER },
  { label: 'Jhamsikhel Studio', url: AGENCY_ASSETS.AGENCY_STUDIO },
];

interface EventsAdminTabProps {
  events: AgencyEvent[];
  registrations: EventRegistrationRecord[];
  models: Model[];
  isLoading: boolean;
}

export function EventsAdminTab({
  events,
  registrations,
  models,
  isLoading,
}: EventsAdminTabProps) {
  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: updating }] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [updateRegistration] = useUpdateEventRegistrationMutation();
  const [deleteRegistration] = useDeleteEventRegistrationMutation();

  const [subView, setSubView] = useState<'events' | 'registrations'>('events');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('All');

  // Event Editor Form State
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgencyEvent | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Fashion Show');
  const [status, setStatus] = useState<EventStatus>('registration-open');
  const [date, setDate] = useState('2027-02-14');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('18:00 NPT');
  const [endTime, setEndTime] = useState('21:00 NPT');
  const [venue, setVenue] = useState('Patan Museum Courtyard');
  const [city, setCity] = useState('Lalitpur');
  const [entryType, setEntryType] = useState<EventEntryType>('Ticketed');
  const [ticketPrice, setTicketPrice] = useState('NPR 2,500');
  const [capacity, setCapacity] = useState('150');
  const [dressCode, setDressCode] = useState('Monochrome Tailoring / Editorial Formal');
  const [coverImage, setCoverImage] = useState<string>(
    AGENCY_ASSETS.EVENT_COUTURE_RUNWAY,
  );
  const [highlightsText, setHighlightsText] = useState(
    'Curated Nepalese designers and ateliers\nRepresented House of Fashion Nepal runway models\nPress and buyer accreditation lounge',
  );
  const [selectedTalentSlugs, setSelectedTalentSlugs] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);

  // Guestlist Note Drafts
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savedNoteIds, setSavedNoteIds] = useState<Record<string, boolean>>({});

  const registrationsByEvent = useMemo(() => {
    const map = new Map<string, number>();
    registrations.forEach((r) => {
      if (r.status !== 'cancelled') {
        map.set(r.eventId, (map.get(r.eventId) || 0) + 1);
      }
    });
    return map;
  }, [registrations]);

  const openNewEventForm = () => {
    setEditingEvent(null);
    setTitle('');
    setCategory('Fashion Show');
    setStatus('registration-open');
    setDate('2027-02-14');
    setEndDate('');
    setStartTime('18:00 NPT');
    setEndTime('21:00 NPT');
    setVenue('Jhamsikhel Atelier Wing');
    setCity('Lalitpur');
    setEntryType('Ticketed');
    setTicketPrice('NPR 2,500');
    setCapacity('150');
    setDressCode('Monochrome Tailoring / Contemporary Formal');
    setCoverImage(AGENCY_ASSETS.EVENT_COUTURE_RUNWAY);
    setHighlightsText(
      'Curated Nepalese designers and ateliers\nHouse of Fashion Nepal represented runway models\nPress and buyer accreditation desk',
    );
    setSelectedTalentSlugs([]);
    setSummary('');
    setDescription('');
    setRegistrationOpen(true);
    setFeatured(true);
    setFormError(null);
    setShowForm(true);
  };

  const openEditEventForm = (evt: AgencyEvent) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setCategory(evt.category);
    setStatus(evt.status);
    setDate(evt.date);
    setEndDate(evt.endDate || '');
    setStartTime(evt.startTime);
    setEndTime(evt.endTime || '');
    setVenue(evt.venue);
    setCity(evt.city);
    setEntryType(evt.entryType);
    setTicketPrice(evt.ticketPrice || '');
    setCapacity(String(evt.capacity));
    setDressCode(evt.dressCode || '');
    setCoverImage(evt.coverImage);
    setHighlightsText(evt.highlights.join('\n'));
    setSelectedTalentSlugs(evt.featuredTalentSlugs);
    setSummary(evt.summary);
    setDescription(evt.description);
    setRegistrationOpen(evt.registrationOpen);
    setFeatured(evt.featured);
    setFormError(null);
    setShowForm(true);
  };

  const toggleTalentSlug = (slug: string) => {
    setSelectedTalentSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const handleSubmitEvent = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !date.trim() || !venue.trim()) {
      setFormError('Event title, date, and venue are required.');
      return;
    }

    const parsedCapacity = Math.max(10, Number.parseInt(capacity, 10) || 100);
    const parsedHighlights = highlightsText
      .split(/\r?\n|;/)
      .map((item) => item.trim())
      .filter(Boolean);
    const resolvedCover =
      coverImage.trim() || AGENCY_ASSETS.EVENT_COUTURE_RUNWAY;
    const resolvedSummary =
      summary.trim() ||
      `Hosted by House of Fashion Nepal in ${city.trim() || 'Kathmandu'}.`;
    const resolvedDescription = description.trim() || resolvedSummary;

    try {
      if (editingEvent) {
        await updateEvent({
          id: editingEvent.id,
          title: title.trim(),
          category,
          status,
          date: date.trim(),
          endDate: endDate.trim() || undefined,
          startTime: startTime.trim() || '18:00 NPT',
          endTime: endTime.trim() || undefined,
          venue: venue.trim(),
          city: city.trim() || 'Kathmandu',
          entryType,
          ticketPrice: ticketPrice.trim() || undefined,
          capacity: parsedCapacity,
          dressCode: dressCode.trim() || undefined,
          coverImage: resolvedCover,
          highlights:
            parsedHighlights.length > 0
              ? parsedHighlights
              : editingEvent.highlights,
          featuredTalentSlugs: selectedTalentSlugs,
          summary: resolvedSummary,
          description: resolvedDescription,
          registrationOpen,
          featured,
        }).unwrap();
      } else {
        await createEvent({
          title: title.trim(),
          category,
          status,
          date: date.trim(),
          endDate: endDate.trim() || undefined,
          startTime: startTime.trim() || '18:00 NPT',
          endTime: endTime.trim() || undefined,
          venue: venue.trim(),
          city: city.trim() || 'Kathmandu',
          entryType,
          ticketPrice: ticketPrice.trim() || undefined,
          capacity: parsedCapacity,
          baseRegisteredCount: 0,
          dressCode: dressCode.trim() || undefined,
          coverImage: resolvedCover,
          highlights:
            parsedHighlights.length > 0
              ? parsedHighlights
              : ['Hosted by House of Fashion Nepal Events Desk'],
          featuredTalentSlugs: selectedTalentSlugs,
          summary: resolvedSummary,
          description: resolvedDescription,
          registrationOpen,
          featured,
        }).unwrap();
      }

      setShowForm(false);
      setEditingEvent(null);
    } catch {
      setFormError('Unable to save event right now. Please try again.');
    }
  };

  const handleToggleFeatured = async (evt: AgencyEvent) => {
    setTableError(null);
    try {
      await updateEvent({ id: evt.id, featured: !evt.featured }).unwrap();
    } catch {
      setTableError('Unable to update featured status right now.');
    }
  };

  const handleToggleRegistrationOpen = async (evt: AgencyEvent) => {
    setTableError(null);
    try {
      await updateEvent({
        id: evt.id,
        registrationOpen: !evt.registrationOpen,
      }).unwrap();
    } catch {
      setTableError('Unable to update event registration toggle.');
    }
  };

  const handleEventStatusChange = async (
    id: string,
    nextStatus: EventStatus,
  ) => {
    setTableError(null);
    try {
      const nextRegOpen =
        nextStatus === 'completed' ||
        nextStatus === 'cancelled' ||
        nextStatus === 'sold-out'
          ? false
          : undefined;
      await updateEvent({
        id,
        status: nextStatus,
        ...(nextRegOpen !== undefined ? { registrationOpen: nextRegOpen } : {}),
      }).unwrap();
    } catch {
      setTableError('Unable to update event status right now.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setTableError(null);
    try {
      await deleteEvent(id).unwrap();
      if (selectedEventFilter === id) {
        setSelectedEventFilter('All');
      }
    } catch {
      setTableError('Unable to delete event right now.');
    }
  };

  const handleRegistrationStatusChange = async (
    id: string,
    nextStatus: EventRegistrationStatus,
  ) => {
    setTableError(null);
    try {
      await updateRegistration({ id, status: nextStatus }).unwrap();
    } catch {
      setTableError('Unable to update guestlist registration status.');
    }
  };

  const handleSaveGuestNote = async (id: string, note: string) => {
    setTableError(null);
    try {
      await updateRegistration({ id, adminNotes: note.trim() }).unwrap();
      setSavedNoteIds((prev) => ({ ...prev, [id]: true }));
      window.setTimeout(() => {
        setSavedNoteIds((prev) => ({ ...prev, [id]: false }));
      }, 2200);
    } catch {
      setTableError('Unable to save guestlist note right now.');
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    setTableError(null);
    try {
      await deleteRegistration(id).unwrap();
    } catch {
      setTableError('Unable to remove registration right now.');
    }
  };

  const eventColumns: DataTableColumn<AgencyEvent>[] = [
    {
      id: 'title',
      header: 'Event Programme',
      sortable: true,
      accessor: (e) => e.title,
      render: (e) => (
        <div className="flex items-center gap-3 min-w-[230px]">
          <EditorialImage
            src={e.coverImage}
            alt={e.title}
            containerClassName="w-14 h-12 shrink-0"
            className="w-full h-full object-cover"
          />
          <div className="min-w-0">
            <p className="font-serif text-lg leading-tight truncate text-[#101010]">
              {e.title}
            </p>
            <p className="text-xs text-[#101010]/60 truncate">
              {e.venue}, {e.city}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Format',
      sortable: true,
      accessor: (e) => e.category,
      cellClassName:
        'text-xs text-[#632B37] uppercase tracking-[0.12em] whitespace-nowrap',
      render: (e) => <span>{e.category}</span>,
    },
    {
      id: 'date',
      header: 'Schedule',
      sortable: true,
      accessor: (e) => e.date,
      render: (e) => (
        <div className="whitespace-nowrap">
          <p className="font-mono text-xs tabular-nums text-[#101010]">
            {formatEventDate(e.date, e.endDate)}
          </p>
          <p className="font-mono text-[11px] tabular-nums text-[#101010]/55">
            {e.startTime}
          </p>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      accessor: (e) => e.status,
      render: (e) => (
        <div className="min-w-[165px]">
          <SearchableSelect
            ariaLabel={`Status for event ${e.title}`}
            value={e.status}
            onChange={(val) =>
              handleEventStatusChange(e.id, val as EventStatus)
            }
            options={EVENT_STATUS_OPTIONS}
            searchPlaceholder="Search status..."
            tone="ivory"
            size="sm"
            menuMinWidth={200}
            className="uppercase tracking-[0.1em]"
          />
        </div>
      ),
    },
    {
      id: 'capacity',
      header: 'Attendance',
      sortable: true,
      sortValue: (e) => e.registeredCount ?? e.baseRegisteredCount,
      render: (e) => {
        const totalReg = e.registeredCount ?? e.baseRegisteredCount;
        const liveRsvps = registrationsByEvent.get(e.id) || 0;
        return (
          <div className="whitespace-nowrap">
            <p className="font-mono text-xs tabular-nums text-[#101010]">
              {totalReg} / {e.capacity}
            </p>
            <p className="text-[11px] text-[#101010]/60">
              {liveRsvps} web {liveRsvps === 1 ? 'RSVP' : 'RSVPs'} ·{' '}
              {e.registrationOpen ? 'Open' : 'Closed'}
            </p>
          </div>
        );
      },
    },
    {
      id: 'featured',
      header: 'Spotlight',
      sortable: true,
      accessor: (e) => (e.featured ? 1 : 0),
      render: (e) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(e)}
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border transition-colors whitespace-nowrap cursor-pointer ${
            e.featured
              ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
              : 'bg-[#F5F1EA] text-[#101010]/65 border-[#101010]/20 hover:border-[#101010]'
          }`}
        >
          <Star className={`w-3 h-3 ${e.featured ? 'fill-current' : ''}`} />
          <span>{e.featured ? 'Featured' : 'Standard'}</span>
        </button>
      ),
    },
  ];

  const eventFilters: DataTableFilter<AgencyEvent>[] = [
    {
      id: 'category',
      label: 'Filter events by format',
      options: [
        { value: 'All', label: 'All Formats' },
        ...EVENT_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
      ],
      predicate: (e, val) => e.category === val,
    },
    {
      id: 'status',
      label: 'Filter events by status',
      options: [
        { value: 'All', label: 'All Statuses' },
        ...EVENT_STATUS_OPTIONS.map((opt) => ({
          value: opt.value,
          label: opt.label,
        })),
      ],
      predicate: (e, val) => e.status === val,
    },
  ];

  const registrationColumns: DataTableColumn<EventRegistrationRecord>[] = [
    {
      id: 'id',
      header: 'Pass Ref',
      sortable: true,
      accessor: (r) => r.id,
      cellClassName: 'font-mono text-xs text-[#632B37] whitespace-nowrap',
      render: (r) => <span>{r.id}</span>,
    },
    {
      id: 'guest',
      header: 'Guest / Candidate',
      sortable: true,
      accessor: (r) => r.fullName,
      render: (r) => (
        <div className="min-w-[190px]">
          <p className="font-serif text-lg leading-tight text-[#101010]">
            {r.fullName}
          </p>
          <p className="text-xs text-[#101010]/60 truncate">
            {r.email}
            {r.organizationOrInstagram ? ` · ${r.organizationOrInstagram}` : ''}
          </p>
        </div>
      ),
    },
    {
      id: 'event',
      header: 'Event',
      sortable: true,
      accessor: (r) => r.eventTitle,
      render: (r) => (
        <div className="min-w-[180px] max-w-[240px]">
          <p className="text-xs font-medium text-[#101010] truncate">
            {r.eventTitle}
          </p>
          <p className="text-[11px] text-[#632B37] uppercase tracking-[0.12em]">
            {r.role}
          </p>
        </div>
      ),
    },
    {
      id: 'createdAt',
      header: 'Submitted',
      sortable: true,
      accessor: (r) => r.createdAt,
      cellClassName:
        'font-mono text-xs tabular-nums text-[#101010]/65 whitespace-nowrap',
      render: (r) => <span>{r.createdAt.slice(0, 10)}</span>,
    },
    {
      id: 'status',
      header: 'Guestlist Status',
      sortable: true,
      accessor: (r) => r.status,
      render: (r) => (
        <div className="min-w-[155px]">
          <SearchableSelect
            ariaLabel={`Status for registration ${r.id}`}
            value={r.status}
            onChange={(val) =>
              handleRegistrationStatusChange(
                r.id,
                val as EventRegistrationStatus,
              )
            }
            options={REGISTRATION_STATUS_OPTIONS}
            searchPlaceholder="Search status..."
            tone="ivory"
            size="sm"
            menuMinWidth={185}
            className="uppercase tracking-[0.12em]"
          />
        </div>
      ),
    },
  ];

  const registrationFilters: DataTableFilter<EventRegistrationRecord>[] = [
    {
      id: 'event',
      label: 'Filter guestlist by event',
      value: selectedEventFilter,
      onChange: setSelectedEventFilter,
      options: [
        { value: 'All', label: 'All Events' },
        ...events.map((evt) => ({ value: evt.id, label: evt.title })),
      ],
      predicate: (r, val) => r.eventId === val,
    },
    {
      id: 'role',
      label: 'Filter by guest role',
      options: [
        { value: 'All', label: 'All Roles' },
        ...REGISTRATION_ROLE_OPTIONS.map((role) => ({
          value: role,
          label: role,
        })),
      ],
      predicate: (r, val) => r.role === val,
    },
    {
      id: 'status',
      label: 'Filter by guestlist status',
      options: [
        { value: 'All', label: 'All Statuses' },
        ...REGISTRATION_STATUS_OPTIONS.map((opt) => ({
          value: opt.value,
          label: opt.label,
        })),
      ],
      predicate: (r, val) => r.status === val,
    },
  ];

  const registrationBulkActions: DataTableBulkAction<EventRegistrationRecord>[] =
    [
      {
        id: 'confirm-selected',
        label: 'Confirm Selected',
        onAction: async (selected, clearSelection) => {
          setTableError(null);
          try {
            await Promise.all(
              selected.map((r) =>
                updateRegistration({ id: r.id, status: 'confirmed' }).unwrap(),
              ),
            );
            clearSelection();
          } catch {
            setTableError('Unable to confirm selected registrations.');
          }
        },
      },
      {
        id: 'waitlist-selected',
        label: 'Move to Waitlist',
        onAction: async (selected, clearSelection) => {
          setTableError(null);
          try {
            await Promise.all(
              selected.map((r) =>
                updateRegistration({ id: r.id, status: 'waitlisted' }).unwrap(),
              ),
            );
            clearSelection();
          } catch {
            setTableError('Unable to waitlist selected registrations.');
          }
        },
      },
    ];

  const labelClass =
    'block text-[11px] uppercase tracking-[0.16em] text-[#101010]/65 mb-1.5';
  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#F5F1EA] border border-[#101010]/20 text-[#101010] focus:outline-none focus:border-[#632B37]';

  return (
    <div className="space-y-6">
      {/* Sub-view Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#101010]/12">
        <div className="inline-flex items-center border border-[#101010]/20 bg-[#FAF8F4] self-start">
          <button
            type="button"
            onClick={() => setSubView('events')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors whitespace-nowrap cursor-pointer ${
              subView === 'events'
                ? 'bg-[#101010] text-[#FAF8F4]'
                : 'text-[#101010]/70 hover:text-[#101010]'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Hosted Events</span>
            <span className="font-mono text-[11px] tabular-nums opacity-75">
              ({events.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSubView('registrations')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors whitespace-nowrap cursor-pointer ${
              subView === 'registrations'
                ? 'bg-[#101010] text-[#FAF8F4]'
                : 'text-[#101010]/70 hover:text-[#101010]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Guestlist &amp; Auditions</span>
            <span className="font-mono text-[11px] tabular-nums opacity-75">
              ({registrations.length})
            </span>
          </button>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#632B37] hover:text-[#101010] transition-colors whitespace-nowrap"
        >
          <span>View Public Events Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {subView === 'events' ? (
        <div className="space-y-6">
          {showForm && (
            <form
              onSubmit={handleSubmitEvent}
              className="p-6 bg-[#FAF8F4] border border-[#101010]/20 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#101010]/10">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37]">
                    {editingEvent
                      ? `Editing ${editingEvent.id}`
                      : 'House of Fashion Nepal Events Desk'}
                  </p>
                  <h2 className="font-serif text-2xl">
                    {editingEvent
                      ? `Update ${editingEvent.title}`
                      : 'Host New Event or Audition'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }}
                  aria-label="Close event form"
                  className="p-2 text-[#101010]/60 hover:text-[#101010] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="evt-title" className={labelClass}>
                    Event Title *
                  </label>
                  <input
                    id="evt-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Kathmandu Spring Runway & Open Casting"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="evt-cat" className={labelClass}>
                      Event Format *
                    </label>
                    <SearchableSelect
                      id="evt-cat"
                      value={category}
                      onChange={(val) => setCategory(val as EventCategory)}
                      options={EVENT_CATEGORIES.map((cat) => ({
                        value: cat,
                        label: cat,
                      }))}
                      searchPlaceholder="Search format..."
                      tone="ivory"
                    />
                  </div>
                  <div>
                    <label htmlFor="evt-status" className={labelClass}>
                      Status *
                    </label>
                    <SearchableSelect
                      id="evt-status"
                      value={status}
                      onChange={(val) => setStatus(val as EventStatus)}
                      options={EVENT_STATUS_OPTIONS}
                      searchPlaceholder="Select status..."
                      tone="ivory"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="evt-date" className={labelClass}>
                    Start Date *
                  </label>
                  <input
                    id="evt-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`${inputClass} font-mono tabular-nums`}
                  />
                </div>
                <div>
                  <label htmlFor="evt-enddate" className={labelClass}>
                    End Date (Optional)
                  </label>
                  <input
                    id="evt-enddate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`${inputClass} font-mono tabular-nums`}
                  />
                </div>
                <div>
                  <label htmlFor="evt-start" className={labelClass}>
                    Start Time
                  </label>
                  <input
                    id="evt-start"
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="18:00 NPT"
                    className={`${inputClass} font-mono tabular-nums`}
                  />
                </div>
                <div>
                  <label htmlFor="evt-end" className={labelClass}>
                    End Time
                  </label>
                  <input
                    id="evt-end"
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="21:30 NPT"
                    className={`${inputClass} font-mono tabular-nums`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="evt-venue" className={labelClass}>
                    Venue *
                  </label>
                  <input
                    id="evt-venue"
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g., Patan Museum Courtyard"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="evt-city" className={labelClass}>
                    City *
                  </label>
                  <input
                    id="evt-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Kathmandu, Lalitpur, Pokhara"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="evt-entry" className={labelClass}>
                    Entry Type *
                  </label>
                  <SearchableSelect
                    id="evt-entry"
                    value={entryType}
                    onChange={(val) => setEntryType(val as EventEntryType)}
                    options={ENTRY_TYPE_OPTIONS.map((t) => ({
                      value: t,
                      label: t,
                    }))}
                    searchPlaceholder="Select entry type..."
                    tone="ivory"
                  />
                </div>
                <div>
                  <label htmlFor="evt-price" className={labelClass}>
                    Pass / Fee Label
                  </label>
                  <input
                    id="evt-price"
                    type="text"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    placeholder="Free Entry / NPR 3,500"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="evt-cap" className={labelClass}>
                    Seat / Slot Capacity
                  </label>
                  <input
                    id="evt-cap"
                    type="number"
                    min={10}
                    max={5000}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className={`${inputClass} font-mono tabular-nums`}
                  />
                </div>
                <div>
                  <label htmlFor="evt-dress" className={labelClass}>
                    Dress Code / Attire
                  </label>
                  <input
                    id="evt-dress"
                    type="text"
                    value={dressCode}
                    onChange={(e) => setDressCode(e.target.value)}
                    placeholder="Fitted Monochrome Basics"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="evt-cover" className={labelClass}>
                  Cover Image URL or Curated Preset
                </label>
                <input
                  id="evt-cover"
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className={inputClass}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {EVENT_COVER_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`px-2.5 py-1 text-[11px] border cursor-pointer ${
                        coverImage === preset.url
                          ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
                          : 'bg-[#F5F1EA] text-[#101010]/70 border-[#101010]/15 hover:border-[#101010]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={labelClass}>
                  Featured House of Fashion Nepal Models
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-2.5 bg-[#F5F1EA] border border-[#101010]/15">
                  {models.map((m) => {
                    const selected = selectedTalentSlugs.includes(m.slug);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleTalentSlug(m.slug)}
                        className={`px-2.5 py-1.5 text-xs text-left border truncate cursor-pointer ${
                          selected
                            ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
                            : 'bg-[#FAF8F4] text-[#101010]/75 border-[#101010]/15'
                        }`}
                      >
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="evt-summary" className={labelClass}>
                    Card Summary
                  </label>
                  <textarea
                    id="evt-summary"
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Concise two-sentence overview shown on event cards."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="evt-highlights" className={labelClass}>
                    Programme Highlights (One Per Line)
                  </label>
                  <textarea
                    id="evt-highlights"
                    rows={2}
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    placeholder="One highlight per line..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="evt-desc" className={labelClass}>
                  Full Programme Description
                </label>
                <textarea
                  id="evt-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed event narrative, audition instructions, or designer lineup."
                  className={inputClass}
                />
              </div>

              {formError && (
                <p className="text-xs text-[#632B37]" role="alert">
                  {formError}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#101010]/10">
                <div className="flex flex-wrap items-center gap-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={registrationOpen}
                      onChange={(e) => setRegistrationOpen(e.target.checked)}
                      className="w-4 h-4 accent-[#632B37]"
                    />
                    <span className="text-xs text-[#101010]/80">
                      Accept Online Registrations / RSVPs
                    </span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#632B37]"
                    />
                    <span className="text-xs text-[#101010]/80">
                      Feature in Flagship Spotlight
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingEvent(null);
                    }}
                    className="px-5 py-2.5 border border-[#101010]/20 text-xs uppercase tracking-[0.16em] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || updating}
                    className="px-6 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {creating || updating
                      ? 'Saving...'
                      : editingEvent
                        ? 'Save Event Changes'
                        : 'Publish Event'}
                  </button>
                </div>
              </div>
            </form>
          )}

          <DataTable
            data={events}
            columns={eventColumns}
            getRowId={(e) => e.id}
            searchPlaceholder="Search events by title, venue, city, or format..."
            searchAriaLabel="Search hosted events"
            searchPredicate={(e, q) =>
              e.title.toLowerCase().includes(q) ||
              e.venue.toLowerCase().includes(q) ||
              e.city.toLowerCase().includes(q) ||
              e.category.toLowerCase().includes(q) ||
              e.id.toLowerCase().includes(q)
            }
            filters={eventFilters}
            isLoading={isLoading}
            error={tableError}
            itemLabel="events"
            defaultPageSize={8}
            exportConfig={{
              filename: 'hof-nepal-events.csv',
              columns: [
                { label: 'ID', value: (e) => e.id },
                { label: 'Title', value: (e) => e.title },
                { label: 'Format', value: (e) => e.category },
                { label: 'Status', value: (e) => EVENT_STATUS_LABELS[e.status] },
                { label: 'Date', value: (e) => e.date },
                { label: 'Venue', value: (e) => e.venue },
                { label: 'City', value: (e) => e.city },
                { label: 'Entry', value: (e) => e.entryType },
                {
                  label: 'Registered',
                  value: (e) => e.registeredCount ?? e.baseRegisteredCount,
                },
                { label: 'Capacity', value: (e) => e.capacity },
              ],
            }}
            toolbarActions={
              <button
                type="button"
                onClick={() =>
                  showForm && !editingEvent
                    ? setShowForm(false)
                    : openNewEventForm()
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#632B37] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {showForm && !editingEvent ? 'Close Form' : 'Host New Event'}
                </span>
              </button>
            }
            renderExpandedRow={(e) => (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                    Programme Brief
                  </p>
                  <p className="text-sm text-[#101010]/85 leading-relaxed">
                    {e.description}
                  </p>
                  <p className="text-[#101010]/65 pt-1">
                    Entry: {e.entryType}
                    {e.ticketPrice ? ` · ${e.ticketPrice}` : ''}
                    {e.dressCode ? ` · Dress Code: ${e.dressCode}` : ''}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                    Highlights &amp; Featured Talent
                  </p>
                  <ul className="space-y-1 text-[#101010]/80">
                    {e.highlights.map((h) => (
                      <li key={h}>· {h}</li>
                    ))}
                  </ul>
                  {e.featuredTalent && e.featuredTalent.length > 0 && (
                    <p className="text-[#101010]/65 pt-1">
                      Models: {e.featuredTalent.map((t) => t.name).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            )}
            rowActionItems={(e) => [
              {
                id: 'edit',
                label: 'Edit Event',
                icon: Edit3,
                onClick: () => openEditEventForm(e),
              },
              {
                id: 'guestlist',
                label: 'View Event Guestlist',
                icon: Users,
                onClick: () => {
                  setSelectedEventFilter(e.id);
                  setSubView('registrations');
                },
              },
              {
                id: 'toggle-reg',
                label: e.registrationOpen
                  ? 'Close Registrations'
                  : 'Open Registrations',
                icon: e.registrationOpen ? Lock : Unlock,
                onClick: () => handleToggleRegistrationOpen(e),
              },
              {
                id: 'public-link',
                label: 'Open Public Listing',
                icon: ExternalLink,
                to: `/events?event=${encodeURIComponent(e.slug)}`,
              },
              {
                id: 'delete',
                label: 'Delete Event',
                icon: Trash2,
                variant: 'danger',
                dividerBefore: true,
                onClick: () => handleDeleteEvent(e.id),
              },
            ]}
            emptyTitle="No events match your filter"
            emptyDescription="Reset search filters or publish a new fashion show, open audition, or workshop."
            emptyAction={{
              label: 'Host New Event',
              onClick: openNewEventForm,
            }}
          />
        </div>
      ) : (
        <DataTable
          data={registrations}
          columns={registrationColumns}
          getRowId={(r) => r.id}
          searchPlaceholder="Search guestlist by pass ref, attendee name, email, event, or Instagram..."
          searchAriaLabel="Search event registrations"
          searchPredicate={(r, q) =>
            r.id.toLowerCase().includes(q) ||
            r.fullName.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.eventTitle.toLowerCase().includes(q) ||
            r.role.toLowerCase().includes(q) ||
            (r.organizationOrInstagram || '').toLowerCase().includes(q)
          }
          filters={registrationFilters}
          selectable
          bulkActions={registrationBulkActions}
          isLoading={isLoading}
          error={tableError}
          itemLabel="registrations"
          defaultPageSize={10}
          defaultSort={{ columnId: 'createdAt', direction: 'desc' }}
          exportConfig={{
            filename: 'hof-nepal-event-guestlist.csv',
            columns: [
              { label: 'Pass Ref', value: (r) => r.id },
              { label: 'Event', value: (r) => r.eventTitle },
              { label: 'Full Name', value: (r) => r.fullName },
              { label: 'Email', value: (r) => r.email },
              { label: 'Phone', value: (r) => r.phone },
              { label: 'Role', value: (r) => r.role },
              {
                label: 'Brand / Handle',
                value: (r) => r.organizationOrInstagram || '',
              },
              { label: 'Status', value: (r) => r.status },
              { label: 'Submitted', value: (r) => r.createdAt.slice(0, 10) },
            ],
          }}
          renderExpandedRow={(r) => {
            const currentNote =
              noteDrafts[r.id] !== undefined
                ? noteDrafts[r.id]
                : r.adminNotes || '';
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                    Attendee Details &amp; Notes
                  </p>
                  <p className="text-sm text-[#101010]/85 leading-relaxed">
                    {r.notes || 'No additional seating or audition notes submitted.'}
                  </p>
                  <p className="text-[#101010]/65">
                    Phone: {r.phone}
                    {r.organizationOrInstagram
                      ? ` · Affiliation: ${r.organizationOrInstagram}`
                      : ''}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                    Internal Guestlist &amp; Slot Note
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currentNote}
                      onChange={(e) => {
                        setNoteDrafts((prev) => ({
                          ...prev,
                          [r.id]: e.target.value,
                        }));
                        setSavedNoteIds((prev) => ({ ...prev, [r.id]: false }));
                      }}
                      placeholder="Seat assignment, press badge #, or audition slot..."
                      aria-label={`Guestlist note for registration ${r.id}`}
                      className="flex-1 px-3 py-2 text-xs bg-[#FAF8F4] border border-[#101010]/20 focus:outline-none focus:border-[#632B37]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveGuestNote(r.id, currentNote)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 border text-[11px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors cursor-pointer ${
                        savedNoteIds[r.id]
                          ? 'border-[#101010] bg-[#101010] text-[#FAF8F4]'
                          : 'border-[#101010]/25 bg-[#FAF8F4] text-[#101010] hover:border-[#101010]'
                      }`}
                    >
                      {savedNoteIds[r.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <span>Save Note</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
          rowActionItems={(r) => [
            {
              id: 'confirm',
              label: 'Confirm Seat / Slot',
              icon: CheckCircle2,
              disabled: r.status === 'confirmed',
              onClick: () => handleRegistrationStatusChange(r.id, 'confirmed'),
            },
            {
              id: 'waitlist',
              label: 'Move to Waitlist',
              icon: Clock,
              disabled: r.status === 'waitlisted',
              onClick: () => handleRegistrationStatusChange(r.id, 'waitlisted'),
            },
            {
              id: 'cancel',
              label: 'Mark Cancelled',
              icon: XCircle,
              disabled: r.status === 'cancelled',
              onClick: () => handleRegistrationStatusChange(r.id, 'cancelled'),
            },
            {
              id: 'email',
              label: 'Email Attendee',
              icon: Mail,
              href: `mailto:${r.email}?subject=${encodeURIComponent(
                `${r.eventTitle} — Registration ${r.id} (House of Fashion Nepal)`,
              )}`,
            },
            {
              id: 'delete',
              label: 'Remove Registration',
              icon: Trash2,
              variant: 'danger',
              dividerBefore: true,
              onClick: () => handleDeleteRegistration(r.id),
            },
          ]}
          emptyTitle="No event registrations match your filter"
          emptyDescription="RSVPs, audition sign-ups, and press accreditation requests submitted on the public Events page will appear here."
        />
      )}
    </div>
  );
}
