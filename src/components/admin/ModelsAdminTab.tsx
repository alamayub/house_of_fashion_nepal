import {
  Ban,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  LogOut,
  PauseCircle,
  Plus,
  Star,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { MODEL_STATUS_LIST, MODEL_STATUS_MAP } from '../../constants/modelStatus.ts';
import {
  openCreateModelEditor,
  openEditModelEditor,
  setDeleteTargetId,
  setRosterAvailability,
  setRosterSearch,
  setRosterStatus,
} from '../../features/admin/adminSlice.ts';
import { useUpdateModelMutation } from '../../features/models/modelsApi.ts';
import type { AvailabilityStatus, Model, ModelStatus } from '../../types/index.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';
import { SearchableSelect } from '../common/SearchableSelect.tsx';
import {
  DataTable,
  type DataTableBulkAction,
  type DataTableColumn,
  type DataTableFilter,
} from './DataTable.tsx';

interface ModelsAdminTabProps {
  models: Model[];
  isLoading: boolean;
}

export function ModelsAdminTab({ models, isLoading }: ModelsAdminTabProps) {
  const dispatch = useAppDispatch();
  const { rosterSearch, rosterAvailability, rosterStatus } = useAppSelector(
    (s) => s.admin,
  );
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [actionError, setActionError] = useState<string | null>(null);
  const [updateModel] = useUpdateModelMutation();

  const allCategories = useMemo(
    () =>
      Array.from(new Set(models.flatMap((m) => m.category))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [models],
  );

  const allTiers = useMemo(
    () =>
      Array.from(new Set(models.map((m) => m.experienceLevel))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [models],
  );

  const handleAvailabilityChange = async (
    id: string,
    availability: AvailabilityStatus,
  ) => {
    setActionError(null);
    try {
      await updateModel({ id, availability }).unwrap();
    } catch {
      setActionError('Unable to update model availability right now.');
    }
  };

  const handleRosterStatusChange = async (id: string, status: ModelStatus) => {
    setActionError(null);
    try {
      await updateModel({ id, status }).unwrap();
    } catch {
      setActionError('Unable to update model roster status right now.');
    }
  };

  const handleToggleFeatured = async (m: Model) => {
    setActionError(null);
    try {
      await updateModel({ id: m.id, featured: !m.featured }).unwrap();
    } catch {
      setActionError('Unable to update featured status right now.');
    }
  };

  const columns: DataTableColumn<Model>[] = [
    {
      id: 'name',
      header: 'Talent',
      sortable: true,
      accessor: (m) => m.name,
      render: (m) => {
        const modelStatus = m.status || 'active';
        const statusMeta = MODEL_STATUS_MAP[modelStatus];
        return (
          <div className="flex items-center gap-3 min-w-[205px]">
            <EditorialImage
              src={m.coverImage}
              alt={m.name}
              containerClassName="w-10 h-12 shrink-0"
              className={`w-full h-full object-cover object-top ${
                modelStatus !== 'active' ? 'opacity-55 grayscale-[45%]' : ''
              }`}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-serif text-lg leading-tight truncate text-[#101010]">
                  {m.name}
                </p>
                {modelStatus !== 'active' && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] border shrink-0 ${statusMeta.badgeClass}`}
                  >
                    {statusMeta.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#101010]/60 truncate">
                {m.gender} · {m.experienceLevel} · {m.location}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: 'id',
      header: 'ID',
      sortable: true,
      accessor: (m) => m.id,
      cellClassName: 'font-mono text-xs tabular-nums whitespace-nowrap',
      render: (m) => <span>{m.id}</span>,
    },
    {
      id: 'divisions',
      header: 'Divisions',
      accessor: (m) => m.category.join(' · '),
      cellClassName: 'text-xs text-[#101010]/75 max-w-[220px]',
      render: (m) => (
        <span className="line-clamp-2">{m.category.slice(0, 3).join(' · ')}</span>
      ),
    },
    {
      id: 'height',
      header: 'Height',
      sortable: true,
      accessor: (m) => m.height,
      cellClassName: 'font-mono text-xs tabular-nums whitespace-nowrap',
      render: (m) => <span>{m.height} cm</span>,
    },
    {
      id: 'media',
      header: 'Media',
      sortable: true,
      sortValue: (m) => m.gallery.length + (m.videos?.length ?? 0),
      cellClassName: 'text-xs text-[#101010]/70 tabular-nums whitespace-nowrap',
      render: (m) => (
        <span>
          {m.gallery.length} Photos · {m.videos?.length ?? 0} Videos
        </span>
      ),
    },
    {
      id: 'featured',
      header: 'Featured',
      sortable: true,
      accessor: (m) => (m.featured ? 1 : 0),
      render: (m) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(m)}
          aria-label={
            m.featured ? `Remove ${m.name} from featured` : `Feature ${m.name}`
          }
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border transition-colors whitespace-nowrap ${
            m.featured
              ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
              : 'bg-[#F5F1EA] text-[#101010]/65 border-[#101010]/20 hover:border-[#101010]'
          }`}
        >
          <Star className={`w-3 h-3 ${m.featured ? 'fill-current' : ''}`} />
          <span>{m.featured ? 'Featured' : 'Standard'}</span>
        </button>
      ),
    },
    {
      id: 'availability',
      header: 'Availability',
      sortable: true,
      accessor: (m) => m.availability,
      render: (m) => (
        <div className="min-w-[148px]">
          <SearchableSelect
            ariaLabel={`Availability for ${m.name}`}
            value={m.availability}
            onChange={(val) =>
              handleAvailabilityChange(m.id, val as AvailabilityStatus)
            }
            options={[
              { value: 'available', label: 'Available' },
              { value: 'booked', label: 'Booked / Option' },
              { value: 'unavailable', label: 'Unavailable' },
            ]}
            searchPlaceholder="Search availability..."
            tone="ivory"
            size="sm"
            menuMinWidth={200}
          />
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      accessor: (m) => m.status || 'active',
      render: (m) => {
        const currentStatus = m.status || 'active';
        const statusMeta = MODEL_STATUS_MAP[currentStatus];
        return (
          <div className="min-w-[155px] flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`w-2 h-2 rounded-full shrink-0 ${statusMeta.dotClass}`}
            />
            <div className="flex-1 min-w-0">
              <SearchableSelect
                ariaLabel={`Roster status for ${m.name}`}
                value={currentStatus}
                onChange={(val) =>
                  handleRosterStatusChange(m.id, val as ModelStatus)
                }
                options={MODEL_STATUS_LIST.map((item) => ({
                  value: item.value,
                  label: item.label,
                  hint: item.hint,
                }))}
                searchPlaceholder="Search status..."
                tone="ivory"
                size="sm"
                menuMinWidth={230}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const filters: DataTableFilter<Model>[] = [
    {
      id: 'status',
      label: 'Filter by status',
      value: rosterStatus,
      onChange: (val) => dispatch(setRosterStatus(val)),
      options: [
        { value: 'All', label: 'All Statuses' },
        ...MODEL_STATUS_LIST.map((item) => ({
          value: item.value,
          label: item.label,
          hint: item.hint,
        })),
      ],
      predicate: (m, val) => (m.status || 'active') === val,
    },
    {
      id: 'division',
      label: 'Filter by division',
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [
        { value: 'All', label: 'All Divisions' },
        ...allCategories.map((cat) => ({ value: cat, label: cat })),
      ],
      predicate: (m, val) => m.category.includes(val),
    },
    {
      id: 'tier',
      label: 'Filter by board tier',
      value: tierFilter,
      onChange: setTierFilter,
      options: [
        { value: 'All', label: 'All Tiers' },
        ...allTiers.map((tier) => ({ value: tier, label: tier })),
      ],
      predicate: (m, val) => m.experienceLevel === val,
    },
    {
      id: 'availability',
      label: 'Filter by availability',
      value: rosterAvailability,
      onChange: (val) => dispatch(setRosterAvailability(val)),
      options: [
        { value: 'All', label: 'All Availability' },
        { value: 'available', label: 'Available' },
        { value: 'booked', label: 'Booked / On Option' },
        { value: 'unavailable', label: 'Unavailable' },
      ],
      predicate: (m, val) => m.availability === val,
    },
  ];

  const bulkActions: DataTableBulkAction<Model>[] = [
    {
      id: 'status-active',
      label: 'Set Status: Active',
      onAction: async (selected, clearSelection) => {
        setActionError(null);
        try {
          await Promise.all(
            selected.map((m) =>
              updateModel({ id: m.id, status: 'active' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setActionError('Unable to update selected models.');
        }
      },
    },
    {
      id: 'status-inactive',
      label: 'Set Status: Inactive',
      onAction: async (selected, clearSelection) => {
        setActionError(null);
        try {
          await Promise.all(
            selected.map((m) =>
              updateModel({ id: m.id, status: 'inactive' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setActionError('Unable to update selected models.');
        }
      },
    },
    {
      id: 'status-banned',
      label: 'Set Status: Banned',
      variant: 'danger',
      onAction: async (selected, clearSelection) => {
        setActionError(null);
        try {
          await Promise.all(
            selected.map((m) =>
              updateModel({ id: m.id, status: 'banned' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setActionError('Unable to update selected models.');
        }
      },
    },
    {
      id: 'status-left',
      label: 'Set Status: Left Agency',
      onAction: async (selected, clearSelection) => {
        setActionError(null);
        try {
          await Promise.all(
            selected.map((m) =>
              updateModel({ id: m.id, status: 'left' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setActionError('Unable to update selected models.');
        }
      },
    },
    {
      id: 'set-available',
      label: 'Mark Available',
      onAction: async (selected, clearSelection) => {
        setActionError(null);
        try {
          await Promise.all(
            selected.map((m) =>
              updateModel({ id: m.id, availability: 'available' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setActionError('Unable to update selected models.');
        }
      },
    },
    {
      id: 'set-booked',
      label: 'Mark Booked',
      onAction: async (selected, clearSelection) => {
        setActionError(null);
        try {
          await Promise.all(
            selected.map((m) =>
              updateModel({ id: m.id, availability: 'booked' }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setActionError('Unable to update selected models.');
        }
      },
    },
    {
      id: 'toggle-feature',
      label: 'Feature Selected',
      onAction: async (selected, clearSelection) => {
        setActionError(null);
        try {
          await Promise.all(
            selected.map((m) =>
              updateModel({ id: m.id, featured: true }).unwrap(),
            ),
          );
          clearSelection();
        } catch {
          setActionError('Unable to feature selected models.');
        }
      },
    },
  ];

  return (
    <DataTable
      data={models}
      columns={columns}
      getRowId={(m) => m.id}
      searchValue={rosterSearch}
      onSearchChange={(val) => dispatch(setRosterSearch(val))}
      searchPlaceholder="Search by name, ID, status, category, or city..."
      searchAriaLabel="Filter roster"
      searchPredicate={(m, q) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.experienceLevel.toLowerCase().includes(q) ||
        (m.status || 'active').toLowerCase().includes(q) ||
        MODEL_STATUS_MAP[m.status || 'active'].label.toLowerCase().includes(q) ||
        m.category.some((c) => c.toLowerCase().includes(q))
      }
      filters={filters}
      selectable
      bulkActions={bulkActions}
      isLoading={isLoading}
      error={actionError}
      itemLabel="models"
      defaultPageSize={8}
      defaultSort={{ columnId: 'name', direction: 'asc' }}
      exportConfig={{
        filename: 'hof-nepal-talent-roster.csv',
        columns: [
          { label: 'ID', value: (m) => m.id },
          { label: 'Name', value: (m) => m.name },
          { label: 'Gender', value: (m) => m.gender },
          { label: 'Tier', value: (m) => m.experienceLevel },
          { label: 'Location', value: (m) => m.location },
          { label: 'Height (cm)', value: (m) => m.height },
          { label: 'Divisions', value: (m) => m.category.join(' | ') },
          { label: 'Availability', value: (m) => m.availability },
          {
            label: 'Status',
            value: (m) => MODEL_STATUS_MAP[m.status || 'active'].label,
          },
          { label: 'Featured', value: (m) => (m.featured ? 'Yes' : 'No') },
        ],
      }}
      toolbarActions={
        <button
          type="button"
          onClick={() => dispatch(openCreateModelEditor())}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#632B37] transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Model</span>
        </button>
      }
      rowActionItems={(m) => {
        const currentStatus = m.status || 'active';
        return [
          {
            id: 'view-public',
            label: 'View Public Profile',
            icon: ExternalLink,
            to: `/models/${m.slug}`,
          },
          {
            id: 'edit',
            label: 'Edit Profile & Media',
            icon: Edit3,
            onClick: () => dispatch(openEditModelEditor(m.id)),
          },
          {
            id: 'toggle-featured',
            label: m.featured ? 'Remove from Featured' : 'Feature on Home',
            icon: Star,
            onClick: () => handleToggleFeatured(m),
          },
          {
            id: 'mark-available',
            label: 'Set Available',
            icon: CheckCircle2,
            disabled: m.availability === 'available',
            dividerBefore: true,
            onClick: () => handleAvailabilityChange(m.id, 'available'),
          },
          {
            id: 'mark-booked',
            label: 'Mark Booked / Option',
            icon: Clock,
            disabled: m.availability === 'booked',
            onClick: () => handleAvailabilityChange(m.id, 'booked'),
          },
          {
            id: 'status-active',
            label: 'Status: Active',
            icon: UserCheck,
            disabled: currentStatus === 'active',
            dividerBefore: true,
            onClick: () => handleRosterStatusChange(m.id, 'active'),
          },
          {
            id: 'status-inactive',
            label: 'Status: Inactive',
            icon: PauseCircle,
            disabled: currentStatus === 'inactive',
            onClick: () => handleRosterStatusChange(m.id, 'inactive'),
          },
          {
            id: 'status-left',
            label: 'Status: Left Agency',
            icon: LogOut,
            disabled: currentStatus === 'left',
            onClick: () => handleRosterStatusChange(m.id, 'left'),
          },
          {
            id: 'status-banned',
            label: 'Status: Banned',
            icon: Ban,
            variant: 'danger',
            disabled: currentStatus === 'banned',
            onClick: () => handleRosterStatusChange(m.id, 'banned'),
          },
          {
            id: 'delete',
            label: 'Delete Profile',
            icon: Trash2,
            variant: 'danger',
            dividerBefore: true,
            onClick: () => dispatch(setDeleteTargetId(m.id)),
          },
        ];
      }}
      emptyTitle="No models match your filter"
      emptyDescription="Try clearing search keywords or resetting the status, division, and availability filters."
      emptyAction={{
        label: 'Add New Model',
        onClick: () => dispatch(openCreateModelEditor()),
      }}
    />
  );
}
