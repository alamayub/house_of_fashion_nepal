import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Expand, Film, Play, Plus, Upload, X } from 'lucide-react';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks.ts';
import { useAddModelVideoMutation } from '../../features/models/modelsApi.ts';
import type { Model, ModelVideo } from '../../types/index.ts';
import { detectVideoProvider, parseVideoEmbedUrl } from '../../utils/videoEmbed.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';
import { SearchableSelect } from '../common/SearchableSelect.tsx';

interface ModelVideoSectionProps {
  model: Model;
}

export function ModelVideoSection({ model }: ModelVideoSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const isAdminSignedIn = useAppSelector((s) => Boolean(s.admin.authSession));
  const videos = model.videos || [];
  const [activeInlineId, setActiveInlineId] = useState<string | null>(null);
  const [modalVideo, setModalVideo] = useState<ModelVideo | null>(null);
  const [failedVideoIds, setFailedVideoIds] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const [addMode, setAddMode] = useState<'embed' | 'upload'>('embed');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Runway Walk');
  const [embedUrl, setEmbedUrl] = useState('');
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const [addModelVideo, { isLoading: isAdding }] = useAddModelVideoMutation();

  const handleClipUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormError(null);
    if (file.size > 25 * 1024 * 1024) {
      setFormError('Clip size must be under 25 MB for browser preview.');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUploadedPreviewUrl(objectUrl);
    setUploadedFileName(file.name);
    if (!title.trim()) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please provide a title for the video reel.');
      return;
    }

    try {
      if (addMode === 'embed') {
        const provider = detectVideoProvider(embedUrl.trim());
        if (provider === 'upload' || !parseVideoEmbedUrl(embedUrl.trim(), provider)) {
          setFormError('Enter a valid YouTube or Vimeo link.');
          return;
        }
        await addModelVideo({
          slug: model.slug,
          video: {
            title: title.trim(),
            type: provider,
            url: embedUrl.trim(),
            category,
            poster: model.coverImage,
          },
        }).unwrap();
      } else {
        if (!uploadedPreviewUrl) {
          setFormError('Select a short MP4 or WebM clip to attach.');
          return;
        }
        await addModelVideo({
          slug: model.slug,
          video: {
            title: title.trim(),
            type: 'upload',
            url: uploadedPreviewUrl,
            category,
            poster: model.coverImage,
          },
        }).unwrap();
      }

      setTitle('');
      setEmbedUrl('');
      setUploadedPreviewUrl(null);
      setUploadedFileName('');
      setShowAddForm(false);
    } catch {
      setFormError('Unable to attach video reel right now. Please verify the link and retry.');
    }
  };

  useEffect(() => {
    if (!modalVideo) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalVideo(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalVideo]);

  const renderPlayer = (video: ModelVideo) => {
    if (video.type === 'upload') {
      if (failedVideoIds[video.id]) {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#181715] text-[#FAF8F4] p-6 text-center">
            <Film className="w-6 h-6 text-[#B6A48D] mb-2" />
            <p className="text-sm font-medium">Local preview clip expired</p>
            <p className="mt-1 text-xs text-[#FAF8F4]/65 max-w-xs">
              Browser-uploaded clips persist for the active session. Re-upload or attach a hosted YouTube / Vimeo link for permanent playback.
            </p>
          </div>
        );
      }

      return (
        <video
          src={video.url}
          poster={video.poster || model.coverImage}
          controls
          autoPlay
          playsInline
          preload="metadata"
          onError={() =>
            setFailedVideoIds((prev) => ({ ...prev, [video.id]: true }))
          }
          className="w-full h-full object-cover bg-[#101010]"
        />
      );
    }

    const embedSrc = parseVideoEmbedUrl(video.url, video.type);
    if (!embedSrc) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#181715] text-[#FAF8F4] p-6 text-center">
          <Film className="w-6 h-6 text-[#B6A48D] mb-2" />
          <p className="text-sm">Preview unavailable for this embed URL.</p>
          <a
            href={video.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 text-xs uppercase tracking-[0.16em] underline text-[#B6A48D]"
          >
            Open Original Source
          </a>
        </div>
      );
    }

    return (
      <iframe
        src={embedSrc}
        title={video.title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  };

  return (
    <section aria-labelledby="motion-reels-heading" className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#101010]/15 pb-3">
        <div>
          <h2 id="motion-reels-heading" className="font-serif text-2xl sm:text-3xl text-[#101010]">
            Motion &amp; Showreels
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="text-xs uppercase tracking-[0.16em] text-[#101010]/55 tabular-nums">
            {videos.length} {videos.length === 1 ? 'Clip' : 'Clips'}
          </span>
          {isAdminSignedIn && (
            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-medium text-[#632B37] hover:text-[#101010] transition-colors cursor-pointer"
            >
              {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showAddForm ? 'Close' : 'Add Video / Clip'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Embed or Short Clip Panel — Smooth Height Accordion (Admin Only) */}
      <AnimatePresence initial={false}>
        {isAdminSignedIn && showAddForm && (
          <motion.div
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 bg-[#FAF8F4] border border-[#101010]/15 space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#101010]/10 pb-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#101010]/70">
                  Attach Showreel to {model.name}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'embed', label: 'YouTube / Vimeo URL' },
                      { id: 'upload', label: 'Upload Short Clip' },
                    ] as const
                  ).map((mode) => {
                    const isSelected = addMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setAddMode(mode.id)}
                        className={`relative px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] border cursor-pointer transition-colors ${
                          isSelected
                            ? 'text-[#FAF8F4] border-[#101010]'
                            : 'bg-transparent text-[#101010]/70 border-[#101010]/20 hover:border-[#101010]'
                        }`}
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="video-add-mode-pill"
                            transition={{ type: 'spring', stiffness: 450, damping: 36 }}
                            className="absolute inset-0 bg-[#101010]"
                          />
                        )}
                        <span className="relative z-10">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label
                  htmlFor="video-title"
                  className="block text-xs uppercase tracking-[0.16em] text-[#101010]/70 mb-2"
                >
                  Clip Title *
                </label>
                <input
                  id="video-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Monsoon Couture Runway Walk"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F1EA] border border-[#101010]/20 focus:outline-none focus:border-[#632B37]"
                />
              </div>

              <div>
                <label
                  htmlFor="video-category"
                  className="block text-xs uppercase tracking-[0.16em] text-[#101010]/70 mb-2"
                >
                  Reel Category
                </label>
                <SearchableSelect
                  id="video-category"
                  value={category}
                  onChange={setCategory}
                  options={[
                    { value: 'Runway Walk', label: 'Runway Walk' },
                    { value: 'Campaign Film', label: 'Campaign Film' },
                    { value: 'Commercial Showreel', label: 'Commercial Showreel' },
                    { value: 'Editorial Motion', label: 'Editorial Motion' },
                    { value: 'Digital Polaroid', label: 'Digital Polaroid' },
                  ]}
                  searchPlaceholder="Search reel categories..."
                  tone="ivory"
                />
              </div>

              {addMode === 'embed' ? (
                <div>
                  <label
                    htmlFor="video-url"
                    className="block text-xs uppercase tracking-[0.16em] text-[#101010]/70 mb-2"
                  >
                    YouTube or Vimeo URL *
                  </label>
                  <input
                    id="video-url"
                    type="url"
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    placeholder="https://vimeo.com/... or https://youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F5F1EA] border border-[#101010]/20 focus:outline-none focus:border-[#632B37]"
                  />
                </div>
              ) : (
                <div>
                  <span className="block text-xs uppercase tracking-[0.16em] text-[#101010]/70 mb-2">
                    Video File (MP4 / WebM) *
                  </span>
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F5F1EA] border border-dashed border-[#101010]/30 text-xs uppercase tracking-[0.14em] cursor-pointer hover:border-[#632B37] transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="truncate">
                      {uploadedFileName || 'Choose Video Clip'}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleClipUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              )}
            </div>

            {formError && <p className="text-xs text-[#632B37]">{formError}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isAdding}
                className="px-7 py-3 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] transition-colors cursor-pointer disabled:opacity-60"
              >
                {isAdding ? 'Saving Clip...' : 'Publish to Profile'}
              </button>
            </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Grid */}
      {videos.length === 0 ? (
        <div className="p-10 bg-[#FAF8F4] border border-[#101010]/10 text-center space-y-2">
          <p className="font-serif text-2xl text-[#101010]">
            No Motion Reels Attached Yet
          </p>
          <p className="text-sm text-[#101010]/65">
            {isAdminSignedIn
              ? 'Select “Add Video / Clip” above to embed a YouTube/Vimeo reel or upload a short runway clip.'
              : 'Motion showreels and runway walk clips for this talent are curated directly by our bookings desk.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video) => {
            const isPlayingInline = activeInlineId === video.id;

            return (
              <article key={video.id} className="space-y-3">
                <div className="relative aspect-video w-full bg-[#101010] overflow-hidden border border-[#101010]/15">
                  {isPlayingInline ? (
                    renderPlayer(video)
                  ) : (
                    <>
                      <EditorialImage
                        src={video.poster || model.coverImage}
                        alt={video.title}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover object-center opacity-85"
                        fallbackTitle={video.title}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#101010]/80 via-[#101010]/20 to-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setActiveInlineId(video.id)}
                        aria-label={`Play ${video.title}`}
                        className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                      >
                        <span className="w-16 h-16 rounded-full bg-[#FAF8F4]/95 text-[#101010] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-hover:bg-[#632B37] group-hover:text-[#FAF8F4]">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalVideo(video)}
                        aria-label={`Open ${video.title} in cinema view`}
                        className="absolute top-3 right-3 w-9 h-9 bg-[#101010]/70 text-[#FAF8F4] flex items-center justify-center hover:bg-[#632B37] transition-colors cursor-pointer"
                      >
                        <Expand className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-4 pt-1">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                      {video.category || 'Motion Reel'} · {video.type.toUpperCase()}
                    </p>
                    <h3 className="font-serif text-2xl text-[#101010] mt-0.5">
                      {video.title}
                    </h3>
                  </div>

                  {video.duration && (
                    <span className="font-mono text-xs text-[#101010]/55 tabular-nums shrink-0">
                      {video.duration}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Cinema Theater Modal */}
      <AnimatePresence>
        {modalVideo && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${model.name} video player`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#101010]/95 flex items-center justify-center p-4 pt-14 sm:p-8"
            onClick={() => setModalVideo(null)}
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl bg-[#181715] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setModalVideo(null)}
                aria-label="Close cinema player"
                className="absolute -top-12 right-0 w-10 h-10 bg-[#181715] text-[#FAF8F4] border border-white/15 flex items-center justify-center hover:bg-[#632B37] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video w-full bg-[#101010]">
                {renderPlayer(modalVideo)}
              </div>

              <div className="p-5 flex items-center justify-between text-[#FAF8F4] border-t border-white/10">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#B6A48D]">
                    {model.name} · {modalVideo.category || 'Motion'}
                  </p>
                  <h4 className="font-serif text-2xl mt-0.5">{modalVideo.title}</h4>
                </div>
                {modalVideo.duration && (
                  <span className="font-mono text-xs text-[#B6A48D] tabular-nums">
                    {modalVideo.duration}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
