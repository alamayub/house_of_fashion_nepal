import { Edit3, ExternalLink, Plus, Star, Trash2, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { AGENCY_ASSETS } from '../../data/assets.ts';
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetClientsQuery,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from '../../features/projects/projectsApi.ts';
import type { AgencyProject, Model, ProjectCategory } from '../../types/index.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';
import { SearchableSelect } from '../common/SearchableSelect.tsx';
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from './DataTable.tsx';

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Brand Campaign',
  'Editorial',
  'Runway',
  'Commercial TVC',
  'Lookbook',
];

const PROJECT_COVER_PRESETS = [
  { label: 'Atelier Mustang Editorial', url: AGENCY_ASSETS.HERO_EDITORIAL },
  { label: 'Monolith Menswear', url: AGENCY_ASSETS.CAMPAIGN_MONOLITH },
  { label: 'Runway Couture Atelier', url: AGENCY_ASSETS.HERO_ATELIER },
  { label: 'Jhamsikhel Studio Light', url: AGENCY_ASSETS.AGENCY_STUDIO },
  { label: 'Raw Silk Portrait', url: AGENCY_ASSETS.MODEL_MAYA },
  { label: 'Botanical Beauty Frame', url: AGENCY_ASSETS.MODEL_SANJANA },
];

interface ProjectsAdminTabProps {
  models: Model[];
}

export function ProjectsAdminTab({ models }: ProjectsAdminTabProps) {
  const { data: clients = [] } = useGetClientsQuery();
  const { data: projects = [], isLoading } = useGetProjectsQuery();

  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<AgencyProject | null>(null);

  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Brand Campaign');
  const [location, setLocation] = useState('Kathmandu, Nepal');
  const [year, setYear] = useState('2026');
  const [season, setSeason] = useState('');
  const [summary, setSummary] = useState('');
  const [deliverables, setDeliverables] = useState(
    'Global Lookbook, Campaign Key Visuals',
  );
  const [coverImage, setCoverImage] = useState<string>(AGENCY_ASSETS.HERO_EDITORIAL);
  const [selectedTalentSlugs, setSelectedTalentSlugs] = useState<string[]>([]);
  const [featured, setFeatured] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);

  const openNew = () => {
    setEditingProject(null);
    setTitle('');
    setClientId(clients[0]?.id || '');
    setCategory('Brand Campaign');
    setLocation('Kathmandu, Nepal');
    setYear('2026');
    setSeason('');
    setSummary('');
    setDeliverables('Global Lookbook, Campaign Key Visuals');
    setCoverImage(AGENCY_ASSETS.HERO_EDITORIAL);
    setSelectedTalentSlugs([]);
    setFeatured(true);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (p: AgencyProject) => {
    setEditingProject(p);
    setTitle(p.title);
    setClientId(p.clientId);
    setCategory(p.category);
    setLocation(p.location);
    setYear(p.year);
    setSeason(p.season || '');
    setSummary(p.summary);
    setDeliverables(p.deliverables.join(', '));
    setCoverImage(p.coverImage);
    setSelectedTalentSlugs(p.talentSlugs);
    setFeatured(p.featured);
    setFormError(null);
    setShowForm(true);
  };

  const toggleTalentSlug = (slug: string) => {
    setSelectedTalentSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const resolvedClientId = clientId || clients[0]?.id || '';
    if (!title.trim() || !resolvedClientId) {
      setFormError('Project title and a valid client house are required.');
      return;
    }

    const parsedDeliverables = deliverables
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const resolvedCover = coverImage.trim() || AGENCY_ASSETS.HERO_EDITORIAL;

    try {
      if (editingProject) {
        await updateProject({
          id: editingProject.id,
          title: title.trim(),
          clientId: resolvedClientId,
          category,
          location: location.trim() || 'Kathmandu, Nepal',
          year: year.trim() || '2026',
          season: season.trim() || undefined,
          summary: summary.trim() || editingProject.summary,
          deliverables:
            parsedDeliverables.length > 0
              ? parsedDeliverables
              : editingProject.deliverables,
          talentSlugs: selectedTalentSlugs,
          coverImage: resolvedCover,
          gallery: editingProject.gallery.includes(resolvedCover)
            ? editingProject.gallery
            : [resolvedCover, ...editingProject.gallery],
          featured,
        }).unwrap();
      } else {
        await createProject({
          title: title.trim(),
          clientId: resolvedClientId,
          category,
          location: location.trim() || 'Kathmandu, Nepal',
          year: year.trim() || '2026',
          season: season.trim() || undefined,
          summary:
            summary.trim() ||
            'Commissioned creative direction and talent production coordinated by House of Fashion Nepal.',
          deliverables:
            parsedDeliverables.length > 0
              ? parsedDeliverables
              : ['Creative Casting', 'Editorial Production'],
          talentSlugs: selectedTalentSlugs,
          coverImage: resolvedCover,
          gallery: [resolvedCover],
          featured,
        }).unwrap();
      }

      setShowForm(false);
      setEditingProject(null);
    } catch {
      setFormError('Unable to save project commission right now. Please try again.');
    }
  };

  const handleToggleFeatured = async (p: AgencyProject) => {
    setTableError(null);
    try {
      await updateProject({ id: p.id, featured: !p.featured }).unwrap();
    } catch {
      setTableError('Unable to update project featured status right now.');
    }
  };

  const handleDelete = async (id: string) => {
    setTableError(null);
    try {
      await deleteProject(id).unwrap();
    } catch {
      setTableError('Unable to remove project right now.');
    }
  };

  const columns: DataTableColumn<AgencyProject>[] = [
    {
      id: 'title',
      header: 'Production',
      sortable: true,
      accessor: (p) => p.title,
      render: (p) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <EditorialImage
            src={p.coverImage}
            alt={p.title}
            containerClassName="w-12 h-14 shrink-0"
            className="w-full h-full object-cover"
          />
          <div className="min-w-0">
            <p className="font-serif text-lg leading-tight truncate text-[#101010]">
              {p.title}
            </p>
            <p className="text-xs text-[#101010]/60 truncate">
              {p.location}
              {p.season ? ` · ${p.season}` : ''}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'client',
      header: 'Client House',
      sortable: true,
      accessor: (p) => p.clientName,
      cellClassName: 'text-xs text-[#101010]/85 whitespace-nowrap',
      render: (p) => <span>{p.clientName}</span>,
    },
    {
      id: 'category',
      header: 'Discipline',
      sortable: true,
      accessor: (p) => p.category,
      cellClassName: 'text-xs text-[#632B37] uppercase tracking-[0.12em] whitespace-nowrap',
      render: (p) => <span>{p.category}</span>,
    },
    {
      id: 'year',
      header: 'Year',
      sortable: true,
      accessor: (p) => p.year,
      cellClassName: 'font-mono text-xs tabular-nums whitespace-nowrap',
      render: (p) => <span>{p.year}</span>,
    },
    {
      id: 'cast',
      header: 'Cast',
      sortable: true,
      sortValue: (p) => p.cast?.length ?? p.talentSlugs.length,
      cellClassName: 'font-mono text-xs tabular-nums whitespace-nowrap',
      render: (p) => {
        const count = p.cast?.length ?? p.talentSlugs.length;
        return <span>{count} Talents</span>;
      },
    },
    {
      id: 'featured',
      header: 'Featured',
      sortable: true,
      accessor: (p) => (p.featured ? 1 : 0),
      render: (p) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(p)}
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border transition-colors whitespace-nowrap ${
            p.featured
              ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
              : 'bg-[#F5F1EA] text-[#101010]/65 border-[#101010]/20 hover:border-[#101010]'
          }`}
        >
          <Star className={`w-3 h-3 ${p.featured ? 'fill-current' : ''}`} />
          <span>{p.featured ? 'Featured' : 'Standard'}</span>
        </button>
      ),
    },
  ];

  const filters: DataTableFilter<AgencyProject>[] = [
    {
      id: 'discipline',
      label: 'Filter projects by discipline',
      options: [
        { value: 'All', label: 'All Disciplines' },
        ...PROJECT_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
      ],
      predicate: (p, val) => p.category === val,
    },
    {
      id: 'featured',
      label: 'Filter by featured status',
      options: [
        { value: 'All', label: 'All Projects' },
        { value: 'featured', label: 'Featured Commissions' },
        { value: 'standard', label: 'Archive Standard' },
      ],
      predicate: (p, val) => (val === 'featured' ? p.featured : !p.featured),
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
                {editingProject ? `Editing ${editingProject.id}` : 'Commission Archive'}
              </p>
              <h2 className="font-serif text-2xl">
                {editingProject
                  ? `Update ${editingProject.title}`
                  : 'Publish Agency Project'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
              aria-label="Close project form"
              className="p-2 text-[#101010]/60 hover:text-[#101010]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prj-title" className={labelClass}>
                Project Title *
              </label>
              <input
                id="prj-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Winter Solitude Campaign"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="prj-client" className={labelClass}>
                Client House *
              </label>
              <SearchableSelect
                id="prj-client"
                value={clientId || clients[0]?.id || ''}
                onChange={setClientId}
                options={clients.map((c) => ({
                  value: c.id,
                  label: c.name,
                  hint: `${c.id} · ${c.industry}`,
                }))}
                searchPlaceholder="Search client houses..."
                tone="ivory"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="prj-cat" className={labelClass}>
                Discipline *
              </label>
              <SearchableSelect
                id="prj-cat"
                value={category}
                onChange={(val) => setCategory(val as ProjectCategory)}
                options={PROJECT_CATEGORIES.map((cat) => ({
                  value: cat,
                  label: cat,
                }))}
                searchPlaceholder="Search disciplines..."
                tone="ivory"
              />
            </div>
            <div>
              <label htmlFor="prj-year" className={labelClass}>
                Year
              </label>
              <input
                id="prj-year"
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`${inputClass} font-mono tabular-nums`}
              />
            </div>
            <div>
              <label htmlFor="prj-season" className={labelClass}>
                Season / Edition
              </label>
              <input
                id="prj-season"
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="e.g., Autumn / Winter 2026"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prj-loc" className={labelClass}>
                Shoot Location
              </label>
              <input
                id="prj-loc"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="prj-deliv" className={labelClass}>
                Deliverables (Comma-Separated)
              </label>
              <input
                id="prj-deliv"
                type="text"
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="prj-cover" className={labelClass}>
              Cover Image URL or Preset
            </label>
            <input
              id="prj-cover"
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className={inputClass}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {PROJECT_COVER_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  className={`px-2.5 py-1 text-[11px] border ${
                    coverImage === preset.url
                      ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
                      : 'bg-[#F5F1EA] text-[#101010]/70 border-[#101010]/15'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className={labelClass}>Cast Agency Talent</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-2.5 bg-[#F5F1EA] border border-[#101010]/15">
              {models.map((m) => {
                const selected = selectedTalentSlugs.includes(m.slug);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleTalentSlug(m.slug)}
                    className={`px-2.5 py-1.5 text-xs text-left border truncate ${
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

          <div>
            <label htmlFor="prj-summary" className={labelClass}>
              Creative Brief &amp; Summary
            </label>
            <textarea
              id="prj-summary"
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Production narrative, lighting direction, and campaign usage."
              className={inputClass}
            />
          </div>

          {formError && (
            <p className="text-xs text-[#632B37]" role="alert">
              {formError}
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
                Highlight as Featured Commission
              </span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
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
                  : editingProject
                    ? 'Save Changes'
                    : 'Publish Project'}
              </button>
            </div>
          </div>
        </form>
      )}

      <DataTable
        data={projects}
        columns={columns}
        getRowId={(p) => p.id}
        searchPlaceholder="Search projects by title, client, or location..."
        searchAriaLabel="Search projects"
        searchPredicate={(p, q) =>
          p.title.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
        }
        filters={filters}
        isLoading={isLoading}
        error={tableError}
        itemLabel="projects"
        defaultPageSize={8}
        defaultSort={{ columnId: 'year', direction: 'desc' }}
        exportConfig={{
          filename: 'hof-nepal-projects.csv',
          columns: [
            { label: 'ID', value: (p) => p.id },
            { label: 'Title', value: (p) => p.title },
            { label: 'Client', value: (p) => p.clientName },
            { label: 'Discipline', value: (p) => p.category },
            { label: 'Location', value: (p) => p.location },
            { label: 'Year', value: (p) => p.year },
            { label: 'Featured', value: (p) => (p.featured ? 'Yes' : 'No') },
          ],
        }}
        toolbarActions={
          <>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#101010]/20 bg-[#F5F1EA] text-xs uppercase tracking-[0.14em] hover:border-[#101010] whitespace-nowrap shrink-0"
            >
              <span>Public Showcase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() =>
                showForm && !editingProject ? setShowForm(false) : openNew()
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#632B37] transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {showForm && !editingProject ? 'Close Form' : 'Publish Project'}
              </span>
            </button>
          </>
        }
        renderExpandedRow={(p) => (
          <div className="space-y-2 text-xs">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
              Creative Brief &amp; Deliverables
            </p>
            <p className="text-sm text-[#101010]/80 leading-relaxed max-w-3xl">
              {p.summary}
            </p>
            <p className="text-[#101010]/65 pt-1">
              Deliverables: {p.deliverables.join(' · ')}
            </p>
            {p.cast && p.cast.length > 0 && (
              <p className="text-[#101010]/65">
                Cast: {p.cast.map((c) => c.name).join(' · ')}
              </p>
            )}
          </div>
        )}
        rowActionItems={(p) => [
          {
            id: 'edit',
            label: 'Edit Project',
            icon: Edit3,
            onClick: () => openEdit(p),
          },
          {
            id: 'view-showcase',
            label: 'View Public Showcase',
            icon: ExternalLink,
            to: '/projects',
          },
          {
            id: 'toggle-featured',
            label: p.featured ? 'Set Archive Standard' : 'Feature Commission',
            icon: Star,
            onClick: () => handleToggleFeatured(p),
          },
          {
            id: 'delete',
            label: 'Delete Project',
            icon: Trash2,
            variant: 'danger',
            dividerBefore: true,
            onClick: () => handleDelete(p.id),
          },
        ]}
        emptyTitle="No projects match your current filter"
        emptyDescription="Reset search filters or publish a new campaign production."
        emptyAction={{
          label: 'Publish Project',
          onClick: openNew,
        }}
      />
    </div>
  );
}
