import { AGENCY_ASSETS, normalizePublicAssetUrl } from '../data/assets.ts';
import type {
  AgencyEvent,
  AgencyProject,
  BlogPost,
  Model,
  ServiceItem,
} from '../types/index.ts';

export const SITE_NAME = 'House of Fashion Nepal';
export const DEFAULT_SEO_IMAGE = AGENCY_ASSETS.HERO_EDITORIAL;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface ResolveSeoInput {
  pathname: string;
  origin?: string;
  model?: Model | null;
  models?: Model[];
  blogPost?: BlogPost | null;
  blogPosts?: BlogPost[];
  projects?: AgencyProject[];
  events?: AgencyEvent[];
  services?: ServiceItem[];
  faqs?: SeoFaqItem[];
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: string;
  canonicalPath?: string;
  keywords?: string[];
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export interface ResolvedSeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  imageAlt: string;
  type: string;
  keywords: string;
  noIndex: boolean;
  structuredData?: Record<string, unknown>;
}

interface RouteSeoDefaults {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  type: string;
  keywords: string[];
  breadcrumbLabel: string;
  noIndex?: boolean;
}

export function getSiteOrigin(originOverride?: string): string {
  if (originOverride) {
    return originOverride.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  const envUrl = import.meta.env.VITE_APP_URL as string | undefined;
  return envUrl && /^https?:\/\//i.test(envUrl.trim())
    ? envUrl.trim().replace(/\/+$/, '')
    : '';
}

export function normalizePathname(pathname: string): string {
  if (!pathname) return '/';
  const withoutQuery = pathname.split('?')[0].split('#')[0] || '/';
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
}

export function buildCanonicalUrl(pathname?: string, originOverride?: string): string {
  const origin = getSiteOrigin(originOverride);
  const rawPath =
    pathname ??
    (typeof window !== 'undefined' ? window.location.pathname : '/');
  const cleanPath = normalizePathname(rawPath);
  return origin ? `${origin}${cleanPath}` : cleanPath;
}

export function resolveAbsoluteImageUrl(
  imagePath?: string,
  originOverride?: string,
): string {
  const target = normalizePublicAssetUrl(imagePath?.trim() || DEFAULT_SEO_IMAGE);
  if (/^https?:\/\//i.test(target) || target.startsWith('data:')) {
    return target;
  }
  const normalized = target.startsWith('/') ? target : `/${target}`;
  const origin = getSiteOrigin(originOverride);
  return origin ? `${origin}${normalized}` : normalized;
}

export function truncateMetaDescription(text: string, maxLength = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const boundary = lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${boundary.replace(/[.,;:\-–—\s]+$/, '')}…`;
}

export function formatBrandTitle(title: string): string {
  const trimmed = title.trim();
  return trimmed.includes('House of Fashion Nepal') ? trimmed : `${trimmed} — ${SITE_NAME}`;
}

export function buildBreadcrumbJsonLd(
  items: BreadcrumbItem[],
  originOverride?: string,
): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path, originOverride),
    })),
  };
}

export function buildOrganizationJsonLd(
  imageUrl: string,
  originOverride?: string,
): Record<string, unknown> {
  const homeUrl = buildCanonicalUrl('/', originOverride);
  const logoUrl = resolveAbsoluteImageUrl('/favicon.svg', originOverride);

  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${homeUrl}#organization`,
    name: SITE_NAME,
    alternateName: 'HOF Nepal',
    legalName: 'House of Fashion Nepal Pvt. Ltd.',
    description:
      'An independent editorial fashion and commercial talent agency bridging Nepal’s creative ateliers with international fashion houses.',
    url: homeUrl,
    image: imageUrl,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
    },
    foundingDate: '2019',
    foundingLocation: {
      '@type': 'Place',
      name: 'Lalitpur, Nepal',
    },
    telephone: '+977-1-5528410',
    email: 'bookings@houseoffashionnepal.com.np',
    sameAs: [
      'https://www.facebook.com/houseoffashionnepal',
      'https://www.instagram.com/houseoffashionnepal',
      'https://www.youtube.com/@houseoffashionnepal',
      'https://x.com/houseoffashionnepal',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jhamsikhel Atelier Wing, Ward 3',
      addressLocality: 'Lalitpur',
      addressRegion: 'Bagmati Province',
      postalCode: '44700',
      addressCountry: 'NP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.6766,
      longitude: 85.3114,
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Nepal',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'South Asia',
      },
      'International',
    ],
    knowsAbout: [
      'Editorial Fashion Modeling',
      'Commercial Talent Representation',
      'Runway Casting in Nepal',
      'New Faces Scouting Across Nepal',
      'Photoshoot & Campaign Production',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'bookings',
        email: 'bookings@houseoffashionnepal.com.np',
        telephone: '+977-1-5528410',
        areaServed: 'NP',
        availableLanguage: ['English', 'Nepali', 'Hindi'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'scouting',
        email: 'scouting@houseoffashionnepal.com.np',
        areaServed: 'NP',
        availableLanguage: ['English', 'Nepali'],
      },
    ],
  };
}

export function buildAgencyJsonLd(
  canonicalUrl: string,
  imageUrl: string,
  originOverride?: string,
): Record<string, unknown> {
  const homeUrl = buildCanonicalUrl('/', originOverride);
  const modelsSearchUrl = `${buildCanonicalUrl('/models', originOverride)}?search={search_term_string}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationJsonLd(imageUrl, originOverride),
      {
        '@type': 'WebSite',
        '@id': `${homeUrl}#website`,
        name: SITE_NAME,
        url: homeUrl,
        inLanguage: 'en',
        publisher: { '@id': `${homeUrl}#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: modelsSearchUrl,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      ...(canonicalUrl !== homeUrl
        ? [
            {
              '@type': 'WebPage',
              url: canonicalUrl,
              isPartOf: { '@id': `${homeUrl}#website` },
            },
          ]
        : []),
    ],
  };
}

export function buildModelJsonLd(
  model: Model,
  canonicalUrl: string,
  imageUrl: string,
  originOverride?: string,
): Record<string, unknown> {
  const homeUrl = buildCanonicalUrl('/', originOverride);
  const breadcrumbs = buildBreadcrumbJsonLd(
    [
      { name: 'Home', path: '/' },
      { name: 'Models', path: '/models' },
      { name: model.name, path: `/models/${model.slug}` },
    ],
    originOverride,
  );

  const videoObjects = (model.videos || []).map((vid) => ({
    '@type': 'VideoObject',
    name: `${model.name} — ${vid.title}`,
    description: `${vid.category || 'Model Showreel'} featuring ${model.name} (${model.id}) represented by House of Fashion Nepal.`,
    thumbnailUrl: resolveAbsoluteImageUrl(vid.poster || model.coverImage, originOverride),
    contentUrl: vid.url,
    embedUrl: vid.url,
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationJsonLd(
        resolveAbsoluteImageUrl(DEFAULT_SEO_IMAGE, originOverride),
        originOverride,
      ),
      breadcrumbs,
      {
        '@type': 'ProfilePage',
        url: canonicalUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
        isPartOf: { '@id': `${homeUrl}#website` },
        mainEntity: {
          '@type': 'Person',
          name: model.name,
          identifier: model.id,
          description: truncateMetaDescription(model.bio, 240),
          image: model.gallery.map((g) => resolveAbsoluteImageUrl(g, originOverride)),
          url: canonicalUrl,
          nationality: model.nationality || 'Nepalese',
          knowsLanguage: model.languages,
          homeLocation: {
            '@type': 'Place',
            name: `${model.location}, Nepal`,
          },
          height: {
            '@type': 'QuantitativeValue',
            value: model.height,
            unitCode: 'CMT',
          },
          jobTitle: `${model.experienceLevel} Fashion & Commercial Model`,
          worksFor: {
            '@id': `${homeUrl}#organization`,
          },
        },
      },
      ...videoObjects,
    ],
  };
}

export function buildBlogPostJsonLd(
  post: BlogPost,
  canonicalUrl: string,
  imageUrl: string,
  originOverride?: string,
): Record<string, unknown> {
  const homeUrl = buildCanonicalUrl('/', originOverride);
  const breadcrumbs = buildBreadcrumbJsonLd(
    [
      { name: 'Home', path: '/' },
      { name: 'Journal', path: '/blog' },
      { name: post.title, path: `/blog/${post.slug}` },
    ],
    originOverride,
  );

  const wordCount = post.sections
    .flatMap((s) => [...s.paragraphs, ...(s.checklist || [])])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationJsonLd(
        resolveAbsoluteImageUrl(DEFAULT_SEO_IMAGE, originOverride),
        originOverride,
      ),
      breadcrumbs,
      {
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        headline: post.title,
        description: truncateMetaDescription(post.excerpt, 158),
        image: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
        author: {
          '@type': 'Person',
          name: post.authorName,
          jobTitle: post.authorRole,
        },
        publisher: {
          '@id': `${homeUrl}#organization`,
        },
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        articleSection: post.category,
        keywords: post.tags.join(', '),
        wordCount,
        inLanguage: 'en',
        isPartOf: {
          '@type': 'Blog',
          name: 'The House of Fashion Nepal Journal',
          url: buildCanonicalUrl('/blog', originOverride),
        },
      },
    ],
  };
}

const ROUTE_SEO_MAP: Record<string, RouteSeoDefaults> = {
  '/': {
    title: 'House of Fashion Nepal — Modeling & Talent Agency',
    description:
      'An independent editorial fashion and commercial talent agency bridging Nepal’s creative ateliers with international fashion houses.',
    image: AGENCY_ASSETS.HERO_EDITORIAL,
    imageAlt: 'House of Fashion Nepal editorial model campaign',
    type: 'website',
    breadcrumbLabel: 'Home',
    keywords: [
      'modeling agency Nepal',
      'Nepal fashion models',
      'House of Fashion Nepal',
      'commercial talent Nepal',
      'editorial modeling South Asia',
    ],
  },
  '/models': {
    title: 'Our Models — Talent Directory | House of Fashion Nepal',
    description:
      'Browse represented editorial, runway, commercial, curve, fitness, and new face models across all of Nepal.',
    image: AGENCY_ASSETS.MODEL_AANYA,
    imageAlt: 'House of Fashion Nepal talent directory',
    type: 'website',
    breadcrumbLabel: 'Models',
    keywords: [
      'Nepal model directory',
      'book models Nepal',
      'fashion models Nepal',
      'new faces Nepal',
    ],
  },
  '/projects': {
    title: 'Clients & Projects — Production Archive | House of Fashion Nepal',
    description:
      'Explore heritage fashion houses, hospitality brands, and editorial lookbooks cast and produced by House of Fashion Nepal.',
    image: AGENCY_ASSETS.CAMPAIGN_MONOLITH,
    imageAlt: 'Kala Menswear campaign by House of Fashion Nepal',
    type: 'website',
    breadcrumbLabel: 'Clients & Projects',
    keywords: [
      'Nepal fashion campaigns',
      'Nepal photoshoot production',
      'House of Fashion Nepal clients and projects',
    ],
  },
  '/clients': {
    title: 'Clients & Projects — Production Archive | House of Fashion Nepal',
    description:
      'Explore heritage fashion houses, hospitality brands, and editorial lookbooks cast and produced by House of Fashion Nepal.',
    image: AGENCY_ASSETS.CAMPAIGN_MONOLITH,
    imageAlt: 'Kala Menswear campaign by House of Fashion Nepal',
    type: 'website',
    breadcrumbLabel: 'Clients & Projects',
    keywords: ['House of Fashion Nepal partner brands', 'Nepal creative clients'],
  },
  '/events': {
    title: 'Events, Fashion Shows & Auditions | House of Fashion Nepal',
    description:
      'Explore upcoming fashion shows, open model auditions, runway workshops, designer showcases, and industry galas hosted by House of Fashion Nepal across Nepal.',
    image: AGENCY_ASSETS.EVENT_COUTURE_RUNWAY,
    imageAlt: 'House of Fashion Nepal couture runway fashion show and events',
    type: 'website',
    breadcrumbLabel: 'Events',
    keywords: [
      'Nepal fashion show',
      'Kathmandu model audition',
      'House of Fashion Nepal events',
      'Nepal casting call',
      'runway workshop Nepal',
    ],
  },
  '/about': {
    title: 'About Us — Agency Story & Leadership | House of Fashion Nepal',
    description:
      'Founded in 2019, House of Fashion Nepal bridges Nepal’s creative ateliers with international fashion houses through ethical model representation.',
    image: AGENCY_ASSETS.AGENCY_STUDIO,
    imageAlt: 'House of Fashion Nepal daylight studio',
    type: 'website',
    breadcrumbLabel: 'About',
    keywords: [
      'about House of Fashion Nepal',
      'ethical modeling agency Nepal',
      'Nepal fashion agency',
    ],
  },
  '/services': {
    title: 'Agency Services — Casting & Production | House of Fashion Nepal',
    description:
      'Commission fashion, runway, and commercial casting, talent licensing, and nationwide Nepal photoshoot production with House of Fashion Nepal.',
    image: AGENCY_ASSETS.HERO_ATELIER,
    imageAlt: 'House of Fashion Nepal couture presentation and production services',
    type: 'website',
    breadcrumbLabel: 'Services',
    keywords: [
      'talent casting Nepal',
      'photoshoot production Nepal',
      'TVC model booking Nepal',
    ],
  },
  '/become-a-model': {
    title: 'Become a Model — Open Scouting | House of Fashion Nepal',
    description:
      'Apply online with natural-light digitals to join House of Fashion Nepal from anywhere in the country. Zero scouting fees and no prior portfolio required.',
    image: AGENCY_ASSETS.MODEL_TARA,
    imageAlt: 'House of Fashion Nepal New Faces scouting',
    type: 'website',
    breadcrumbLabel: 'Become a Model',
    keywords: [
      'become a model Nepal',
      'open casting Nepal',
      'model application Nepal',
    ],
  },
  '/book': {
    title: 'Book a Model — Talent Availability | House of Fashion Nepal',
    description:
      'Request model availability, provisional option holds, and usage rate cards from House of Fashion Nepal’s booking desk.',
    image: AGENCY_ASSETS.MODEL_PRIYA,
    imageAlt: 'Book fashion and commercial talent via House of Fashion Nepal',
    type: 'website',
    breadcrumbLabel: 'Book a Model',
    keywords: ['book a model Nepal', 'model rate card Nepal'],
  },
  '/blog': {
    title: 'The House of Fashion Nepal Journal — Model Craft, Skincare & Fashion Guides',
    description:
      'Editorial guides for models across Nepal covering fashion styling, skin barrier care, daily routines, runway posing, nutrition, and casting ethics.',
    image: AGENCY_ASSETS.BLOG_SKINCARE,
    imageAlt: 'The House of Fashion Nepal Journal — Model Craft, Skincare & Fashion Guides',
    type: 'website',
    breadcrumbLabel: 'Journal',
    keywords: [
      'modeling blog Nepal',
      'model skincare routine',
      'how to become a model Nepal',
      'runway posing tips',
      'model daily routine',
    ],
  },
  '/contact': {
    title: 'Contact Agency — Studio & Press Desk | House of Fashion Nepal',
    description:
      'Reach House of Fashion Nepal for nationwide casting, press inquiries, creative partnerships, and studio appointments.',
    image: AGENCY_ASSETS.AGENCY_STUDIO,
    imageAlt: 'House of Fashion Nepal studio office',
    type: 'website',
    breadcrumbLabel: 'Contact',
    keywords: ['contact House of Fashion Nepal', 'Nepal modeling agency phone'],
  },
  '/privacy-policy': {
    title: 'Privacy Policy — Nepal Data Protection | House of Fashion Nepal',
    description:
      'Review House of Fashion Nepal’s privacy governance under Nepal’s Individual Privacy Act, 2075 and Electronic Transactions Act, 2063.',
    image: AGENCY_ASSETS.AGENCY_STUDIO,
    imageAlt: 'House of Fashion Nepal Privacy Policy',
    type: 'website',
    breadcrumbLabel: 'Privacy Policy',
    keywords: ['Nepal privacy policy', 'Individual Privacy Act 2075'],
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions — Agency Governance | House of Fashion Nepal',
    description:
      'Commercial booking terms, copyright protections, and talent standards governed by Nepalese law for House of Fashion Nepal.',
    image: AGENCY_ASSETS.AGENCY_STUDIO,
    imageAlt: 'House of Fashion Nepal Terms and Conditions',
    type: 'website',
    breadcrumbLabel: 'Terms & Conditions',
    keywords: ['Nepal modeling contract terms', 'Muluki Civil Code 2074'],
  },
  '/admin': {
    title: 'Agency Booking & Roster Desk | House of Fashion Nepal',
    description:
      'Internal House of Fashion Nepal dashboard for roster portfolios, client commissions, testimonials, and booking inquiries.',
    image: AGENCY_ASSETS.AGENCY_STUDIO,
    imageAlt: 'House of Fashion Nepal Internal Desk',
    type: 'website',
    breadcrumbLabel: 'Admin',
    keywords: ['House of Fashion Nepal admin desk'],
    noIndex: true,
  },
};

export function buildRouteSeo(input: ResolveSeoInput): ResolvedSeoMetadata {
  const cleanPath = normalizePathname(input.canonicalPath || input.pathname);
  const canonicalUrl = buildCanonicalUrl(cleanPath, input.origin);
  const homeUrl = buildCanonicalUrl('/', input.origin);
  const routeDefaults =
    ROUTE_SEO_MAP[cleanPath] ||
    (cleanPath.startsWith('/admin/') ? ROUTE_SEO_MAP['/admin'] : ROUTE_SEO_MAP['/']);

  if (input.model) {
    const model = input.model;
    const modelTitle = formatBrandTitle(
      input.title || `${model.name} (${model.id}) — Portfolio`,
    );
    const modelSummary = `${model.name} represented by House of Fashion Nepal in ${model.location}. ${model.category.slice(0, 3).join(', ')}, ${model.height} cm. ${model.bio}`;
    const description = truncateMetaDescription(input.description || modelSummary);
    const imageUrl = resolveAbsoluteImageUrl(
      input.image || model.coverImage,
      input.origin,
    );
    const imageAlt =
      input.imageAlt ||
      `${model.name} — ${model.experienceLevel} model portfolio at House of Fashion Nepal`;

    const modelSchema = Array.isArray(input.structuredData)
      ? { '@context': 'https://schema.org', '@graph': input.structuredData }
      : input.structuredData ||
        buildModelJsonLd(model, canonicalUrl, imageUrl, input.origin);

    return {
      title: modelTitle,
      description,
      canonicalUrl,
      imageUrl,
      imageAlt,
      type: input.type || 'profile',
      keywords: [
        model.name,
        `${model.location} model`,
        ...model.category,
        SITE_NAME,
        ...(input.keywords || []),
      ].join(', '),
      noIndex: Boolean(input.noIndex),
      structuredData: modelSchema,
    };
  }

  if (input.blogPost) {
    const post = input.blogPost;
    const postTitle = formatBrandTitle(
      input.title || `${post.title} — House of Fashion Nepal Journal`,
    );
    const description = truncateMetaDescription(
      input.description || post.excerpt,
    );
    const imageUrl = resolveAbsoluteImageUrl(
      input.image || post.coverImage,
      input.origin,
    );
    const imageAlt = input.imageAlt || post.coverAlt;

    const postSchema = Array.isArray(input.structuredData)
      ? { '@context': 'https://schema.org', '@graph': input.structuredData }
      : input.structuredData ||
        buildBlogPostJsonLd(post, canonicalUrl, imageUrl, input.origin);

    return {
      title: postTitle,
      description,
      canonicalUrl,
      imageUrl,
      imageAlt,
      type: input.type || 'article',
      keywords: Array.from(
        new Set([post.category, ...post.tags, SITE_NAME, ...(input.keywords || [])]),
      ).join(', '),
      noIndex: Boolean(input.noIndex),
      structuredData: postSchema,
    };
  }

  const title = formatBrandTitle(input.title || routeDefaults.title);
  const description = truncateMetaDescription(
    input.description || routeDefaults.description,
  );
  const imageUrl = resolveAbsoluteImageUrl(
    input.image || routeDefaults.image,
    input.origin,
  );
  const imageAlt = input.imageAlt || routeDefaults.imageAlt;
  const type = input.type || routeDefaults.type;
  const noIndex = input.noIndex ?? Boolean(routeDefaults.noIndex);

  let structuredData: Record<string, unknown> | undefined;

  if (input.structuredData) {
    structuredData = Array.isArray(input.structuredData)
      ? { '@context': 'https://schema.org', '@graph': input.structuredData }
      : input.structuredData;
  } else if (!noIndex) {
    const graphNodes: Array<Record<string, unknown>> = [];

    if (cleanPath !== '/') {
      const trail: BreadcrumbItem[] = input.breadcrumbs || [
        { name: 'Home', path: '/' },
        { name: routeDefaults.breadcrumbLabel, path: cleanPath },
      ];
      graphNodes.push(buildBreadcrumbJsonLd(trail, input.origin));
    }

    if (cleanPath === '/' || cleanPath === '/about' || cleanPath === '/contact') {
      const agencyDoc = buildAgencyJsonLd(canonicalUrl, imageUrl, input.origin);
      const agencyGraph = agencyDoc['@graph'] as Array<Record<string, unknown>>;
      graphNodes.push(...agencyGraph);

      if (cleanPath === '/about') {
        graphNodes.push({
          '@type': 'AboutPage',
          name: title,
          description,
          url: canonicalUrl,
          about: { '@id': `${homeUrl}#organization` },
          isPartOf: { '@id': `${homeUrl}#website` },
        });
      } else if (cleanPath === '/contact') {
        graphNodes.push({
          '@type': 'ContactPage',
          name: title,
          description,
          url: canonicalUrl,
          about: { '@id': `${homeUrl}#organization` },
          isPartOf: { '@id': `${homeUrl}#website` },
        });
      }
    } else {
      graphNodes.push(buildOrganizationJsonLd(imageUrl, input.origin));

      if (cleanPath === '/models' || cleanPath === '/projects' || cleanPath === '/clients') {
        graphNodes.push({
          '@type': 'CollectionPage',
          name: title,
          description,
          url: canonicalUrl,
          publisher: { '@id': `${homeUrl}#organization` },
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${homeUrl}#website`,
            name: SITE_NAME,
            url: homeUrl,
          },
        });
        if (cleanPath === '/models' && input.models && input.models.length > 0) {
          graphNodes.push({
            '@type': 'ItemList',
            name: 'House of Fashion Nepal Talent Roster',
            numberOfItems: input.models.length,
            itemListElement: input.models.slice(0, 24).map((m, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: buildCanonicalUrl(`/models/${m.slug}`, input.origin),
              item: {
                '@type': 'Person',
                name: m.name,
                url: buildCanonicalUrl(`/models/${m.slug}`, input.origin),
                image: resolveAbsoluteImageUrl(m.coverImage, input.origin),
                jobTitle: `${m.experienceLevel} Fashion & Commercial Model`,
                homeLocation: {
                  '@type': 'Place',
                  name: `${m.location}, Nepal`,
                },
                worksFor: { '@id': `${homeUrl}#organization` },
              },
            })),
          });
        }
        if (input.projects && input.projects.length > 0) {
          graphNodes.push({
            '@type': 'ItemList',
            name: 'House of Fashion Nepal Client Commissions',
            numberOfItems: input.projects.length,
            itemListElement: input.projects.slice(0, 12).map((p, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'CreativeWork',
                name: p.title,
                creator: p.clientName,
                genre: p.category,
                locationCreated: p.location,
                dateCreated: p.year,
                image: resolveAbsoluteImageUrl(p.coverImage, input.origin),
              },
            })),
          });
        }
      } else if (cleanPath === '/services') {
        graphNodes.push({
          '@type': 'Service',
          serviceType: 'Modeling & Talent Representation',
          provider: { '@id': `${homeUrl}#organization` },
          areaServed: [
            { '@type': 'Country', name: 'Nepal' },
            'South Asia',
            'International',
          ],
          ...(input.services && input.services.length > 0
            ? {
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: 'House of Fashion Nepal Agency Capabilities',
                  itemListElement: input.services.map((srv) => ({
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: srv.title,
                      description: srv.description,
                    },
                  })),
                },
              }
            : {}),
        });
      } else if (cleanPath === '/book') {
        graphNodes.push({
          '@type': 'ContactPage',
          name: title,
          description,
          url: canonicalUrl,
          publisher: { '@id': `${homeUrl}#organization` },
          about: { '@id': `${homeUrl}#organization` },
        });
      } else if (cleanPath === '/blog') {
        graphNodes.push({
          '@type': 'Blog',
          name: 'The House of Fashion Nepal Journal',
          description,
          url: canonicalUrl,
          publisher: { '@id': `${homeUrl}#organization` },
          inLanguage: 'en',
          ...(input.blogPosts && input.blogPosts.length > 0
            ? {
                blogPost: input.blogPosts.slice(0, 12).map((post) => ({
                  '@type': 'BlogPosting',
                  headline: post.title,
                  description: post.excerpt,
                  url: buildCanonicalUrl(`/blog/${post.slug}`, input.origin),
                  datePublished: post.publishedAt,
                  dateModified: post.updatedAt,
                  articleSection: post.category,
                  image: resolveAbsoluteImageUrl(post.coverImage, input.origin),
                  author: {
                    '@type': 'Person',
                    name: post.authorName,
                  },
                })),
              }
            : {}),
        });
      } else if (cleanPath === '/events') {
        graphNodes.push({
          '@type': 'CollectionPage',
          name: title,
          description,
          url: canonicalUrl,
          publisher: { '@id': `${homeUrl}#organization` },
          isPartOf: { '@id': `${homeUrl}#website` },
        });
        if (input.events && input.events.length > 0) {
          graphNodes.push({
            '@type': 'ItemList',
            name: 'House of Fashion Nepal Events & Auditions Calendar',
            numberOfItems: input.events.length,
            itemListElement: input.events.slice(0, 12).map((evt, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Event',
                name: evt.title,
                description: evt.summary,
                startDate: evt.date,
                ...(evt.endDate ? { endDate: evt.endDate } : {}),
                eventStatus:
                  evt.status === 'cancelled'
                    ? 'https://schema.org/EventCancelled'
                    : 'https://schema.org/EventScheduled',
                eventAttendanceMode:
                  'https://schema.org/OfflineEventAttendanceMode',
                location: {
                  '@type': 'Place',
                  name: evt.venue,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: evt.city,
                    addressCountry: 'NP',
                  },
                },
                image: resolveAbsoluteImageUrl(evt.coverImage, input.origin),
                organizer: { '@id': `${homeUrl}#organization` },
              },
            })),
          });
        }
      } else if (cleanPath === '/privacy-policy' || cleanPath === '/terms-and-conditions') {
        graphNodes.push({
          '@type': 'WebPage',
          name: title,
          description,
          url: canonicalUrl,
          publisher: { '@id': `${homeUrl}#organization` },
        });
      }
    }

    if (input.faqs && input.faqs.length > 0) {
      graphNodes.push({
        '@type': 'FAQPage',
        mainEntity: input.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    } else if (cleanPath === '/become-a-model') {
      graphNodes.push({
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Do I need a prior professional portfolio to apply to House of Fashion Nepal?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No prior portfolio is required. Smartphone natural-light snapshots are welcome, and House of Fashion Nepal never charges aspiring applicants scouting fees.',
            },
          },
          {
            '@type': 'Question',
            name: 'How should I prepare my digital snapshots?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Shoot near a window in natural daylight against a plain wall, wearing fitted monochrome basics without heavy makeup, filters, or studio retouching.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the minimum age to apply?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'All applicants applying directly through the House of Fashion Nepal online scouting desk must be 18 years or older.',
            },
          },
        ],
      });
    }

    if (graphNodes.length > 0) {
      structuredData = {
        '@context': 'https://schema.org',
        '@graph': graphNodes,
      };
    }
  }

  return {
    title,
    description,
    canonicalUrl,
    imageUrl,
    imageAlt,
    type,
    keywords: Array.from(
      new Set([...(routeDefaults.keywords || []), ...(input.keywords || [])]),
    ).join(', '),
    noIndex,
    structuredData,
  };
}
