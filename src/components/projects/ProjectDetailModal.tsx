import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AgencyProject } from '../../types/index.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';

interface ProjectDetailModalProps {
  project: AgencyProject | null;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (project) {
      setActiveImage(project.coverImage);
    }
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} project dossier`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#101010]/92 backdrop-blur-sm flex items-start lg:items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full bg-[#181715] text-[#FAF8F4] border border-white/10 overflow-hidden my-2 sm:my-6"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project dossier"
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-[#101010]/85 text-[#FAF8F4] flex items-center justify-center hover:bg-[#632B37] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left: Editorial Media Viewer */}
              <div className="lg:col-span-7 bg-[#101010] flex flex-col justify-between">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={activeImage || project.coverImage}
                    alt={`${project.title} — ${project.clientName}`}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {project.gallery.length > 1 && (
                  <div className="p-4 border-t border-white/10 flex items-center gap-3 overflow-x-auto bg-[#141311]">
                    {project.gallery.map((img, idx) => {
                      const isSelected = (activeImage || project.coverImage) === img;
                      return (
                        <button
                          key={`${img}-${idx}`}
                          type="button"
                          onClick={() => setActiveImage(img)}
                          aria-label={`View plate ${idx + 1}`}
                          className={`relative w-20 aspect-[4/3] shrink-0 overflow-hidden border transition-opacity cursor-pointer ${
                            isSelected
                              ? 'border-[#B6A48D] opacity-100'
                              : 'border-white/15 opacity-55 hover:opacity-90'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${project.title} plate ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right: Curatorial Dossier */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-8 border-t lg:border-t-0 lg:border-l border-white/10">
                <div className="space-y-6">
                  <div className="space-y-2 pr-10">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#B6A48D]">
                      {project.category} · {project.year}
                      {project.season ? ` · ${project.season}` : ''}
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl leading-[1.08] text-[#FAF8F4]">
                      {project.title}
                    </h2>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#FAF8F4]/65">
                      {project.clientName} · {project.location}
                    </p>
                  </div>

                  <p className="text-sm text-[#FAF8F4]/80 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Deliverables */}
                  <div className="pt-4 border-t border-white/10 space-y-2.5">
                    <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#B6A48D]">
                      Production Scope &amp; Deliverables
                    </h3>
                    <ul className="space-y-1.5 text-sm text-[#FAF8F4]/80">
                      {project.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span aria-hidden="true" className="text-[#B6A48D]">
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cast Models */}
                  {project.cast && project.cast.length > 0 && (
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#B6A48D]">
                        Represented Talent Cast
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {project.cast.map((talent) => (
                          <Link
                            key={talent.slug}
                            to={`/models/${talent.slug}`}
                            onClick={onClose}
                            className="group flex items-center gap-3 p-2 bg-[#101010] border border-white/10 hover:border-[#B6A48D] transition-colors"
                          >
                            <EditorialImage
                              src={talent.coverImage}
                              alt={talent.name}
                              containerClassName="w-10 h-12 shrink-0"
                              className="w-full h-full object-cover object-top"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-serif text-lg leading-tight text-[#FAF8F4] truncate group-hover:text-[#B6A48D] transition-colors">
                                {talent.name}
                              </p>
                              <p className="text-[10px] font-mono text-[#FAF8F4]/55">
                                {talent.id}
                              </p>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#B6A48D] shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    to="/book"
                    onClick={onClose}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#FAF8F4] text-[#101010] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#B6A48D] transition-colors whitespace-nowrap"
                  >
                    <span>Book Similar Production</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="font-mono text-[11px] text-[#FAF8F4]/45 tabular-nums">
                    {project.id}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
