import { ArrowRight, BookOpen, RotateCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EditorialImage } from '../components/common/EditorialImage.tsx';
import { Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { BLOG_CATEGORIES, BLOG_POSTS, formatBlogDate } from '../data/blogPosts.ts';
import type { BlogCategory } from '../types/index.ts';

type CategoryFilter = 'All' | BlogCategory;

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParam = searchParams.get('category');

  const resolvedParamCategory: CategoryFilter =
    initialParam && (BLOG_CATEGORIES as readonly string[]).includes(initialParam)
      ? (initialParam as BlogCategory)
      : 'All';

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
    resolvedParamCategory,
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedCategory(resolvedParamCategory);
  }, [resolvedParamCategory]);

  const handleSelectCategory = (category: CategoryFilter) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category }, { replace: true });
    }
  };

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { All: BLOG_POSTS.length };
    BLOG_CATEGORIES.forEach((cat) => {
      map[cat] = BLOG_POSTS.filter((p) => p.category === cat).length;
    });
    return map;
  }, []);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.subtitle.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.authorName.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const showLeadFeature =
    selectedCategory === 'All' && !searchQuery.trim() && filteredPosts.length > 0;
  const leadPost = showLeadFeature ? filteredPosts[0] : null;
  const gridPosts = showLeadFeature ? filteredPosts.slice(1) : filteredPosts;

  return (
    <PageTransition>
      <SeoHead
        title={
          selectedCategory !== 'All'
            ? `${selectedCategory} — Model Journal`
            : 'The House of Fashion Nepal Journal — Model Craft, Skincare & Fashion Guides'
        }
        description="Editorial guides for models across Nepal covering fashion styling, skin barrier protocols, 24-hour routines, runway posing, nutrition, casting digitals, and shoot-day kits."
        canonicalPath="/blog"
        blogPosts={BLOG_POSTS}
        image={BLOG_POSTS[0]?.coverImage}
      />

      {/* Editorial Header */}
      <section className="pt-24 sm:pt-28 md:pt-36 pb-14 md:pb-20 bg-[#F5F1EA] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
          <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#632B37]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>The House of Fashion Nepal Journal · Nepal Modeling Handbook</span>
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[0.98] text-balance">
                Craft, Skincare &amp; Discipline
              </h1>
              <p className="text-base sm:text-lg text-[#101010]/70 max-w-2xl leading-relaxed">
                Everything a working or aspiring model in Nepal needs — from wardrobe architecture and dermatologist-aligned skincare to daily routines, runway cadence, nutrition, contracts, and shoot-day kits.
              </p>
            </div>

            {/* Search Box */}
            <div className="w-full lg:w-80 shrink-0">
              <label htmlFor="journal-search" className="sr-only">
                Search journal articles
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#101010]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="journal-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skincare, runway, digitals..."
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F4] border border-[#101010]/20 text-sm text-[#101010] placeholder:text-[#101010]/45 focus:outline-none focus:border-[#101010] transition-colors"
                />
              </div>
            </div>
          </Reveal>

          {/* Interactive Discipline Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter journal by topic"
            className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible pt-2"
          >
            {(['All', ...BLOG_CATEGORIES] as CategoryFilter[]).map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectCategory(category)}
                  className={`px-3.5 py-2 text-xs uppercase tracking-[0.14em] transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                    isActive
                      ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
                      : 'bg-[#FAF8F4] text-[#101010]/75 border-[#101010]/15 hover:border-[#101010] hover:text-[#101010]'
                  }`}
                >
                  <span>{category === 'All' ? 'All Guides' : category}</span>
                  <span className="ml-2 font-mono text-[11px] tabular-nums opacity-70">
                    {categoryCounts[category] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Editorial Index */}
      <section className="py-16 md:py-24 bg-[#FAF8F4] text-[#101010]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-16">
          {/* Featured Lead Monograph */}
          {leadPost && (
            <Reveal>
              <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch pb-16 border-b border-[#101010]/12">
                <Link
                  to={`/blog/${leadPost.slug}`}
                  className="lg:col-span-7 block aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-[#E9E4DB]"
                >
                  <EditorialImage
                    src={leadPost.coverImage}
                    alt={leadPost.coverAlt}
                    priority
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </Link>

                <div className="lg:col-span-5 flex flex-col justify-between space-y-6 py-2">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#101010]/60">
                      <span className="uppercase tracking-[0.18em] text-[#632B37] font-medium">
                        Featured · {leadPost.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={leadPost.publishedAt}>
                        {formatBlogDate(leadPost.publishedAt)}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {leadPost.readTimeMinutes} min read
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl xl:text-[44px] leading-[1.08] text-balance group-hover:text-[#632B37] transition-colors">
                      <Link to={`/blog/${leadPost.slug}`}>{leadPost.title}</Link>
                    </h2>

                    <p className="text-sm sm:text-base text-[#101010]/75 leading-relaxed">
                      {leadPost.subtitle}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#101010]/12 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#101010] truncate">
                        {leadPost.authorName}
                      </p>
                      <p className="text-xs text-[#101010]/55 truncate">
                        {leadPost.authorRole}
                      </p>
                    </div>
                    <Link
                      to={`/blog/${leadPost.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          )}

          {/* Filtered Article Grid */}
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {gridPosts.map((post, idx) => (
                <Reveal key={post.id} delay={(idx % 3) * 0.05}>
                  <article className="group h-full flex flex-col">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block aspect-[4/3] overflow-hidden bg-[#E9E4DB] mb-5"
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
                        <span className="tabular-nums">
                          {post.readTimeMinutes} min read
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl sm:text-[27px] leading-[1.16] text-[#101010] group-hover:text-[#632B37] transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-sm text-[#101010]/70 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>

                      <div className="pt-4 border-t border-[#101010]/10 flex items-center justify-between gap-3 text-xs">
                        <span className="text-[#101010]/60 truncate">
                          By {post.authorName}
                        </span>
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
          )}

          {filteredPosts.length === 0 && (
            <div className="py-20 px-6 text-center bg-[#F5F1EA] border border-[#101010]/12 space-y-4">
              <p className="font-serif text-3xl text-[#101010]">
                {searchQuery.trim()
                  ? `No guides match “${searchQuery.trim()}”`
                  : `No guides published in ${selectedCategory} yet`}
              </p>
              <p className="text-sm text-[#101010]/65 max-w-md mx-auto">
                Try searching broader topics like skincare, runway, wardrobe, routine, nutrition, or digitals.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  handleSelectCategory('All');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Journal Filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Scouting & Development CTA */}
      <section className="py-20 bg-[#101010] text-[#FAF8F4] border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
              Put Craft Into Practice · Nationwide Scouting
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.08]">
              Ready to submit your natural-light digitals?
            </h2>
            <p className="text-sm sm:text-base text-[#FAF8F4]/70 leading-relaxed">
              Every signed New Face at House of Fashion Nepal receives structured runway coaching, portfolio direction, and transparent ethical contracts — with zero application fees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/become-a-model"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FAF8F4] text-[#101010] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#B6A48D] transition-colors whitespace-nowrap"
            >
              <span>Apply as a Model</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/models"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-[#FAF8F4] text-xs uppercase tracking-[0.18em] hover:border-[#FAF8F4] transition-colors whitespace-nowrap"
            >
              <span>Browse Roster</span>
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
