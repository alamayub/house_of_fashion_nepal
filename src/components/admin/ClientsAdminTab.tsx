import { Edit3, Plus, Star, Trash2, X } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import {
  useCreateClientMutation,
  useDeleteClientMutation,
  useGetClientsQuery,
  useGetProjectsQuery,
  useUpdateClientMutation,
} from '../../features/projects/projectsApi.ts';
import type { ClientPartner } from '../../types/index.ts';
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from './DataTable.tsx';

export function ClientsAdminTab() {
  const { data: clients = [], isLoading } = useGetClientsQuery();
  const { data: projects = [] } = useGetProjectsQuery();
  const [createClient, { isLoading: creating }] = useCreateClientMutation();
  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientPartner | null>(null);

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('Kathmandu, Nepal');
  const [yearSince, setYearSince] = useState('2026');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);

  const openNew = () => {
    setEditingClient(null);
    setName('');
    setIndustry('');
    setLocation('Kathmandu, Nepal');
    setYearSince(String(new Date().getFullYear()));
    setDescription('');
    setFeatured(true);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (client: ClientPartner) => {
    setEditingClient(client);
    setName(client.name);
    setIndustry(client.industry);
    setLocation(client.location);
    setYearSince(String(client.yearSince));
    setDescription(client.description);
    setFeatured(client.featured);
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !industry.trim()) {
      setError('Client name and industry sector are required.');
      return;
    }

    try {
      if (editingClient) {
        await updateClient({
          id: editingClient.id,
          name: name.trim(),
          industry: industry.trim(),
          location: location.trim() || 'Kathmandu, Nepal',
          yearSince: Number(yearSince) || editingClient.yearSince,
          description: description.trim() || editingClient.description,
          featured,
        }).unwrap();
      } else {
        await createClient({
          name: name.trim(),
          industry: industry.trim(),
          location: location.trim() || 'Kathmandu, Nepal',
          yearSince: Number(yearSince) || new Date().getFullYear(),
          description:
            description.trim() ||
            `${name.trim()} partners with House of Fashion Nepal for editorial casting and commercial production.`,
          featured,
        }).unwrap();
      }

      setShowForm(false);
      setEditingClient(null);
    } catch {
      setError('Unable to save client record right now. Please try again.');
    }
  };

  const handleToggleFeatured = async (client: ClientPartner) => {
    setTableError(null);
    try {
      await updateClient({ id: client.id, featured: !client.featured }).unwrap();
    } catch {
      setTableError('Unable to update client featured status right now.');
    }
  };

  const handleDelete = async (id: string) => {
    setTableError(null);
    try {
      await deleteClient(id).unwrap();
    } catch {
      setTableError('Unable to remove client house right now.');
    }
  };

  const industries = useMemo(
    () =>
      Array.from(new Set(clients.map((c) => c.industry))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [clients],
  );

  const projectCountByClient = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) {
      map.set(p.clientId, (map.get(p.clientId) ?? 0) + 1);
    }
    return map;
  }, [projects]);

  const columns: DataTableColumn<ClientPartner>[] = [
    {
      id: 'name',
      header: 'Client House',
      sortable: true,
      accessor: (c) => c.name,
      render: (c) => (
        <div className="min-w-[180px]">
          <p className="font-serif text-lg leading-tight text-[#101010]">{c.name}</p>
          <p className="text-xs text-[#101010]/60 font-mono">{c.id}</p>
        </div>
      ),
    },
    {
      id: 'industry',
      header: 'Industry',
      sortable: true,
      accessor: (c) => c.industry,
      cellClassName: 'text-xs text-[#101010]/80',
      render: (c) => <span>{c.industry}</span>,
    },
    {
      id: 'location',
      header: 'Location',
      sortable: true,
      accessor: (c) => c.location,
      cellClassName: 'text-xs text-[#101010]/70 whitespace-nowrap',
      render: (c) => <span>{c.location}</span>,
    },
    {
      id: 'yearSince',
      header: 'Since',
      sortable: true,
      accessor: (c) => c.yearSince,
      cellClassName: 'font-mono text-xs tabular-nums whitespace-nowrap',
      render: (c) => <span>{c.yearSince}</span>,
    },
    {
      id: 'projects',
      header: 'Projects',
      sortable: true,
      sortValue: (c) => projectCountByClient.get(c.id) ?? 0,
      cellClassName: 'font-mono text-xs tabular-nums whitespace-nowrap',
      render: (c) => {
        const count = projectCountByClient.get(c.id) ?? 0;
        return (
          <span>
            {count} {count === 1 ? 'Project' : 'Projects'}
          </span>
        );
      },
    },
    {
      id: 'featured',
      header: 'Featured',
      sortable: true,
      accessor: (c) => (c.featured ? 1 : 0),
      render: (c) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(c)}
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border transition-colors whitespace-nowrap ${
            c.featured
              ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
              : 'bg-[#F5F1EA] text-[#101010]/65 border-[#101010]/20 hover:border-[#101010]'
          }`}
        >
          <Star className={`w-3 h-3 ${c.featured ? 'fill-current' : ''}`} />
          <span>{c.featured ? 'Featured' : 'Standard'}</span>
        </button>
      ),
    },
  ];

  const filters: DataTableFilter<ClientPartner>[] = [
    {
      id: 'industry',
      label: 'Filter by industry',
      options: [
        { value: 'All', label: 'All Industries' },
        ...industries.map((ind) => ({ value: ind, label: ind })),
      ],
      predicate: (c, val) => c.industry === val,
    },
    {
      id: 'visibility',
      label: 'Filter by featured status',
      options: [
        { value: 'All', label: 'All Partners' },
        { value: 'featured', label: 'Featured on Home' },
        { value: 'standard', label: 'Standard' },
      ],
      predicate: (c, val) => (val === 'featured' ? c.featured : !c.featured),
    },
  ];

  const labelClass =
    'block text-[11px] uppercase tracking-[0.16em] text-[#101010]/65 mb-1.5';
  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#F5F1EA] border border-[#101010]/20 text-[#101010] focus:outline-none focus:border-[#632B37]';

  return (
    <div className="space-y-6">
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-[#FAF8F4] border border-[#101010]/20 space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#101010]/10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37]">
                {editingClient ? `Editing ${editingClient.id}` : 'Partner Onboarding'}
              </p>
              <h2 className="font-serif text-2xl">
                {editingClient ? `Update ${editingClient.name}` : 'Add Client House'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingClient(null);
              }}
              aria-label="Close client form"
              className="p-2 text-[#101010]/60 hover:text-[#101010]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="cl-name" className={labelClass}>
                Client / Brand Name *
              </label>
              <input
                id="cl-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sherpa Heritage Looms"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cl-industry" className={labelClass}>
                Industry *
              </label>
              <input
                id="cl-industry"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Luxury Apparel"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cl-loc" className={labelClass}>
                City / Region
              </label>
              <input
                id="cl-loc"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cl-year" className={labelClass}>
                Partner Since
              </label>
              <input
                id="cl-year"
                type="number"
                value={yearSince}
                onChange={(e) => setYearSince(e.target.value)}
                className={`${inputClass} font-mono tabular-nums`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="cl-desc" className={labelClass}>
              Partnership Brief
            </label>
            <textarea
              id="cl-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of brand collaborations and creative focus."
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-xs text-[#632B37]" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#101010]/10">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#632B37]"
              />
              <span className="text-xs text-[#101010]/75">
                Feature on Homepage Client Roster
              </span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingClient(null);
                }}
                className="px-5 py-2.5 border border-[#101010]/20 text-xs uppercase tracking-[0.16em]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || updating}
                className="px-6 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors disabled:opacity-60"
              >
                {creating || updating
                  ? 'Saving...'
                  : editingClient
                    ? 'Save Changes'
                    : 'Create Client'}
              </button>
            </div>
          </div>
        </form>
      )}

      <DataTable
        data={clients}
        columns={columns}
        getRowId={(c) => c.id}
        searchPlaceholder="Search client houses by name, sector, or city..."
        searchAriaLabel="Search clients"
        searchPredicate={(c, q) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        }
        filters={filters}
        isLoading={isLoading}
        error={tableError}
        itemLabel="clients"
        defaultPageSize={8}
        defaultSort={{ columnId: 'name', direction: 'asc' }}
        exportConfig={{
          filename: 'hof-nepal-clients.csv',
          columns: [
            { label: 'ID', value: (c) => c.id },
            { label: 'Name', value: (c) => c.name },
            { label: 'Industry', value: (c) => c.industry },
            { label: 'Location', value: (c) => c.location },
            { label: 'Partner Since', value: (c) => c.yearSince },
            { label: 'Featured', value: (c) => (c.featured ? 'Yes' : 'No') },
          ],
        }}
        toolbarActions={
          <button
            type="button"
            onClick={() => (showForm && !editingClient ? setShowForm(false) : openNew())}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#632B37] transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showForm && !editingClient ? 'Close Form' : 'Add Client House'}</span>
          </button>
        }
        renderExpandedRow={(c) => {
          const linked = projects.filter((p) => p.clientId === c.id);
          return (
            <div className="space-y-2 text-xs">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                Partnership Brief
              </p>
              <p className="text-sm text-[#101010]/80 leading-relaxed max-w-3xl">
                {c.description}
              </p>
              {linked.length > 0 && (
                <p className="text-[#101010]/65 pt-1">
                  Commissions: {linked.map((p) => p.title).join(' · ')}
                </p>
              )}
            </div>
          );
        }}
        rowActionItems={(c) => [
          {
            id: 'edit',
            label: 'Edit Client House',
            icon: Edit3,
            onClick: () => openEdit(c),
          },
          {
            id: 'toggle-featured',
            label: c.featured ? 'Set Standard' : 'Feature on Home',
            icon: Star,
            onClick: () => handleToggleFeatured(c),
          },
          {
            id: 'delete',
            label: 'Remove Client',
            icon: Trash2,
            variant: 'danger',
            dividerBefore: true,
            onClick: () => handleDelete(c.id),
          },
        ]}
        emptyTitle="No client houses match your filter"
        emptyDescription="Reset search filters or onboard a new brand or agency partner."
        emptyAction={{
          label: 'Add Client House',
          onClick: openNew,
        }}
      />
    </div>
  );
}
