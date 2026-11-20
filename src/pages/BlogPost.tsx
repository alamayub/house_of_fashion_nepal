import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Link2,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EditorialImage } from '../components/common/EditorialImage.tsx';
import { Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import {
  formatBlogDate,
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from '../data/blogPosts.ts';

export default function BlogPost() {
  const { slug = '' } = useParams();
  const post = getBlogPostBySlug(slug);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  if (!post) {
    return (
      <PageTransition>
        <SeoHead
          title="Article Not Found — House of Fashion Nepal Journal"
          description="The requested journal guide could not be located."
          noIndex
        />
        <section className="min-h-[75vh] pt-36 pb-24 px-6 bg-[#F5F1EA] text-[#101010] flex flex-col items-center justify-center text-center space-y-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[#632B37]">
            House of Fashion Nepal Journal Archive
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl">Article Not Found</h1>
          <p className="text-sm text-[#101010]/70 max-w-md">
            This guide may have moved or is no longer published. Browse our full modeling handbook library below.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] hover:bg-[#632B37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to House of Fashion Nepal Journal</span>
          </Link>
        </section>
      </PageTransition>
    );
  }

  const relatedPosts = getRelatedBlogPosts(post, 3);

  return (
    <PageTransition>
      <SeoHead
        blogPost={post}
        title={`${post.title} — House of Fashion Nepal Journal`}
        description={post.excerpt}
        image={post.coverImage}
        imageAlt={post.coverAlt}
        type="article"
        keywords={post.tags}
      />

      {/* Editorial Article Header */}
      <article className="bg-[#F5F1EA] text-[#101010]">
        <header className="pt-24 sm:pt-28 md:pt-36 pb-12 md:pb-16 border-b border-[#101010]/10">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 space-y-6 sm:space-y-8">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-xs text-[#101010]/55"
            >
              <Link to="/" className="hover:text-[#101010] transition-colors">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link to="/blog" className="hover:text-[#101010] transition-colors">
                Journal
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                to={`/blog?category=${encodeURIComponent(post.category)}`}
                className="text-[#632B37] hover:underline underline-offset-4"
              >
                {post.category}
              </Link>
            </nav>

            <Reveal className="space-y-5 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#101010]/60">
                <span className="uppercase tracking-[0.18em] text-[#632B37] font-medium">
                  {post.category}
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.publishedAt}>
                  Published {formatBlogDate(post.publishedAt)}
                </time>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTimeMinutes} min read</span>
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl leading-[1.04] text-balance">
                {post.title}
              </h1>

              <p className="text-base sm:text-xl text-[#101010]/75 leading-relaxed max-w-3xl">
                {post.subtitle}
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#101010]/12">
                <div>
                  <p className="text-sm font-medium text-[#101010]">
                    {post.authorName}
                  </p>
                  <p className="text-xs text-[#101010]/60">{post.authorRole}</p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#101010]/20 bg-[#FAF8F4] text-xs uppercase tracking-[0.14em] hover:border-[#101010] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#632B37]" />
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Share Guide</span>
                    </>
                  )}
                </button>
              </div>
            </Reveal>
          </div>
        </header>

        {/* Lead Photography */}
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 md:pt-14">
          <figure className="space-y-3">
            <div className="aspect-[16/9] max-h-[580px] overflow-hidden bg-[#E9E4DB]">
              <EditorialImage
                src={post.coverImage}
                alt={post.coverAlt}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="text-xs text-[#101010]/55">
              {post.coverAlt}
            </figcaption>
          </figure>
        </div>

        {/* Two-Column Reading Body */}
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Sidebar: Table of Contents & Key Takeaways (renders below article on mobile) */}
            <aside className="order-2 lg:order-1 lg:col-span-4 lg:sticky lg:top-28 space-y-6 sm:space-y-8">
              <div className="p-6 bg-[#FAF8F4] border border-[#101010]/12 space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#632B37]">
                  In This Guide
                </p>
                <nav aria-label="Article sections" className="space-y-2.5 text-sm">
                  {post.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-[#101010]/75 hover:text-[#632B37] transition-colors leading-snug"
                    >
                      {section.heading}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="p-6 bg-[#FAF8F4] border border-[#101010]/12 space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#632B37]">
                  Key Takeaways
                </p>
                <ul className="space-y-3 text-sm text-[#101010]/75 leading-relaxed">
                  {post.keyTakeaways.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#632B37] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-[#101010] text-[#FAF8F4] space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#B6A48D]">
                  Open Scouting · Nepal
                </p>
                <h2 className="font-serif text-2xl leading-tight">
                  Considering Representation?
                </h2>
                <p className="text-xs text-[#FAF8F4]/70 leading-relaxed">
                  Submit natural-light digitals directly to House of Fashion Nepal’s scouting desk. Zero application fees across all boards.
                </p>
                <Link
                  to="/become-a-model"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#FAF8F4] hover:text-[#B6A48D] transition-colors"
                >
                  <span>Start Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </aside>

            {/* Right Manuscript (renders first on mobile for immediate reading) */}
            <div className="order-1 lg:order-2 lg:col-span-8 max-w-[68ch] space-y-10 sm:space-y-12">
              {post.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="space-y-5 scroll-mt-24 sm:scroll-mt-28 pb-10 border-b border-[#101010]/10 last:border-b-0 last:pb-0"
                >
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl leading-[1.15] text-[#101010]">
                    {section.heading}
                  </h2>

                  <div className="space-y-4 text-base text-[#101010]/80 leading-[1.78]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>

                  {section.checklist && section.checklist.length > 0 && (
                    <div className="p-6 bg-[#FAF8F4] border border-[#101010]/12 space-y-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37]">
                        Studio Checklist
                      </p>
                      <ul className="space-y-2.5 text-sm text-[#101010]/80 leading-relaxed">
                        {section.checklist.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-[#632B37] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.studioNote && (
                    <div className="p-5 bg-[#EFE9DF] border border-[#101010]/12 text-sm text-[#101010]/85 leading-relaxed">
                      {section.studioNote}
                    </div>
                  )}
                </section>
              ))}

              {/* Topic Metadata & Back Link */}
              <div className="pt-8 border-t border-[#101010]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#101010]/55">
                  <span className="uppercase tracking-[0.14em] text-[#101010]/70">
                    Topics:
                  </span>
                  {post.tags.map((tag, idx) => (
                    <span key={tag}>
                      {tag}
                      {idx < post.tags.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>

                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#101010] hover:text-[#632B37] transition-colors whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Journal Guides</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Guides */}
      <section className="py-20 md:py-24 bg-[#FAF8F4] text-[#101010] border-t border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#632B37]">
                Continue Reading
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">
                More from The House of Fashion Nepal Journal
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] hover:text-[#632B37] transition-colors whitespace-nowrap"
            >
              <span>View Full Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((related) => (
              <article key={related.id} className="group flex flex-col">
                <Link
                  to={`/blog/${related.slug}`}
                  className="block aspect-[4/3] overflow-hidden bg-[#E9E4DB] mb-5"
                >
                  <EditorialImage
                    src={related.coverImage}
                    alt={related.coverAlt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="space-y-2.5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-[#101010]/55">
                    <span className="uppercase tracking-[0.15em] text-[#632B37]">
                      {related.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {related.readTimeMinutes} min read
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl leading-snug group-hover:text-[#632B37] transition-colors">
                    <Link to={`/blog/${related.slug}`}>{related.title}</Link>
                  </h3>
                  <p className="text-sm text-[#101010]/70 leading-relaxed flex-1">
                    {related.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
