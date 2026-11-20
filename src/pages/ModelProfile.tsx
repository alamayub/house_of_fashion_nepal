import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Expand,
  FolderKanban,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EditorialImage } from '../components/common/EditorialImage.tsx';
import { Loader } from '../components/common/Loader.tsx';
import { ImageReveal, Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { BookingForm } from '../components/forms/BookingForm.tsx';
import { ModelCard } from '../components/models/ModelCard.tsx';
import { ModelGallery } from '../components/models/ModelGallery.tsx';
import { ModelStats } from '../components/models/ModelStats.tsx';
import { ModelVideoSection } from '../components/models/ModelVideoSection.tsx';
import { ProjectDetailModal } from '../components/projects/ProjectDetailModal.tsx';
import { MODEL_STATUS_MAP } from '../constants/modelStatus.ts';
import { useGetModelBySlugQuery } from '../features/models/modelsApi.ts';
import { useGetProjectsQuery } from '../features/projects/projectsApi.ts';
import type { AgencyProject, AvailabilityStatus } from '../types/index.ts';

const AVAILABILITY_TEXT: Record<AvailabilityStatus, string> = {
  available: 'Available for Bookings',
  booked: 'Currently On Option / Booked',
  unavailable: 'Temporarily Unavailable',
};

export default function ModelProfile() {
  const { slug = '' } = useParams();
  const prefersReducedMotion = useReducedMotion();
  const [selectedProject, setSelectedProject] = useState<AgencyProject | null>(null);
  const { data, isLoading, isError } = useGetModelBySlugQuery(slug, {
    skip: !slug,
  });
  const { data: modelProjects = [] } = useGetProjectsQuery(
    { talentSlug: slug },
    { skip: !slug },
  );

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 bg-[#F5F1EA] min-h-screen">
        <Loader label="Loading Model Portfolio" />
      </div>
    );
  }

  if (isError || !data?.model) {
    return (
      <div className="pt-36 pb-28 px-6 text-center bg-[#F5F1EA] min-h-screen">
        <SeoHead
          title="Profile Not Found"
          description="The requested model profile is not currently listed on our roster."
          noIndex
        />
        <p className="text-xs uppercase tracking-[0.2em] text-[#632B37] mb-3">
          Roster Archive
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl mb-4">Model Profile Not Found</h1>
        <p className="text-sm text-[#101010]/70 max-w-md mx-auto mb-8">
          This talent board entry may have moved or is currently inactive.
        </p>
        <Link
          to="/models"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Directory</span>
        </Link>
      </div>
    );
  }

  const { model, similar } = data;
  const modelStatus = model.status || 'active';

  if (modelStatus !== 'active') {
    const statusMeta = MODEL_STATUS_MAP[modelStatus];
    const statusMessage =
      modelStatus === 'banned'
        ? `${model.name} has been suspended and removed from active representation with House of Fashion Nepal.`
        : modelStatus === 'left'
          ? `${model.name} has concluded representation and is no longer on the House of Fashion Nepal roster.`
          : modelStatus === 'on-hold'
            ? `${model.name}'s portfolio is temporarily on administrative hold and unavailable for new bookings.`
            : `${model.name} is currently inactive on the House of Fashion Nepal roster.`;

    return (
      <PageTransition>
        <div className="pt-36 pb-28 px-6 text-center bg-[#F5F1EA] min-h-screen">
          <SeoHead
            title={`${model.name} — Representation Status`}
            description={statusMessage}
            noIndex
          />
          <p className="text-xs uppercase tracking-[0.2em] text-[#632B37] mb-3">
            Roster Status · {statusMeta.label}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-4">
            Profile Currently Not Bookable
          </h1>
          <p className="text-sm text-[#101010]/70 max-w-md mx-auto mb-8 leading-relaxed">
            {statusMessage}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/models"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] hover:bg-[#632B37] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Active Roster</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#101010]/25 text-xs uppercase tracking-[0.18em] hover:border-[#101010] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Booking Desk</span>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <SeoHead
        model={model}
        title={`${model.name} (${model.id}) — Portfolio`}
        description={`${model.name} represented by House of Fashion Nepal in ${model.location}. ${model.category.join(', ')}, ${model.height} cm. ${model.bio}`}
        image={model.coverImage}
      />

      {/* Model Editorial Header */}
      <section className="pt-24 md:pt-28 pb-16 md:pb-24 bg-[#F5F1EA] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="mb-8">
            <Link
              to="/models"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#101010]/65 hover:text-[#101010] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Models</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
            <ImageReveal className="lg:col-span-6">
              <EditorialImage
                src={model.coverImage}
                alt={`${model.name} editorial portrait`}
                priority
                containerClassName="aspect-[3/4] w-full max-h-[760px]"
                className="w-full h-full object-cover object-top"
                fallbackTitle={model.name}
              />
            </ImageReveal>

            <Reveal delay={0.08} className="lg:col-span-6 flex flex-col justify-between py-2 lg:py-6">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.18em] text-[#632B37]">
                  <span className="font-mono tabular-nums">{model.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>{model.category.join(' / ')}</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[0.98] text-[#101010]">
                  {model.name}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.16em] text-[#101010]/70 pb-6 border-b border-[#101010]/10">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#632B37]" />
                    <span>{model.location}, Nepal</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{model.height} cm</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      model.availability === 'available'
                        ? 'text-[#101010]'
                        : 'text-[#632B37]'
                    }
                  >
                    {AVAILABILITY_TEXT[model.availability]}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-[#101010]/80 leading-relaxed max-w-xl">
                  {model.bio}
                </p>
              </div>

              <div className="pt-8 sm:pt-10 flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href="#book-this-model"
                  className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book This Model</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 border border-[#101010]/30 text-xs uppercase tracking-[0.18em] text-[#101010] hover:border-[#101010] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Agency</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Consented Specifications */}
      <section className="py-16 md:py-24 bg-[#FAF8F4] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <ModelStats model={model} />
        </div>
      </section>

      {/* Portfolio Masonry + Lightbox */}
      <section className="py-16 md:py-24 bg-[#F5F1EA] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <ModelGallery modelName={model.name} images={model.gallery} />
        </div>
      </section>

      {/* Motion & Showreels */}
      <section className="py-16 md:py-24 bg-[#FAF8F4] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <ModelVideoSection model={model} />
        </div>
      </section>

      {/* Featured Projects & Campaigns */}
      {modelProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-[#F5F1EA] text-[#101010]">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#101010]/10">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#632B37] mb-2">
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>Client Archive</span>
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl">
                    Selected Projects &amp; Campaigns
                  </h2>
                </div>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-[#101010] hover:text-[#632B37] transition-colors whitespace-nowrap"
                >
                  <span>All Clients &amp; Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modelProjects.map((project, idx) => (
                <motion.button
                  key={project.id}
                  type="button"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setSelectedProject(project)}
                  className="group bg-[#FAF8F4] border border-[#101010]/12 text-left flex flex-col cursor-pointer"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#1D1B18]">
                    <EditorialImage
                      src={project.coverImage}
                      alt={project.title}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute top-3 right-3 w-8 h-8 bg-[#101010]/70 text-[#FAF8F4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Expand className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                      {project.category} · {project.year}
                    </p>
                    <h3 className="font-serif text-2xl leading-tight group-hover:text-[#632B37] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#101010]/65">
                      {project.clientName} · {project.location}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Direct Booking CTA Section */}
      <section
        id="book-this-model"
        className="scroll-mt-20 py-20 md:py-28 bg-[#101010] text-[#FAF8F4]"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-5 space-y-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
              Direct Booking Desk · Nepal
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.03]">
              Request Availability for {model.name}
            </h2>
            <p className="text-sm sm:text-base text-[#FAF8F4]/75 leading-relaxed">
              Submit your production dates, usage scope, and creative brief. Our Nepal bookings desk confirms call-sheet holds, fittings, and travel logistics within 24 hours.
            </p>
            <div className="pt-4 border-t border-white/10 text-xs text-[#B6A48D] space-y-2">
              <p className="inline-flex items-start gap-2 break-all sm:break-normal">
                <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>bookings@houseoffashionnepal.com.np</span>
              </p>
              <p className="flex items-center gap-2 tabular-nums">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>+977 1 552 8410</span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <BookingForm
              defaultModelSlug={model.slug}
              defaultModelName={model.name}
              dark
            />
          </Reveal>
        </div>
      </section>

      {/* Similar Models */}
      {similar.length > 0 && (
        <section className="py-20 md:py-28 bg-[#FAF8F4] text-[#101010]">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-10 border-b border-[#101010]/10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#632B37] mb-2">
                  Explore Related Board
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl">Similar Talent</h2>
              </div>
              <Link
                to="/models"
                className="text-xs uppercase tracking-[0.18em] text-[#101010] hover:text-[#632B37] transition-colors"
              >
                Full Directory
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similar.map((sim, idx) => (
                <ModelCard key={sim.id} model={sim} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </PageTransition>
  );
}
