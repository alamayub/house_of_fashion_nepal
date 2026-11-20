import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Expand, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  useGetClientsQuery,
  useGetProjectsQuery,
} from '../features/projects/projectsApi.ts';
import type { AgencyProject } from '../types/index.ts';
import { EditorialImage } from '../components/common/EditorialImage.tsx';
import { Loader } from '../components/common/Loader.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { TestimonialsSection } from '../components/common/TestimonialsSection.tsx';
import { ProjectDetailModal } from '../components/projects/ProjectDetailModal.tsx';

const PROJECT_CATEGORIES = [
  'All',
  'Brand Campaign',
  'Editorial',
  'Runway',
  'Commercial TVC',
  'Lookbook',
] as const;

export default function Projects() {
  const prefersReducedMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlClientParam = searchParams.get('client');
  const urlCategoryParam = searchParams.get('category');

  const resolvedCategory =
    urlCategoryParam && (PROJECT_CATEGORIES as readonly string[]).includes(urlCategoryParam)
      ? urlCategoryParam
      : 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(resolvedCategory);
  const [selectedClientId, setSelectedClientId] = useState<string>(urlClientParam || 'All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<AgencyProject | null>(null);

  useEffect(() => {
    setSelectedCategory(resolvedCategory);
  }, [resolvedCategory]);

  useEffect(() => {
    const nextClient = urlClientParam || 'All';
    setSelectedClientId(nextClient);
    if (urlClientParam) {
      window.requestAnimationFrame(() => {
        document.querySelector('#projects-archive')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [urlClientParam]);

  const updateUrlFilters = (nextClient: string, nextCategory: string) => {
    const nextParams = new URLSearchParams();
    if (nextClient && nextClient !== 'All') nextParams.set('client', nextClient);
    if (nextCategory && nextCategory !== 'All') nextParams.set('category', nextCategory);
    setSearchParams(nextParams, { replace: true });
  };

  const { data: clients = [], isLoading: clientsLoading } = useGetClientsQuery();
  const { data: allProjects = [] } = useGetProjectsQuery();
  const {
    data: filteredProjects = [],
    isLoading: projectsLoading,
    isError,
  } = useGetProjectsQuery({
    category: selectedCategory,
    clientId: selectedClientId,
    search: searchQuery,
  });

  const activeClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || null,
    [clients, selectedClientId],
  );

  const projectCountByClient = useMemo(() => {
    const map: Record<string, number> = {};
    allProjects.forEach((p) => {
      map[p.clientId] = (map[p.clientId] || 0) + 1;
    });
    return map;
  }, [allProjects]);

  const handleSelectClient = (clientId: string) => {
    const nextClient = selectedClientId === clientId ? 'All' : clientId;
    setSelectedClientId(nextClient);
    updateUrlFilters(nextClient, selectedCategory);
    document.querySelector('#projects-archive')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    updateUrlFilters(selectedClientId, category);
  };

  return (
    <PageTransition>
      <SeoHead
        title={
          activeClient
            ? `${activeClient.name} — Client Commissions & Projects`
            : 'Clients & Projects — Production Archive'
        }
        description={
          activeClient
            ? `${activeClient.name} (${activeClient.industry}) commissions with House of Fashion Nepal in ${activeClient.location}.`
            : 'Explore fashion houses, luxury hospitality brands, and commercial campaigns produced and cast by House of Fashion Nepal across Nepal.'
        }
        image={filteredProjects[0]?.coverImage || allProjects[0]?.coverImage}
        projects={filteredProjects}
      />

      {/* Editorial Header */}
      <section className="pt-24 sm:pt-28 md:pt-36 pb-14 sm:pb-16 bg-[#101010] text-[#FAF8F4] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
                Partner Houses &amp; Commissions · Nepal &amp; International
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[0.98] text-balance">
                Clients &amp; Selected Projects
              </h1>
            </div>
            <div className="lg:col-span-4 space-y-5">
              <p className="text-sm sm:text-base text-[#FAF8F4]/75 leading-relaxed">
                From Himalayan cashmere houses and artisanal weaving collectives to architectural hospitality sanctuaries and commercial beauty films.
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="font-serif text-2xl sm:text-3xl tabular-nums text-[#FAF8F4]">
                    {clients.length}
                  </p>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#B6A48D]">
                    Partner Clients
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl tabular-nums text-[#FAF8F4]">
                    {allProjects.length}
                  </p>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#B6A48D]">
                    Campaigns
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl tabular-nums text-[#FAF8F4]">
                    100%
                  </p>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#B6A48D]">
                    Cleared Rights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Client Roster */}
      <section className="py-16 md:py-24 bg-[#FAF8F4] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-10 border-b border-[#101010]/10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#632B37] mb-2">
                01. Client Index
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl">
                Brands, Designers &amp; Production Houses
              </h2>
            </div>
            <p className="text-xs text-[#101010]/60 max-w-xs">
              Select any client house below to filter commissioned productions in the archive.
            </p>
          </div>

          {clientsLoading ? (
            <Loader label="Loading Client Houses" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#101010]/12">
              {clients.map((client) => {
                const isSelected = selectedClientId === client.id;
                const count = projectCountByClient[client.id] || 0;
                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleSelectClient(client.id)}
                    className={`p-6 sm:p-7 text-left border-r border-b border-[#101010]/12 transition-colors flex flex-col justify-between gap-6 cursor-pointer ${
                      isSelected
                        ? 'bg-[#101010] text-[#FAF8F4]'
                        : 'bg-[#FAF8F4] text-[#101010] hover:bg-[#F5F1EA]'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div
                        className={`flex items-center justify-between text-[11px] uppercase tracking-[0.16em] ${
                          isSelected ? 'text-[#B6A48D]' : 'text-[#632B37]'
                        }`}
                      >
                        <span className="font-mono tabular-nums">{client.id}</span>
                        <span className="tabular-nums">Since {client.yearSince}</span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-[26px] leading-tight">
                        {client.name}
                      </h3>
                      <p
                        className={`text-xs ${
                          isSelected ? 'text-[#FAF8F4]/75' : 'text-[#101010]/65'
                        }`}
                      >
                        {client.industry} · {client.location}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p
                        className={`text-xs leading-relaxed line-clamp-3 ${
                          isSelected ? 'text-[#FAF8F4]/70' : 'text-[#101010]/65'
                        }`}
                      >
                        {client.description}
                      </p>
                      <p
                        className={`text-[11px] uppercase tracking-[0.16em] font-medium tabular-nums ${
                          isSelected ? 'text-[#B6A48D]' : 'text-[#101010]'
                        }`}
                      >
                        {count} {count === 1 ? 'Project' : 'Projects'} →
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Projects Showcase & Filters */}
      <section id="projects-archive" className="scroll-mt-20 py-16 md:py-24 bg-[#F5F1EA] text-[#101010]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#101010]/10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#632B37] mb-2">
                02. Production Archive
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl">
                {activeClient ? `${activeClient.name} Commissions` : 'Editorial & Commercial Projects'}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {activeClient && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClientId('All');
                    updateUrlFilters('All', selectedCategory);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.14em] cursor-pointer whitespace-nowrap"
                >
                  <span>Client: {activeClient.name}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#101010]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects or cities..."
                  aria-label="Search projects"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F4] border border-[#101010]/20 text-[#101010] focus:outline-none focus:border-[#632B37]"
                />
              </div>
            </div>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filter projects by discipline">
            {PROJECT_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectCategory(category)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.14em] whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
                      : 'bg-[#FAF8F4] text-[#101010]/75 border-[#101010]/15 hover:border-[#101010]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {projectsLoading ? (
            <Loader label="Loading Commissions" />
          ) : isError ? (
            <div className="p-10 bg-[#FAF8F4] border border-[#101010]/15 text-center space-y-3">
              <p className="font-serif text-2xl">Unable to load projects right now.</p>
              <p className="text-sm text-[#101010]/65">
                Please refresh or reset your active filters.
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 bg-[#FAF8F4] border border-[#101010]/15 text-center space-y-4">
              <p className="font-serif text-3xl">No matching projects found</p>
              <p className="text-sm text-[#101010]/65 max-w-md mx-auto">
                No productions match the selected category, client house, or search keyword.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedClientId('All');
                  setSearchQuery('');
                  updateUrlFilters('All', 'All');
                }}
                className="px-6 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] cursor-pointer"
              >
                Reset Archive Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, idx) => (
                <motion.article
                  key={project.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.45, delay: prefersReducedMotion ? 0 : idx * 0.04 }}
                  className="group bg-[#FAF8F4] border border-[#101010]/12 flex flex-col justify-between"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveProject(project)}
                      className="relative w-full aspect-[4/3] overflow-hidden bg-[#1D1B18] block text-left cursor-pointer"
                    >
                      <EditorialImage
                        src={project.coverImage}
                        alt={`${project.title} for ${project.clientName}`}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        fallbackTitle={project.title}
                      />
                      <div className="absolute top-3.5 right-3.5 w-9 h-9 bg-[#101010]/70 text-[#FAF8F4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Expand className="w-4 h-4" />
                      </div>
                    </button>

                    <div className="p-6 space-y-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                        {project.category} · {project.year} · {project.clientName}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        className="text-left block cursor-pointer"
                      >
                        <h3 className="font-serif text-3xl leading-tight text-[#101010] group-hover:text-[#632B37] transition-colors">
                          {project.title}
                        </h3>
                      </button>
                      <p className="text-xs text-[#101010]/55">{project.location}</p>
                      <p className="text-sm text-[#101010]/75 leading-relaxed line-clamp-3">
                        {project.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-[#101010]/10 space-y-4">
                    {project.cast && project.cast.length > 0 && (
                      <div className="text-xs text-[#101010]/70">
                        <span className="uppercase tracking-[0.14em] text-[#101010]/50 mr-2">
                          Cast:
                        </span>
                        {project.cast.map((talent, tIdx) => (
                          <span key={talent.slug}>
                            <Link
                              to={`/models/${talent.slug}`}
                              className="underline decoration-[#101010]/25 underline-offset-4 hover:text-[#632B37] hover:decoration-[#632B37] transition-colors"
                            >
                              {talent.name}
                            </Link>
                            {tIdx < (project.cast?.length ?? 0) - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-medium text-[#101010] hover:text-[#632B37] transition-colors cursor-pointer"
                      >
                        <span>Inspect Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-[11px] text-[#101010]/45 tabular-nums shrink-0">
                        {project.deliverables.length} Deliverables
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Client Reflections */}
      <TestimonialsSection
        lockedPerspective="client"
        kicker="Client Reflections"
        heading="Partner House Perspectives"
        subheading="Direct notes from fashion houses, creative directors, and hospitality brands producing campaigns with House of Fashion Nepal."
        tone="paper"
      />

      {/* Bottom Production Brief CTA */}
      <section className="py-16 md:py-24 bg-[#101010] text-[#FAF8F4] border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#B6A48D]">
              Commission House of Fashion Nepal
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl leading-[1.05]">
              Planning a Campaign or Runway Presentation in Nepal?
            </h2>
            <p className="text-sm text-[#FAF8F4]/70 leading-relaxed">
              Our Nepal production and casting desk provides tailored talent decks, shoot coordination, and commercial rights clearance within 48 hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/book"
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#FAF8F4] text-[#101010] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#B6A48D] transition-colors whitespace-nowrap"
            >
              <span>Book Talent</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center px-7 py-4 border border-white/25 text-xs uppercase tracking-[0.18em] text-[#FAF8F4] hover:border-[#B6A48D] transition-colors whitespace-nowrap"
            >
              View Agency Services
            </Link>
          </div>
        </div>
      </section>

      <ProjectDetailModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </PageTransition>
  );
}
