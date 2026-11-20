import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_CATEGORIES, BLOG_POSTS, formatBlogDate } from '../../data/blogPosts.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';
import { Reveal } from '../common/MotionPrimitives.tsx';

export function JournalSpotlight() {
  const featuredPosts = BLOG_POSTS.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-[#FAF8F4] text-[#101010] border-t border-[#101010]/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12 md:space-y-14">
        {/* Header Row */}
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#101010]/12">
          <div className="space-y-3 max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#632B37]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>The House of Fashion Nepal Journal · Model Craft &amp; Wellness</span>
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-balance">
              Field Notes for Working &amp; Aspiring Models
            </h2>
            <p className="text-sm sm:text-base text-[#101010]/70 leading-relaxed">
              Practical editorial handbooks written by House of Fashion Nepal’s bookers, scouting directors, and principal models — covering fashion wardrobe, skin barrier care, daily routines, runway cadence, nutrition, and casting ethics.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#101010] hover:text-[#632B37] transition-colors whitespace-nowrap shrink-0 pb-1 border-b border-[#101010]/30 hover:border-[#632B37]"
          >
            <span>Read All {BLOG_POSTS.length} Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Reveal>

        {/* 3-Column Editorial Spotlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {featuredPosts.map((post, idx) => (
            <Reveal key={post.id} delay={idx * 0.06}>
              <article className="group h-full flex flex-col">
                <Link
                  to={`/blog/${post.slug}`}
                  className="block aspect-[4/3] overflow-hidden bg-[#E9E4DB] mb-6"
                >
                  <EditorialImage
                    src={post.coverImage}
                    alt={post.coverAlt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </Link>

                <div className="flex-1 flex flex-col space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#101010]/55">
                    <span className="uppercase tracking-[0.16em] text-[#632B37]">
                      {post.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.publishedAt}>
                      {formatBlogDate(post.publishedAt)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{post.readTimeMinutes} min read</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-[28px] leading-[1.15] text-[#101010] group-hover:text-[#632B37] transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-sm text-[#101010]/70 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  <div className="pt-3 flex items-center justify-between gap-3 border-t border-[#101010]/10 text-xs">
                    <span className="text-[#101010]/60 truncate">{post.authorName}</span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 uppercase tracking-[0.16em] text-[#101010] group-hover:text-[#632B37] transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Quiet Category Topic Bar */}
        <Reveal className="pt-8 border-t border-[#101010]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#101010]/55 whitespace-nowrap">
            Explore by Discipline
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            {BLOG_CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/blog?category=${encodeURIComponent(category)}`}
                className="text-[#101010]/75 hover:text-[#632B37] transition-colors whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
