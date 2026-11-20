import { Archive, Check, CheckCircle2, ExternalLink, Mail, Trash2, UserCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks.ts';
import { openOnboardModelEditor } from '../../features/admin/adminSlice.ts';
import {
  useDeleteApplicationMutation,
  useUpdateApplicationMutation,
} from '../../features/applications/applicationsApi.ts';
import type { ApplicationRecord } from '../../types/index.ts';
import { SearchableSelect } from '../common/SearchableSelect.tsx';
import {
  DataTable,
  type DataTableBulkAction,
  type DataTableColumn,
  type DataTableFilter,
} from './DataTable.tsx';

interface ApplicationsAdminTabProps {
  applications: ApplicationRecord[];
  isLoading: boolean;
}

const APP_STATUS_OPTIONS: Array<{
  value: ApplicationRecord['status'];
  label: string;
}> = [
  { value: 'new', label: 'New Submission' },
  { value: 'shortlisted', label: 'Shortlisted Go-See' },
  { value: 'onboarded', label: 'Onboarded to Roster' },
  { value: 'archived', label: 'Archived' },
];

export function ApplicationsAdminTab({
  applications,
  isLoading,
}: ApplicationsAdminTabProps) {
  const dispatch = useAppDispatch();
  const [updateApplication] = useUpdateApplicationMutation();
  const [deleteApplication] = useDeleteApplicationMutation();

  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savedNoteIds, setSavedNoteIds] = useState<Record<string, boolean>>({});
  const [tableError, setTableError] = useState<string | null>(null);

  const handleStatusChange = async (
    id: string,
    status: ApplicationRecord['status'],
  ) => {
    setTableError(null);
    try {
      await updateApplication({ id, status }).unwrap();
    } catch {
      setTableError('Unable to update application status right now.');
    }
  };

  const handleSaveNote = async (id: string, note: string) => {
    setTableError(null);
    try {
      await updateApplication({ id, adminNotes: note.trim() }).unwrap();
      setSavedNoteIds((prev) => ({ ...prev, [id]: true }));
      window.setTimeout(() => {
        setSavedNoteIds((prev) => ({ ...prev, [id]: false }));
      }, 2200);
    } catch {
      setTableError('Unable to save scouting note right now.');
    }
  };

  const handleDelete = async (id: string) => {
    setTableError(null);
    try {
      await deleteApplication(id).unwrap();
    } catch {
      setTableError('Unable to remove application right now.');
    }
  };

  const genders = useMemo(
    () =>
      Array.from(new Set(applications.map((a) => a.gender))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [applications],
  );

  const columns: DataTableColumn<ApplicationRecord>[] = [
    {
      id: 'id',
      header: 'App ID',
      sortable: true,
      accessor: (a) => a.id,
      cellClassName: 'font-mono text-xs text-[#632B37] whitespace-nowrap',
      render: (a) => <span>{a.id}</span>,
    },
    {
      id: 'fullName',
      header: 'Candidate',
      sortable: true,
      accessor: (a) => a.fullName,
      render: (a) => (
        <div className="min-w-[170px]">
          <p className="font-serif text-lg leading-tight text-[#101010]">
            {a.fullName}
          </p>
          <p className="text-xs text-[#101010]/60 truncate">
            {a.location} · {a.email}
          </p>
        </div>
      ),
    },
    {
      id: 'division',
      header: 'Division & Board',
      sortable: true,
      accessor: (a) => a.category,
      cellClassName: 'text-xs text-[#101010]/80 whitespace-nowrap',
      render: (a) => (
        <span>
          {a.gender} · {a.category}
        </span>
      ),
    },
    {
      id: 'height',
      header: 'Height',
      sortable: true,
      accessor: (a) => a.height,
      cellClassName: 'font-mono text-xs tabular-nums whitespace-nowrap',
      render: (a) => (
        <span>
          {a.height} cm{a.weight ? ` · ${a.weight} kg` : ''}
        </span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Submitted',
      sortable: true,
      accessor: (a) => a.createdAt,
      cellClassName: 'font-mono text-xs tabular-nums text-[#101010]/65 whitespace-nowrap',
      render: (a) => <span>{a.createdAt.slice(0, 10)}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      accessor: (a) => a.status,
      render: (a) => (
        <div className="min-w-[185px]">
          <SearchableSelect
            ariaLabel={`Status for ${a.fullName}`}
            value={a.status}
            onChange={(val) =>
              handleStatusChange(a.id, val as ApplicationRecord['status'])
            }
            options={APP_STATUS_OPTIONS}
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

  const filters: DataTableFilter<ApplicationRecord>[] = [
    {
      id: 'status',
      label: 'Filter applications by status',
      options: [
        { value: 'All', label: 'All Applications' },
        { value: 'new', label: 'New' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'onboarded', label: 'Onboarded' },
        { value: 'archived', label: 'Archived' },
      ],
      predicate: (a, val) => a.status === val,
    },
    {
      id: 'gender',
      label: 'Filter applications by gender',
      options: [
        { value: 'All', label: 'All Boards' },
        ...genders.map((g) => ({ value: g, label: g })),
      ],
      predicate: (a, val) => a.gender === val,
    },
  ];

  const bulkActions: DataTableBulkAction<ApplicationRecord>[] = [
    {
      id: 'shortlist',
      label: 'Shortlist Selected',
      onAction: async (selected, clearSelection) => {
        setTableError(null);
        try {
          await Promise.all(
            selected.map((a) =>
              updateApplication({ id: a.id, status: 'shortlisted' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setTableError('Unable to shortlist selected applicants.');
        }
      },
    },
    {
      id: 'archive',
      label: 'Archive Selected',
      onAction: async (selected, clearSelection) => {
        setTableError(null);
        try {
          await Promise.all(
            selected.map((a) =>
              updateApplication({ id: a.id, status: 'archived' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setTableError('Unable to archive selected applicants.');
        }
      },
    },
  ];

  return (
    <DataTable
      data={applications}
      columns={columns}
      getRowId={(a) => a.id}
      searchPlaceholder="Search new models by name, city, division, or ID..."
      searchAriaLabel="Search new model applications"
      searchPredicate={(a, q) =>
        a.fullName.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.gender.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      }
      filters={filters}
      selectable
      bulkActions={bulkActions}
      isLoading={isLoading}
      error={tableError}
      itemLabel="applications"
      defaultPageSize={8}
      defaultSort={{ columnId: 'createdAt', direction: 'desc' }}
      exportConfig={{
        filename: 'hof-nepal-new-model-applications.csv',
        columns: [
          { label: 'ID', value: (a) => a.id },
          { label: 'Full Name', value: (a) => a.fullName },
          { label: 'Gender', value: (a) => a.gender },
          { label: 'Category', value: (a) => a.category },
          { label: 'Location', value: (a) => a.location },
          { label: 'Height (cm)', value: (a) => a.height },
          { label: 'Email', value: (a) => a.email },
          { label: 'Status', value: (a) => a.status },
        ],
      }}
      toolbarActions={
        <Link
          to="/become-a-model"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#101010]/20 bg-[#F5F1EA] text-xs uppercase tracking-[0.14em] hover:border-[#101010] whitespace-nowrap shrink-0"
        >
          <span>Public Scouting Form</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      }
      renderExpandedRow={(app) => {
        const currentNote =
          noteDrafts[app.id] !== undefined
            ? noteDrafts[app.id]
            : app.adminNotes || '';
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                Applicant Statement &amp; Media
              </p>
              <p className="text-sm text-[#101010]/85 leading-relaxed">
                {app.introduction}
              </p>
              <p className="text-[#101010]/65">
                DOB: {app.dateOfBirth} · Experience: {app.experience} · Phone:{' '}
                {app.phone}
                {app.instagram ? ` · IG ${app.instagram}` : ''}
              </p>
              <p className="text-[#101010]/55">
                Submitted media: {app.profilePhotoName}
                {app.portfolioPhotoNames.length > 0
                  ? ` (+${app.portfolioPhotoNames.length} portfolio frames)`
                  : ''}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                Scouting Director Notes
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentNote}
                  onChange={(e) => {
                    setNoteDrafts((prev) => ({
                      ...prev,
                      [app.id]: e.target.value,
                    }));
                    setSavedNoteIds((prev) => ({ ...prev, [app.id]: false }));
                  }}
                  placeholder="Scouting director notes (go-see invite, walk test)..."
                  aria-label={`Scouting note for ${app.fullName}`}
                  className="flex-1 px-3 py-2 text-xs bg-[#FAF8F4] border border-[#101010]/20 focus:outline-none focus:border-[#632B37]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveNote(app.id, currentNote)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 border text-[11px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors cursor-pointer ${
                    savedNoteIds[app.id]
                      ? 'border-[#101010] bg-[#101010] text-[#FAF8F4]'
                      : 'border-[#101010]/25 bg-[#FAF8F4] text-[#101010] hover:border-[#101010]'
                  }`}
                >
                  {savedNoteIds[app.id] ? (
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
      rowActionItems={(app) => [
        {
          id: 'onboard',
          label: app.status === 'onboarded' ? 'Already Onboarded' : 'Onboard to Roster',
          icon: UserCheck,
          disabled: app.status === 'onboarded',
          onClick: () => dispatch(openOnboardModelEditor(app)),
        },
        {
          id: 'shortlist',
          label: 'Shortlist for Go-See',
          icon: CheckCircle2,
          disabled: app.status === 'shortlisted' || app.status === 'onboarded',
          onClick: () => handleStatusChange(app.id, 'shortlisted'),
        },
        {
          id: 'archive',
          label: 'Archive Submission',
          icon: Archive,
          disabled: app.status === 'archived',
          onClick: () => handleStatusChange(app.id, 'archived'),
        },
        {
          id: 'email',
          label: 'Email Applicant',
          icon: Mail,
          href: `mailto:${app.email}?subject=${encodeURIComponent(
            `House of Fashion Nepal — Scouting Follow-Up (${app.id})`,
          )}`,
        },
        {
          id: 'delete',
          label: 'Remove Application',
          icon: Trash2,
          variant: 'danger',
          dividerBefore: true,
          onClick: () => handleDelete(app.id),
        },
      ]}
      emptyTitle="No new model applications match your filter"
      emptyDescription="Incoming applications from the Become a Model form appear here for casting review."
    />
  );
}
