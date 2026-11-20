import { CalendarCheck2, Check, Clock, Mail, Plus, Trash2, X } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import {
  useCreateBookingMutation,
  useDeleteBookingMutation,
  useUpdateBookingMutation,
} from '../../features/bookings/bookingsApi.ts';
import { Link } from 'react-router-dom';
import { MODEL_STATUS_MAP } from '../../constants/modelStatus.ts';
import type { BookingRecord, Model } from '../../types/index.ts';
import { SearchableMultiSelect, SearchableSelect } from '../common/SearchableSelect.tsx';
import {
  DataTable,
  type DataTableBulkAction,
  type DataTableColumn,
  type DataTableFilter,
} from './DataTable.tsx';

interface BookingsAdminTabProps {
  bookings: BookingRecord[];
  models: Model[];
  isLoading: boolean;
}

const BOOKING_STATUS_OPTIONS: Array<{
  value: BookingRecord['status'];
  label: string;
}> = [
  { value: 'pending', label: 'Pending Review' },
  { value: 'reviewing', label: 'Reviewing / Option Hold' },
  { value: 'confirmed', label: 'Confirmed Shoot' },
];

export function BookingsAdminTab({
  bookings,
  models,
  isLoading,
}: BookingsAdminTabProps) {
  const [createBooking, { isLoading: creating }] = useCreateBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const [showNewForm, setShowNewForm] = useState(false);

  // Manual booking creation fields
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+977 ');
  const [requestedGender, setRequestedGender] = useState('Any');
  const [modelSlugs, setModelSlugs] = useState<string[]>([]);
  const [projectType, setProjectType] = useState('Editorial & Lookbook');
  const [shootDate, setShootDate] = useState('2026-12-20');
  const [location, setLocation] = useState('Kathmandu, Nepal');
  const [details, setDetails] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);

  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savedNoteIds, setSavedNoteIds] = useState<Record<string, boolean>>({});

  const genderFilteredModels = useMemo(() => {
    const specificGender =
      requestedGender !== 'Any' && requestedGender !== 'Mixed Ensemble'
        ? requestedGender
        : null;
    return models.filter(
      (m) =>
        !specificGender ||
        m.gender.toLowerCase() === specificGender.toLowerCase(),
    );
  }, [models, requestedGender]);

  const handleLogBooking = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!clientName.trim() || !email.trim() || !details.trim()) {
      setFormError('Client name, email, and project brief are required.');
      return;
    }
    const chosenModels = modelSlugs
      .map((slug) => models.find((m) => m.slug === slug))
      .filter((m): m is Model => Boolean(m));
    const chosenNames = chosenModels.map((m) => m.name);

    try {
      await createBooking({
        clientName: clientName.trim(),
        companyName: companyName.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || '+977 1 552 8410',
        requestedGender:
          requestedGender && requestedGender !== 'Any'
            ? requestedGender
            : undefined,
        modelSlugs: chosenModels.length > 0 ? chosenModels.map((m) => m.slug) : undefined,
        modelNames: chosenNames.length > 0 ? chosenNames : undefined,
        modelSlug: chosenModels[0]?.slug,
        modelName: chosenNames.length > 0 ? chosenNames.join(', ') : undefined,
        projectType,
        shootDate,
        location: location.trim() || 'Kathmandu, Nepal',
        details: details.trim(),
      }).unwrap();

      setClientName('');
      setCompanyName('');
      setEmail('');
      setPhone('+977 ');
      setRequestedGender('Any');
      setModelSlugs([]);
      setDetails('');
      setShowNewForm(false);
    } catch {
      setFormError('Unable to log booking right now. Please verify fields and retry.');
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: BookingRecord['status'],
  ) => {
    setTableError(null);
    try {
      await updateBooking({ id, status }).unwrap();
    } catch {
      setTableError('Unable to update booking status right now.');
    }
  };

  const handleSaveNote = async (id: string, note: string) => {
    setTableError(null);
    try {
      await updateBooking({ id, adminNotes: note.trim() }).unwrap();
      setSavedNoteIds((prev) => ({ ...prev, [id]: true }));
      window.setTimeout(() => {
        setSavedNoteIds((prev) => ({ ...prev, [id]: false }));
      }, 2200);
    } catch {
      setTableError('Unable to save call-sheet note right now.');
    }
  };

  const handleDelete = async (id: string) => {
    setTableError(null);
    try {
      await deleteBooking(id).unwrap();
    } catch {
      setTableError('Unable to remove booking record right now.');
    }
  };

  const projectTypes = useMemo(
    () =>
      Array.from(new Set(bookings.map((b) => b.projectType))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [bookings],
  );

  const columns: DataTableColumn<BookingRecord>[] = [
    {
      id: 'id',
      header: 'Booking ID',
      sortable: true,
      accessor: (b) => b.id,
      cellClassName: 'font-mono text-xs text-[#632B37] whitespace-nowrap',
      render: (b) => <span>{b.id}</span>,
    },
    {
      id: 'client',
      header: 'Client & Brand',
      sortable: true,
      accessor: (b) => b.clientName,
      render: (b) => (
        <div className="min-w-[170px]">
          <p className="font-serif text-lg leading-tight text-[#101010]">
            {b.clientName}
            {b.companyName ? ` · ${b.companyName}` : ''}
          </p>
          <p className="text-xs text-[#101010]/60 truncate">{b.email}</p>
        </div>
      ),
    },
    {
      id: 'talent',
      header: 'Talent & Board',
      sortable: true,
      accessor: (b) =>
        b.modelNames?.join(', ') ||
        b.modelName ||
        (b.requestedGender ? `${b.requestedGender} Casting` : 'General Casting'),
      cellClassName: 'text-xs text-[#101010]/80 max-w-[230px]',
      render: (b) => {
        const names =
          b.modelNames && b.modelNames.length > 0
            ? b.modelNames
            : b.modelName
              ? [b.modelName]
              : [];
        return (
          <div className="space-y-0.5">
            <p className="truncate font-medium text-[#101010]">
              {names.length > 0
                ? names.length > 1
                  ? `${names.length} Models: ${names.join(', ')}`
                  : names[0]
                : 'General / Open Casting'}
            </p>
            {b.requestedGender && b.requestedGender !== 'Any' && (
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#632B37]">
                Gender: {b.requestedGender}
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: 'projectType',
      header: 'Project Type',
      sortable: true,
      accessor: (b) => b.projectType,
      cellClassName: 'text-xs text-[#101010]/75 whitespace-nowrap',
      render: (b) => <span>{b.projectType}</span>,
    },
    {
      id: 'shootDate',
      header: 'Shoot Date',
      sortable: true,
      accessor: (b) => b.shootDate,
      cellClassName: 'font-mono text-xs tabular-nums whitespace-nowrap',
      render: (b) => <span>{b.shootDate}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      accessor: (b) => b.status,
      render: (b) => (
        <div className="min-w-[185px]">
          <SearchableSelect
            ariaLabel={`Booking status for ${b.id}`}
            value={b.status}
            onChange={(val) =>
              handleStatusUpdate(b.id, val as BookingRecord['status'])
            }
            options={BOOKING_STATUS_OPTIONS}
            searchPlaceholder="Search status..."
            tone="ivory"
            size="sm"
            menuMinWidth={220}
            className="uppercase tracking-[0.12em]"
          />
        </div>
      ),
    },
  ];

  const filters: DataTableFilter<BookingRecord>[] = [
    {
      id: 'status',
      label: 'Filter bookings by status',
      options: [
        { value: 'All', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'reviewing', label: 'Reviewing' },
        { value: 'confirmed', label: 'Confirmed' },
      ],
      predicate: (b, val) => b.status === val,
    },
    {
      id: 'projectType',
      label: 'Filter bookings by project type',
      options: [
        { value: 'All', label: 'All Project Types' },
        ...projectTypes.map((pt) => ({ value: pt, label: pt })),
      ],
      predicate: (b, val) => b.projectType === val,
    },
  ];

  const bulkActions: DataTableBulkAction<BookingRecord>[] = [
    {
      id: 'mark-reviewing',
      label: 'Set Reviewing',
      onAction: async (selected, clearSelection) => {
        setTableError(null);
        try {
          await Promise.all(
            selected.map((b) =>
              updateBooking({ id: b.id, status: 'reviewing' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setTableError('Unable to update selected bookings.');
        }
      },
    },
    {
      id: 'mark-confirmed',
      label: 'Confirm Selected',
      onAction: async (selected, clearSelection) => {
        setTableError(null);
        try {
          await Promise.all(
            selected.map((b) =>
              updateBooking({ id: b.id, status: 'confirmed' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setTableError('Unable to confirm selected bookings.');
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
      {showNewForm && (
        <form
          onSubmit={handleLogBooking}
          className="p-6 bg-[#FAF8F4] border border-[#101010]/20 space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#101010]/10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37]">
                Manual Agency Dispatch
              </p>
              <h2 className="font-serif text-2xl">Log Direct Client Booking</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              aria-label="Close booking form"
              className="p-2 text-[#101010]/60 hover:text-[#101010]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="bk-client" className={labelClass}>
                Client Contact *
              </label>
              <input
                id="bk-client"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g., Suman Adhikari"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="bk-company" className={labelClass}>
                Brand / Agency
              </label>
              <input
                id="bk-company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Himalayan Atelier"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="bk-email" className={labelClass}>
                Email *
              </label>
              <input
                id="bk-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="casting@brand.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="bk-phone" className={labelClass}>
                Phone
              </label>
              <input
                id="bk-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="bk-gender" className={labelClass}>
                Gender / Board
              </label>
              <SearchableSelect
                id="bk-gender"
                value={requestedGender}
                onChange={setRequestedGender}
                options={[
                  { value: 'Any', label: 'Any Gender / All Boards' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Non-Binary', label: 'Non-Binary' },
                  { value: 'Mixed Ensemble', label: 'Mixed Ensemble' },
                ]}
                searchPlaceholder="Search gender board..."
                tone="ivory"
              />
            </div>
            <div>
              <label htmlFor="bk-type" className={labelClass}>
                Project Type
              </label>
              <SearchableSelect
                id="bk-type"
                value={projectType}
                onChange={setProjectType}
                options={[
                  { value: 'Editorial & Lookbook', label: 'Editorial & Lookbook' },
                  { value: 'Commercial Campaign', label: 'Commercial Campaign' },
                  { value: 'Runway Show', label: 'Runway Show' },
                  { value: 'TVC / Brand Film', label: 'TVC / Brand Film' },
                  { value: 'Event / Appearance', label: 'Event / Appearance' },
                ]}
                searchPlaceholder="Search project types..."
                tone="ivory"
              />
            </div>
            <div>
              <label htmlFor="bk-date" className={labelClass}>
                Shoot Date
              </label>
              <input
                id="bk-date"
                type="date"
                value={shootDate}
                onChange={(e) => setShootDate(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label htmlFor="bk-loc" className={labelClass}>
                Shoot Location
              </label>
              <input
                id="bk-loc"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="bk-model" className={labelClass}>
              Requested Talent (Select One or Multiple Models)
            </label>
            <SearchableMultiSelect
              id="bk-model"
              values={modelSlugs}
              onChange={setModelSlugs}
              options={genderFilteredModels.map((m) => {
                const modelStatus = m.status || 'active';
                return {
                  value: m.slug,
                  label: m.name,
                  hint:
                    modelStatus === 'active'
                      ? `${m.id} · ${m.gender} · ${m.height} cm`
                      : `${m.id} · ${MODEL_STATUS_MAP[modelStatus].label}`,
                  disabled: modelStatus !== 'active',
                };
              })}
              placeholder="General Casting / Multiple — or Pick Models"
              searchPlaceholder="Search talent by name, ID, or gender..."
              tone="ivory"
              menuMinWidth={280}
            />
            {modelSlugs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {modelSlugs.map((slug) => {
                  const m = models.find((item) => item.slug === slug);
                  return (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-[#101010]/20 bg-[#F5F1EA]"
                    >
                      <span>{m?.name || slug}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setModelSlugs((prev) => prev.filter((s) => s !== slug))
                        }
                        aria-label={`Remove ${m?.name || slug}`}
                        className="opacity-65 hover:text-[#632B37] cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="bk-details" className={labelClass}>
              Production Call Sheet Brief *
            </label>
            <textarea
              id="bk-details"
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Deliverables, call time, usage rights, and wardrobe notes..."
              className={inputClass}
            />
          </div>

          {formError && (
            <p className="text-xs text-[#632B37]" role="alert">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-[#101010]/10">
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="px-5 py-2.5 border border-[#101010]/20 text-xs uppercase tracking-[0.16em]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors disabled:opacity-60"
            >
              {creating ? 'Logging...' : 'Save Booking'}
            </button>
          </div>
        </form>
      )}

      <DataTable
        data={bookings}
        columns={columns}
        getRowId={(b) => b.id}
        searchPlaceholder="Search bookings by ID, client, brand, talent, or shoot city..."
        searchAriaLabel="Search bookings"
        searchPredicate={(b, q) =>
          b.id.toLowerCase().includes(q) ||
          b.clientName.toLowerCase().includes(q) ||
          (b.companyName || '').toLowerCase().includes(q) ||
          (b.modelName || '').toLowerCase().includes(q) ||
          (b.modelNames?.join(' ') || '').toLowerCase().includes(q) ||
          (b.requestedGender || '').toLowerCase().includes(q) ||
          b.projectType.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q)
        }
        filters={filters}
        selectable
        bulkActions={bulkActions}
        isLoading={isLoading}
        error={tableError}
        itemLabel="bookings"
        defaultPageSize={8}
        defaultSort={{ columnId: 'shootDate', direction: 'desc' }}
        exportConfig={{
          filename: 'hof-nepal-bookings.csv',
          columns: [
            { label: 'ID', value: (b) => b.id },
            { label: 'Client', value: (b) => b.clientName },
            { label: 'Brand', value: (b) => b.companyName || '' },
            { label: 'Gender Board', value: (b) => b.requestedGender || 'Any' },
            {
              label: 'Talent',
              value: (b) =>
                b.modelNames?.join(' | ') || b.modelName || 'General Casting',
            },
            { label: 'Project Type', value: (b) => b.projectType },
            { label: 'Shoot Date', value: (b) => b.shootDate },
            { label: 'Location', value: (b) => b.location },
            { label: 'Status', value: (b) => b.status },
          ],
        }}
        toolbarActions={
          <button
            type="button"
            onClick={() => setShowNewForm((prev) => !prev)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#632B37] transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showNewForm ? 'Close Form' : 'Log Booking'}</span>
          </button>
        }
        renderExpandedRow={(b) => {
          const currentNote =
            noteDrafts[b.id] !== undefined ? noteDrafts[b.id] : b.adminNotes || '';
          const bookedSlugs =
            b.modelSlugs && b.modelSlugs.length > 0
              ? b.modelSlugs
              : b.modelSlug
                ? [b.modelSlug]
                : [];
          return (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                    Call Sheet Brief
                  </p>
                  <p className="text-sm text-[#101010]/85 leading-relaxed">
                    {b.details}
                  </p>
                  <p className="text-[#101010]/60">
                    Contact: {b.phone} · Location: {b.location}
                    {b.requestedGender && b.requestedGender !== 'Any'
                      ? ` · Board: ${b.requestedGender}`
                      : ''}
                  </p>
                  {bookedSlugs.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/55">
                        Talent ({bookedSlugs.length}):
                      </span>
                      {bookedSlugs.map((slug, idx) => {
                        const matched = models.find((m) => m.slug === slug);
                        const label =
                          matched?.name || b.modelNames?.[idx] || slug;
                        return (
                          <Link
                            key={slug}
                            to={`/models/${slug}`}
                            className="px-2 py-0.5 border border-[#101010]/20 bg-[#FAF8F4] text-[#101010] hover:border-[#632B37] hover:text-[#632B37]"
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                    Internal Option &amp; Call-Sheet Notes
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currentNote}
                      onChange={(e) => {
                        setNoteDrafts((prev) => ({
                          ...prev,
                          [b.id]: e.target.value,
                        }));
                        setSavedNoteIds((prev) => ({ ...prev, [b.id]: false }));
                      }}
                      placeholder="Internal call-sheet or option note..."
                      aria-label={`Agency note for ${b.id}`}
                      className="flex-1 px-3 py-2 text-xs bg-[#FAF8F4] border border-[#101010]/20 focus:outline-none focus:border-[#632B37]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveNote(b.id, currentNote)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 border text-[11px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors cursor-pointer ${
                        savedNoteIds[b.id]
                          ? 'border-[#101010] bg-[#101010] text-[#FAF8F4]'
                          : 'border-[#101010]/25 bg-[#FAF8F4] text-[#101010] hover:border-[#101010]'
                      }`}
                    >
                      {savedNoteIds[b.id] ? (
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
            </div>
          );
        }}
        rowActionItems={(b) => [
          {
            id: 'confirm',
            label: 'Confirm Shoot',
            icon: CalendarCheck2,
            disabled: b.status === 'confirmed',
            onClick: () => handleStatusUpdate(b.id, 'confirmed'),
          },
          {
            id: 'review',
            label: 'Mark Reviewing',
            icon: Clock,
            disabled: b.status === 'reviewing',
            onClick: () => handleStatusUpdate(b.id, 'reviewing'),
          },
          {
            id: 'reply',
            label: 'Reply Client via Email',
            icon: Mail,
            href: `mailto:${b.email}?subject=${encodeURIComponent(
              `House of Fashion Nepal Booking Confirmation (${b.id})`,
            )}`,
          },
          {
            id: 'delete',
            label: 'Remove Booking',
            icon: Trash2,
            variant: 'danger',
            dividerBefore: true,
            onClick: () => handleDelete(b.id),
          },
        ]}
        emptyTitle="No booking inquiries match your filter"
        emptyDescription="Reset active filters or log a direct client booking request."
        emptyAction={{
          label: 'Log First Booking',
          onClick: () => setShowNewForm(true),
        }}
      />
    </div>
  );
}
