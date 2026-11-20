import { Check, CheckCircle2, Clock, Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  useDeleteContactMutation,
  useUpdateContactMutation,
} from '../../features/bookings/bookingsApi.ts';
import type { ContactRecord } from '../../types/index.ts';
import { SearchableSelect } from '../common/SearchableSelect.tsx';
import {
  DataTable,
  type DataTableBulkAction,
  type DataTableColumn,
  type DataTableFilter,
} from './DataTable.tsx';

interface EnquiriesAdminTabProps {
  enquiries: ContactRecord[];
  isLoading: boolean;
}

const ENQUIRY_STATUS_OPTIONS: Array<{
  value: ContactRecord['status'];
  label: string;
}> = [
  { value: 'new', label: 'New Enquiry' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

export function EnquiriesAdminTab({
  enquiries,
  isLoading,
}: EnquiriesAdminTabProps) {
  const [updateContact] = useUpdateContactMutation();
  const [deleteContact] = useDeleteContactMutation();

  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savedNoteIds, setSavedNoteIds] = useState<Record<string, boolean>>({});
  const [tableError, setTableError] = useState<string | null>(null);

  const handleStatusChange = async (
    id: string,
    status: ContactRecord['status'],
  ) => {
    setTableError(null);
    try {
      await updateContact({ id, status }).unwrap();
    } catch {
      setTableError('Unable to update enquiry status right now.');
    }
  };

  const handleSaveNote = async (id: string, note: string) => {
    setTableError(null);
    try {
      await updateContact({ id, adminNotes: note.trim() }).unwrap();
      setSavedNoteIds((prev) => ({ ...prev, [id]: true }));
      window.setTimeout(() => {
        setSavedNoteIds((prev) => ({ ...prev, [id]: false }));
      }, 2200);
    } catch {
      setTableError('Unable to save enquiry note right now.');
    }
  };

  const handleDelete = async (id: string) => {
    setTableError(null);
    try {
      await deleteContact(id).unwrap();
    } catch {
      setTableError('Unable to delete enquiry right now.');
    }
  };

  const columns: DataTableColumn<ContactRecord>[] = [
    {
      id: 'id',
      header: 'Enquiry ID',
      sortable: true,
      accessor: (c) => c.id,
      cellClassName: 'font-mono text-xs text-[#632B37] whitespace-nowrap',
      render: (c) => <span>{c.id}</span>,
    },
    {
      id: 'sender',
      header: 'Sender & Brand',
      sortable: true,
      accessor: (c) => c.name,
      render: (c) => (
        <div className="min-w-[180px]">
          <p className="font-serif text-lg leading-tight text-[#101010]">
            {c.name}
            {c.company ? ` · ${c.company}` : ''}
          </p>
          <p className="text-xs text-[#101010]/60 truncate">{c.email}</p>
        </div>
      ),
    },
    {
      id: 'subject',
      header: 'Subject',
      sortable: true,
      accessor: (c) => c.subject,
      cellClassName: 'text-xs text-[#101010]/85 max-w-[260px]',
      render: (c) => (
        <div className="min-w-[160px]">
          <p className="font-medium text-[#101010] truncate">{c.subject}</p>
          <p className="text-[#101010]/60 truncate">{c.message}</p>
        </div>
      ),
    },
    {
      id: 'createdAt',
      header: 'Logged',
      sortable: true,
      accessor: (c) => c.createdAt,
      cellClassName: 'font-mono text-xs tabular-nums text-[#101010]/65 whitespace-nowrap',
      render: (c) => <span>{c.createdAt.slice(0, 10)}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      accessor: (c) => c.status,
      render: (c) => (
        <div className="min-w-[155px]">
          <SearchableSelect
            ariaLabel={`Status for enquiry ${c.id}`}
            value={c.status}
            onChange={(val) =>
              handleStatusChange(c.id, val as ContactRecord['status'])
            }
            options={ENQUIRY_STATUS_OPTIONS}
            searchPlaceholder="Search status..."
            tone="ivory"
            size="sm"
            menuMinWidth={200}
            className="uppercase tracking-[0.12em]"
          />
        </div>
      ),
    },
  ];

  const filters: DataTableFilter<ContactRecord>[] = [
    {
      id: 'status',
      label: 'Filter enquiries by status',
      options: [
        { value: 'All', label: 'All Enquiries' },
        { value: 'new', label: 'New' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
      ],
      predicate: (c, val) => c.status === val,
    },
  ];

  const bulkActions: DataTableBulkAction<ContactRecord>[] = [
    {
      id: 'mark-progress',
      label: 'Mark In Progress',
      onAction: async (selected, clearSelection) => {
        setTableError(null);
        try {
          await Promise.all(
            selected.map((c) =>
              updateContact({ id: c.id, status: 'in-progress' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setTableError('Unable to update selected enquiries.');
        }
      },
    },
    {
      id: 'mark-resolved',
      label: 'Resolve Selected',
      onAction: async (selected, clearSelection) => {
        setTableError(null);
        try {
          await Promise.all(
            selected.map((c) =>
              updateContact({ id: c.id, status: 'resolved' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setTableError('Unable to resolve selected enquiries.');
        }
      },
    },
  ];

  return (
    <DataTable
      data={enquiries}
      columns={columns}
      getRowId={(c) => c.id}
      searchPlaceholder="Search enquiries by sender, brand, subject, or message..."
      searchAriaLabel="Search enquiries"
      searchPredicate={(c, q) =>
        c.name.toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      }
      filters={filters}
      selectable
      bulkActions={bulkActions}
      isLoading={isLoading}
      error={tableError}
      itemLabel="enquiries"
      defaultPageSize={8}
      defaultSort={{ columnId: 'createdAt', direction: 'desc' }}
      exportConfig={{
        filename: 'hof-nepal-enquiries.csv',
        columns: [
          { label: 'ID', value: (c) => c.id },
          { label: 'Sender', value: (c) => c.name },
          { label: 'Company', value: (c) => c.company || '' },
          { label: 'Email', value: (c) => c.email },
          { label: 'Subject', value: (c) => c.subject },
          { label: 'Status', value: (c) => c.status },
          { label: 'Logged', value: (c) => c.createdAt.slice(0, 10) },
        ],
      }}
      renderExpandedRow={(c) => {
        const currentNote =
          noteDrafts[c.id] !== undefined ? noteDrafts[c.id] : c.adminNotes || '';
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                Full Message
              </p>
              <p className="text-sm text-[#101010]/85 leading-relaxed">
                {c.message}
              </p>
              {c.phone && <p className="text-[#101010]/60">Phone: {c.phone}</p>}
            </div>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                Internal Response Log
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentNote}
                  onChange={(e) => {
                    setNoteDrafts((prev) => ({
                      ...prev,
                      [c.id]: e.target.value,
                    }));
                    setSavedNoteIds((prev) => ({ ...prev, [c.id]: false }));
                  }}
                  placeholder="Internal response log or casting lead..."
                  aria-label={`Agency note for enquiry ${c.id}`}
                  className="flex-1 px-3 py-2 text-xs bg-[#FAF8F4] border border-[#101010]/20 focus:outline-none focus:border-[#632B37]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveNote(c.id, currentNote)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 border text-[11px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors cursor-pointer ${
                    savedNoteIds[c.id]
                      ? 'border-[#101010] bg-[#101010] text-[#FAF8F4]'
                      : 'border-[#101010]/25 bg-[#FAF8F4] text-[#101010] hover:border-[#101010]'
                  }`}
                >
                  {savedNoteIds[c.id] ? (
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
      rowActionItems={(c) => [
        {
          id: 'in-progress',
          label: 'Mark In Progress',
          icon: Clock,
          disabled: c.status === 'in-progress',
          onClick: () => handleStatusChange(c.id, 'in-progress'),
        },
        {
          id: 'resolve',
          label: 'Mark Resolved',
          icon: CheckCircle2,
          disabled: c.status === 'resolved',
          onClick: () => handleStatusChange(c.id, 'resolved'),
        },
        {
          id: 'reply',
          label: 'Reply via Email',
          icon: Mail,
          href: `mailto:${c.email}?subject=${encodeURIComponent(
            `Re: ${c.subject} — House of Fashion Nepal`,
          )}`,
        },
        {
          id: 'delete',
          label: 'Remove Enquiry',
          icon: Trash2,
          variant: 'danger',
          dividerBefore: true,
          onClick: () => handleDelete(c.id),
        },
      ]}
      emptyTitle="No enquiries match your filter"
      emptyDescription="General contact messages and press inquiries submitted through the public site appear here."
    />
  );
}
