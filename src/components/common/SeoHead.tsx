import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import type {
  AgencyEvent,
  AgencyProject,
  BlogPost,
  Model,
  ServiceItem,
} from '../../types/index.ts';
import {
  buildRouteSeo,
  type BreadcrumbItem,
  type SeoFaqItem,
  SITE_NAME,
} from '../../utils/seo.ts';

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: string;
  canonicalPath?: string;
  model?: Model | null;
  models?: Model[];
  blogPost?: BlogPost | null;
  blogPosts?: BlogPost[];
  projects?: AgencyProject[];
  events?: AgencyEvent[];
  services?: ServiceItem[];
  faqs?: SeoFaqItem[];
  keywords?: string[];
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function SeoHead({
  title,
  description,
  image,
  imageAlt,
  type,
  canonicalPath,
  model,
  models,
  blogPost,
  blogPosts,
  projects,
  events,
  services,
  faqs,
  keywords,
  noIndex,
  breadcrumbs,
  structuredData,
}: SeoHeadProps) {
  const { pathname } = useLocation();

  const seo = buildRouteSeo({
    pathname,
    model,
    models,
    blogPost,
    blogPosts,
    projects,
    events,
    services,
    faqs,
    title,
    description,
    image,
    imageAlt,
    type,
    canonicalPath,
    keywords,
    noIndex,
    breadcrumbs,
    structuredData,
  });

  const modelNameParts = model?.name ? model.name.trim().split(/\s+/) : [];
  const profileFirstName = modelNameParts[0];
  const profileLastName =
    modelNameParts.length > 1 ? modelNameParts.slice(1).join(' ') : undefined;

  return (
    <Helmet>
      <html lang="en" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      <meta name="author" content="House of Fashion Nepal Pvt. Ltd." />
      <meta
        name="robots"
        content={
          seo.noIndex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      <meta name="theme-color" content="#101010" />
      <meta name="geo.region" content="NP" />
      <meta name="geo.placename" content="Nepal" />
      <meta name="geo.position" content="27.6766;85.3114" />
      <meta name="ICBM" content="27.6766, 85.3114" />

      <link rel="canonical" href={seo.canonicalUrl} />
      {!seo.noIndex && (
        <>
          <link rel="alternate" hrefLang="en-NP" href={seo.canonicalUrl} />
          <link rel="alternate" hrefLang="x-default" href={seo.canonicalUrl} />
        </>
      )}

      {/* OpenGraph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_NP" />
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.imageUrl} />
      <meta property="og:image:alt" content={seo.imageAlt} />

      {seo.type === 'profile' && profileFirstName && (
        <meta property="profile:first_name" content={profileFirstName} />
      )}
      {seo.type === 'profile' && profileLastName && (
        <meta property="profile:last_name" content={profileLastName} />
      )}
      {seo.type === 'profile' && model?.gender && (
        <meta property="profile:gender" content={model.gender.toLowerCase()} />
      )}

      {seo.type === 'article' && blogPost && (
        <>
          <meta property="article:published_time" content={blogPost.publishedAt} />
          <meta property="article:modified_time" content={blogPost.updatedAt} />
          <meta property="article:section" content={blogPost.category} />
          <meta property="article:author" content={blogPost.authorName} />
          {blogPost.tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@houseoffashionnepal" />
      <meta name="twitter:creator" content="@houseoffashionnepal" />
      <meta name="twitter:url" content={seo.canonicalUrl} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.imageUrl} />
      <meta name="twitter:image:alt" content={seo.imageAlt} />

      {seo.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(seo.structuredData)}
        </script>
      )}
    </Helmet>
  );
}
