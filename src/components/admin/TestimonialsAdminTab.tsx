import { ExternalLink, Plus, Star, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { AGENCY_ASSETS } from '../../data/assets.ts';
import {
  useCreateTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetTestimonialsQuery,
  useUpdateTestimonialMutation,
} from '../../features/testimonials/testimonialsApi.ts';
import type {
  Model,
  Testimonial,
  TestimonialPerspective,
} from '../../types/index.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';
import { SearchableSelect } from '../common/SearchableSelect.tsx';
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from './DataTable.tsx';

interface TestimonialsAdminTabProps {
  models: Model[];
}

export function TestimonialsAdminTab({ models }: TestimonialsAdminTabProps) {
  const { data: testimonials = [], isLoading } = useGetTestimonialsQuery();
  const [createTestimonial, { isLoading: isCreating }] =
    useCreateTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const [perspective, setPerspective] = useState<TestimonialPerspective>('client');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [organizationOrBoard, setOrganizationOrBoard] = useState('');
  const [location, setLocation] = useState('Kathmandu, Nepal');
  const [projectOrCampaign, setProjectOrCampaign] = useState('');
  const [relatedSlug, setRelatedSlug] = useState('');
  const [avatarImage, setAvatarImage] = useState<string>(AGENCY_ASSETS.MODEL_AANYA);
  const [year, setYear] = useState('2026');
  const [quote, setQuote] = useState('');
  const [featured, setFeatured] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);

  const handleModelLinkChange = (slug: string) => {
    setRelatedSlug(slug);
    const matched = models.find((m) => m.slug === slug);
    if (matched) {
      setAuthorName(matched.name);
      setAuthorRole(`${matched.experienceLevel} Talent`);
      setOrganizationOrBoard(
        `House of Fashion Nepal ${matched.experienceLevel} Board · Since ${matched.joinedYear}`,
      );
      setLocation(`${matched.location}, Nepal`);
      setAvatarImage(matched.coverImage);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!authorName.trim() || !quote.trim()) {
      setFormError('Author name and testimonial quote are required.');
      return;
    }

    try {
      await createTestimonial({
        perspective,
        authorName: authorName.trim(),
        authorRole:
          authorRole.trim() ||
          (perspective === 'model' ? 'Represented Model' : 'Creative Director'),
        organizationOrBoard:
          organizationOrBoard.trim() ||
          (perspective === 'model' ? 'House of Fashion Nepal Roster' : 'Client House'),
        location: location.trim() || 'Kathmandu, Nepal',
        projectOrCampaign: projectOrCampaign.trim() || undefined,
        relatedSlug: relatedSlug.trim() || undefined,
        avatarImage: avatarImage.trim() || undefined,
        year: year.trim() || '2026',
        quote: quote.trim(),
        featured,
      }).unwrap();

      setAuthorName('');
      setAuthorRole('');
      setOrganizationOrBoard('');
      setProjectOrCampaign('');
      setRelatedSlug('');
      setQuote('');
    } catch {
      setFormError('Unable to publish testimonial right now. Please try again.');
    }
  };

  const handleToggleFeatured = async (t: Testimonial) => {
    setTableError(null);
    try {
      await updateTestimonial({ id: t.id, featured: !t.featured }).unwrap();
    } catch {
      setTableError('Unable to update testimonial featured status right now.');
    }
  };

  const handleDelete = async (id: string) => {
    setTableError(null);
    try {
      await deleteTestimonial(id).unwrap();
    } catch {
      setTableError('Unable to remove testimonial right now.');
    }
  };

  const columns: DataTableColumn<Testimonial>[] = [
    {
      id: 'authorName',
      header: 'Author',
      sortable: true,
      accessor: (t) => t.authorName,
      render: (t) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          {t.avatarImage && (
            <EditorialImage
              src={t.avatarImage}
              alt={t.authorName}
              containerClassName="w-10 h-10 shrink-0"
              className="w-full h-full object-cover object-top"
            />
          )}
          <div className="min-w-0">
            <p className="font-serif text-lg leading-tight truncate text-[#101010]">
              {t.authorName}
            </p>
            <p className="text-xs text-[#101010]/60 truncate">
              {t.authorRole} · {t.organizationOrBoard}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'perspective',
      header: 'Perspective',
      sortable: true,
      accessor: (t) => t.perspective,
      cellClassName: 'text-xs uppercase tracking-[0.12em] text-[#632B37] whitespace-nowrap',
      render: (t) => (
        <span>{t.perspective === 'model' ? 'Model' : 'Client'}</span>
      ),
    },
    {
      id: 'quote',
      header: 'Statement',
      accessor: (t) => t.quote,
      cellClassName: 'text-xs text-[#101010]/80 max-w-[300px]',
      render: (t) => <p className="line-clamp-2 italic">&ldquo;{t.quote}&rdquo;</p>,
    },
    {
      id: 'year',
      header: 'Year',
      sortable: true,
      accessor: (t) => t.year,
      cellClassName: 'font-mono text-xs tabular-nums whitespace-nowrap',
      render: (t) => <span>{t.year}</span>,
    },
    {
      id: 'featured',
      header: 'Featured',
      sortable: true,
      accessor: (t) => (t.featured ? 1 : 0),
      render: (t) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(t)}
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border transition-colors whitespace-nowrap ${
            t.featured
              ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
              : 'bg-[#F5F1EA] text-[#101010]/65 border-[#101010]/20 hover:border-[#101010]'
          }`}
        >
          <Star className={`w-3 h-3 ${t.featured ? 'fill-current' : ''}`} />
          <span>{t.featured ? 'Featured' : 'Standard'}</span>
        </button>
      ),
    },
  ];

  const filters: DataTableFilter<Testimonial>[] = [
    {
      id: 'perspective',
      label: 'Filter testimonials by perspective',
      options: [
        { value: 'All', label: 'All Perspectives' },
        { value: 'client', label: 'Client Partners' },
        { value: 'model', label: 'Represented Models' },
      ],
      predicate: (t, val) => t.perspective === val,
    },
    {
      id: 'featured',
      label: 'Filter testimonials by visibility',
      options: [
        { value: 'All', label: 'All Endorsements' },
        { value: 'featured', label: 'Featured on Home' },
        { value: 'standard', label: 'Standard' },
      ],
      predicate: (t, val) => (val === 'featured' ? t.featured : !t.featured),
    },
  ];

  const labelClass =
    'block text-[11px] uppercase tracking-[0.16em] text-[#101010]/65 mb-1.5';
  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#F5F1EA] border border-[#101010]/20 text-[#101010] focus:outline-none focus:border-[#632B37]';

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-[#FAF8F4] border border-[#101010]/15 space-y-5"
      >
        <div className="pb-3 border-b border-[#101010]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37]">
              Editorial Endorsements
            </p>
            <h2 className="font-serif text-2xl">Add Client or Model Testimonial</h2>
          </div>

          <div className="flex items-center gap-2">
            {(
              [
                { id: 'client', label: 'Client Perspective' },
                { id: 'model', label: 'Model Perspective' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setPerspective(opt.id);
                  if (opt.id === 'client') setRelatedSlug('');
                }}
                className={`px-3.5 py-2 text-xs uppercase tracking-[0.14em] border cursor-pointer whitespace-nowrap ${
                  perspective === opt.id
                    ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
                    : 'bg-[#F5F1EA] text-[#101010]/70 border-[#101010]/20'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {perspective === 'model' && (
          <div>
            <label htmlFor="tst-model-prefill" className={labelClass}>
              Link Existing Roster Model (Optional Auto-Fill)
            </label>
            <SearchableSelect
              id="tst-model-prefill"
              value={relatedSlug}
              onChange={handleModelLinkChange}
              options={[
                { value: '', label: 'Select talent from roster...' },
                ...models.map((m) => ({
                  value: m.slug,
                  label: m.name,
                  hint: `${m.id} · ${m.experienceLevel}`,
                })),
              ]}
              searchPlaceholder="Search roster talent..."
              tone="ivory"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="tst-author" className={labelClass}>
              Author Full Name *
            </label>
            <input
              id="tst-author"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={
                perspective === 'model'
                  ? 'e.g., Priya Tamang'
                  : 'e.g., Siddharth Shrestha'
              }
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tst-role" className={labelClass}>
              Title / Role
            </label>
            <input
              id="tst-role"
              type="text"
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              placeholder={
                perspective === 'model'
                  ? 'Principal Runway Model'
                  : 'Creative Director'
              }
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tst-org" className={labelClass}>
              Brand House or Agency Board
            </label>
            <input
              id="tst-org"
              type="text"
              value={organizationOrBoard}
              onChange={(e) => setOrganizationOrBoard(e.target.value)}
              placeholder={
                perspective === 'model'
                  ? 'House of Fashion Nepal Runway Board · Since 2022'
                  : 'House of Shrestha'
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="tst-loc" className={labelClass}>
              Location
            </label>
            <input
              id="tst-loc"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tst-proj" className={labelClass}>
              Campaign / Project Reference
            </label>
            <input
              id="tst-proj"
              type="text"
              value={projectOrCampaign}
              onChange={(e) => setProjectOrCampaign(e.target.value)}
              placeholder="e.g., Nocturne Velvet Showcase"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tst-year" className={labelClass}>
              Year
            </label>
            <input
              id="tst-year"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={`${inputClass} font-mono tabular-nums`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="tst-quote" className={labelClass}>
            Testimonial Statement *
          </label>
          <textarea
            id="tst-quote"
            rows={3}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Share concrete context, collaboration details, and outcome..."
            className={inputClass}
          />
        </div>

        {formError && (
          <p className="text-xs text-[#632B37]" role="alert">
            {formError}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-[#632B37]"
            />
            <span className="text-xs text-[#101010]/75">
              Feature on Homepage Testimonials Section
            </span>
          </label>

          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors cursor-pointer disabled:opacity-60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreating ? 'Publishing...' : 'Publish Testimonial'}</span>
          </button>
        </div>
      </form>

      <DataTable
        data={testimonials}
        columns={columns}
        getRowId={(t) => t.id}
        searchPlaceholder="Search testimonials by author, organization, quote, or campaign..."
        searchAriaLabel="Search testimonials"
        searchPredicate={(t, q) =>
          t.authorName.toLowerCase().includes(q) ||
          t.authorRole.toLowerCase().includes(q) ||
          t.organizationOrBoard.toLowerCase().includes(q) ||
          t.quote.toLowerCase().includes(q) ||
          (t.projectOrCampaign || '').toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        }
        filters={filters}
        isLoading={isLoading}
        error={tableError}
        itemLabel="testimonials"
        defaultPageSize={8}
        defaultSort={{ columnId: 'year', direction: 'desc' }}
        exportConfig={{
          filename: 'hof-nepal-testimonials.csv',
          columns: [
            { label: 'ID', value: (t) => t.id },
            { label: 'Perspective', value: (t) => t.perspective },
            { label: 'Author', value: (t) => t.authorName },
            { label: 'Role', value: (t) => t.authorRole },
            { label: 'Organization', value: (t) => t.organizationOrBoard },
            { label: 'Year', value: (t) => t.year },
            { label: 'Featured', value: (t) => (t.featured ? 'Yes' : 'No') },
          ],
        }}
        renderExpandedRow={(t) => (
          <div className="space-y-2 text-xs">
            <p className="font-serif text-lg italic text-[#101010] leading-relaxed max-w-3xl">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="text-[#101010]/65">
              {t.location}
              {t.projectOrCampaign ? ` · Campaign: ${t.projectOrCampaign}` : ''}
              {` · Ref ${t.id}`}
            </p>
          </div>
        )}
        rowActionItems={(t) => [
          {
            id: 'toggle-featured',
            label: t.featured ? 'Set Standard' : 'Feature on Home',
            icon: Star,
            onClick: () => handleToggleFeatured(t),
          },
          ...(t.relatedSlug
            ? [
                {
                  id: 'view-model',
                  label: 'View Linked Model',
                  icon: ExternalLink,
                  to: `/models/${t.relatedSlug}`,
                },
              ]
            : []),
          {
            id: 'delete',
            label: 'Remove Testimonial',
            icon: Trash2,
            variant: 'danger',
            dividerBefore: true,
            onClick: () => handleDelete(t.id),
          },
        ]}
        emptyTitle="No testimonials match your filter"
        emptyDescription="Publish a new client or model endorsement above or adjust filters."
      />
    </div>
  );
}
