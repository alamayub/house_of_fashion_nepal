import { AGENCY_ASSETS, normalizePublicAssetUrl } from '../data/assets.ts';
import { MOCK_CLIENTS, MOCK_PROJECTS } from '../data/mockClientsProjects.ts';
import { INITIAL_EVENT_REGISTRATIONS, MOCK_EVENTS } from '../data/mockEvents.ts';
import { MOCK_MODELS } from '../data/mockModels.ts';
import { AGENCY_SERVICES, MODEL_CATEGORIES } from '../data/mockServices.ts';
import { MOCK_TESTIMONIALS } from '../data/mockTestimonials.ts';
import { VALID_MODEL_STATUSES } from '../constants/modelStatus.ts';
import type {
  AgencyEvent,
  AgencyProject,
  ApplicationPayload,
  ApplicationRecord,
  BookingPayload,
  BookingRecord,
  CastTalentSummary,
  ClientPartner,
  ContactPayload,
  ContactRecord,
  EventRegistrationPayload,
  EventRegistrationRecord,
  Model,
  ModelStatus,
  ModelVideo,
  PaginatedModelsResponse,
  Testimonial,
} from '../types/index.ts';

const STORAGE_KEYS = {
  models: 'hof_nepal_models_v1',
  clients: 'hof_nepal_clients_v1',
  projects: 'hof_nepal_projects_v1',
  testimonials: 'hof_nepal_testimonials_v1',
  events: 'hof_nepal_events_v1',
  eventRegistrations: 'hof_nepal_event_registrations_v1',
  bookings: 'hof_nepal_bookings_v1',
  applications: 'hof_nepal_applications_v1',
  contacts: 'hof_nepal_contacts_v1',
} as const;

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'BK-2026-014',
    clientName: 'Prakash Adhikari',
    companyName: 'Atelier Mustang Cashmere',
    email: 'production@ateliermustang.com.np',
    phone: '+977 9801122334',
    modelSlug: 'aanya-shrestha',
    modelName: 'Aanya Shrestha',
    projectType: 'Editorial & Lookbook',
    shootDate: '2026-12-04',
    location: 'Patan Museum Courtyard',
    details:
      'Two-day Autumn/Winter handloom cashmere lookbook with natural morning light.',
    status: 'confirmed',
    adminNotes: 'Call sheet signed. Wardrobe fitting scheduled Dec 2 at Jhamsikhel.',
    createdAt: '2026-11-12T09:30:00.000Z',
  },
  {
    id: 'BK-2026-015',
    clientName: 'Roshani Basnyat',
    companyName: 'Kazi Textile Collective',
    email: 'roshani@kazitextiles.com.np',
    phone: '+977 9851094421',
    modelSlug: 'aarav-gurung',
    modelName: 'Aarav Gurung',
    projectType: 'Commercial Campaign',
    shootDate: '2026-12-11',
    location: 'Bhaktapur Pottery Square & Studio',
    details:
      'Men’s heritage wool overcoat campaign covering print billboards and 30s social reel.',
    status: 'reviewing',
    adminNotes: 'Confirming travel buffer with production coordinator.',
    createdAt: '2026-11-15T14:15:00.000Z',
  },
  {
    id: 'BK-2026-016',
    clientName: 'Marc-Antoine Delacroix',
    companyName: 'Maison Yala Paris',
    email: 'casting@maisonyala.fr',
    phone: '+33 6 42 88 19 04',
    modelSlug: 'maya-basnet',
    modelName: 'Maya Basnet',
    projectType: 'International Runway / Editorial',
    shootDate: '2026-12-19',
    location: 'Kathmandu · Dwarika’s Heritage Wing',
    details:
      'Resort 2027 capsule presentation and private press preview with full glam team.',
    status: 'pending',
    createdAt: '2026-11-16T17:40:00.000Z',
  },
];

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'APP-2026-101',
    fullName: 'Nischal Gurung',
    email: 'nischal.gurung99@gmail.com',
    phone: '+977 9841229901',
    dateOfBirth: '2003-04-18',
    location: 'Pokhara, Gandaki',
    gender: 'Male',
    category: 'Fashion Models',
    height: 185,
    weight: 74,
    experience: '1 Year · Pokhara Campus Editorial & Streetwear Lookbooks',
    instagram: '@nischal.grg',
    portfolioUrl: 'https://behance.net/nischal-lookbook',
    introduction:
      'Based in Lakeside Pokhara, available to travel to Kathmandu on short notice for menswear campaigns and runway castings.',
    profilePhotoName: 'nischal-headshot-natural.jpg',
    portfolioPhotoNames: ['nischal-full-length.jpg', 'nischal-side-profile.jpg'],
    consentAccepted: true,
    status: 'shortlisted',
    adminNotes: 'Strong bone structure; invite to Dec Kathmandu go-see.',
    createdAt: '2026-11-14T10:15:00.000Z',
  },
  {
    id: 'APP-2026-102',
    fullName: 'Sriti Lama',
    email: 'sritilama.work@gmail.com',
    phone: '+977 9813775540',
    dateOfBirth: '2004-09-02',
    location: 'Lalitpur, Kathmandu Valley',
    gender: 'Female',
    category: 'New Faces',
    height: 175,
    weight: 54,
    experience: 'New Face · Zero formal agency representation',
    instagram: '@sriti.l',
    introduction:
      'Architecture student in Pulchowk with strong interest in minimalist fashion editorials and sustainable Nepali weaves.',
    profilePhotoName: 'sriti-polaroid-1.jpg',
    portfolioPhotoNames: ['sriti-polaroid-2.jpg', 'sriti-polaroid-3.jpg'],
    consentAccepted: true,
    status: 'new',
    createdAt: '2026-11-16T11:20:00.000Z',
  },
];

const INITIAL_CONTACTS: ContactRecord[] = [
  {
    id: 'MSG-2026-401',
    name: 'Elena Lindqvist',
    company: 'Nordic Looms Studio',
    email: 'elena@nordiclooms.se',
    phone: '+46 70 441 8892',
    subject: 'Spring 2027 Himalayan Location Casting',
    message:
      'We are flying a 6-person photography crew from Stockholm to Kathmandu in March and would like casting packages for 3 editorial talents plus studio production coordination.',
    status: 'in-progress',
    adminNotes: 'Sent initial deck with Aanya, Priya, and Kiran.',
    createdAt: '2026-11-13T08:45:00.000Z',
  },
  {
    id: 'MSG-2026-402',
    name: 'Dipendra Thakali',
    company: 'Pavilion Heritage Hospitality',
    email: 'dipendra@pavilionheritage.com.np',
    phone: '+977 9851188902',
    subject: 'Commercial Print & Digital Talent Enquiry',
    message:
      'Seeking two commercial talents aged 25–35 for a 3-day luxury hospitality lifestyle shoot across Pokhara and Bandipur.',
    status: 'new',
    createdAt: '2026-11-16T15:10:00.000Z',
  },
];

function readStore<T>(key: string, fallback: T[]): T[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback.map((item) => ({ ...item }));
    }
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback.map((item) => ({ ...item }));
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback.map((item) => ({ ...item }));
  } catch {
    return fallback.map((item) => ({ ...item }));
  }
}

function writeStore<T>(key: string, data: T[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  } catch {
    // Ignore storage quota errors in restricted sandboxes
  }
}

const modelsStore: Model[] = readStore<Model>(
  STORAGE_KEYS.models,
  MOCK_MODELS,
).map((m) => ({
  ...m,
  status: VALID_MODEL_STATUSES.includes(m.status) ? m.status : 'active',
  coverImage: normalizePublicAssetUrl(m.coverImage),
  gallery: (m.gallery || []).map(normalizePublicAssetUrl),
  videos: (m.videos || []).map((v) => ({
    ...v,
    poster: v.poster ? normalizePublicAssetUrl(v.poster) : undefined,
  })),
}));
const clientsStore: ClientPartner[] = readStore<ClientPartner>(
  STORAGE_KEYS.clients,
  MOCK_CLIENTS,
);
const projectsStore: AgencyProject[] = readStore<AgencyProject>(
  STORAGE_KEYS.projects,
  MOCK_PROJECTS,
).map((p) => ({
  ...p,
  coverImage: normalizePublicAssetUrl(p.coverImage),
  gallery: (p.gallery || []).map(normalizePublicAssetUrl),
}));
const testimonialsStore: Testimonial[] = readStore<Testimonial>(
  STORAGE_KEYS.testimonials,
  MOCK_TESTIMONIALS,
);
const bookingsStore: BookingRecord[] = readStore<BookingRecord>(
  STORAGE_KEYS.bookings,
  INITIAL_BOOKINGS,
).map((b) => ({
  ...b,
  modelSlugs: b.modelSlugs?.length
    ? b.modelSlugs
    : b.modelSlug
      ? [b.modelSlug]
      : undefined,
  modelNames: b.modelNames?.length
    ? b.modelNames
    : b.modelName
      ? [b.modelName]
      : undefined,
}));
const applicationsStore: ApplicationRecord[] = readStore<ApplicationRecord>(
  STORAGE_KEYS.applications,
  INITIAL_APPLICATIONS,
);
const contactsStore: ContactRecord[] = readStore<ContactRecord>(
  STORAGE_KEYS.contacts,
  INITIAL_CONTACTS,
).map((c) => ({ ...c, status: c.status || 'new' }));

const eventsStore: AgencyEvent[] = readStore<AgencyEvent>(
  STORAGE_KEYS.events,
  MOCK_EVENTS,
).map((evt) => ({
  ...evt,
  coverImage: normalizePublicAssetUrl(evt.coverImage),
  highlights: Array.isArray(evt.highlights) ? evt.highlights : [],
  featuredTalentSlugs: Array.isArray(evt.featuredTalentSlugs)
    ? evt.featuredTalentSlugs
    : [],
}));

const eventRegistrationsStore: EventRegistrationRecord[] =
  readStore<EventRegistrationRecord>(
    STORAGE_KEYS.eventRegistrations,
    INITIAL_EVENT_REGISTRATIONS,
  );

function enrichProject(project: AgencyProject): AgencyProject {
  const cast: CastTalentSummary[] = project.talentSlugs
    .map((slug) => modelsStore.find((m) => m.slug === slug))
    .filter((m): m is Model => Boolean(m))
    .map((m) => ({
      id: m.id,
      slug: m.slug,
      name: m.name,
      coverImage: m.coverImage,
    }));
  return { ...project, cast };
}

function enrichEvent(event: AgencyEvent): AgencyEvent {
  const featuredTalent: CastTalentSummary[] = (event.featuredTalentSlugs || [])
    .map((slug) => modelsStore.find((m) => m.slug === slug))
    .filter((m): m is Model => Boolean(m))
    .map((m) => ({
      id: m.id,
      slug: m.slug,
      name: m.name,
      coverImage: m.coverImage,
    }));
  const liveCount = eventRegistrationsStore.filter(
    (r) => r.eventId === event.id && r.status !== 'cancelled',
  ).length;
  const baseCount = Number(event.baseRegisteredCount) || 0;
  return {
    ...event,
    featuredTalent,
    registeredCount: Math.min(event.capacity, baseCount + liveCount),
  };
}

export interface LocalApiResult {
  status: number;
  data: unknown;
}

export function handleLocalApiRequest(
  urlWithQuery: string,
  method = 'GET',
  body?: unknown,
): LocalApiResult {
  const [rawPath, rawQuery = ''] = urlWithQuery.split('?');
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const query = Object.fromEntries(new URLSearchParams(rawQuery).entries());
  const upperMethod = method.toUpperCase();

  // Models
  if (upperMethod === 'GET' && path === '/models/featured') {
    return {
      status: 200,
      data: modelsStore.filter(
        (m) => m.featured && (m.status || 'active') === 'active',
      ),
    };
  }

  if (upperMethod === 'GET' && path === '/models/categories') {
    const activeModels = modelsStore.filter(
      (m) => (m.status || 'active') === 'active',
    );
    const categoriesWithLiveCounts = MODEL_CATEGORIES.map((cat) => ({
      ...cat,
      count: activeModels.filter((m) =>
        m.category.some((c) => c.toLowerCase() === cat.name.toLowerCase()),
      ).length,
    }));
    return { status: 200, data: categoriesWithLiveCounts };
  }

  if (upperMethod === 'GET' && path === '/models') {
    const {
      search = '',
      gender = '',
      category = '',
      heightMin,
      heightMax,
      ageGroup = '',
      bodyType = '',
      experienceLevel = '',
      availability = '',
      status = '',
      includeAllStatuses = '',
      location = '',
      sort = 'featured',
      page = '1',
      limit = '9',
    } = query;

    const showAllStatuses = includeAllStatuses === 'true';
    const scopePool = showAllStatuses
      ? [...modelsStore]
      : modelsStore.filter((m) => (m.status || 'active') === 'active');

    let filtered = [...scopePool];

    if (status && status !== 'All') {
      filtered = filtered.filter((m) => (m.status || 'active') === status);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.category.some((c) => c.toLowerCase().includes(q)),
      );
    }

    if (gender && gender !== 'All') {
      filtered = filtered.filter(
        (m) => m.gender.toLowerCase() === gender.toLowerCase(),
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((m) =>
        m.category.some((c) => c.toLowerCase() === category.toLowerCase()),
      );
    }

    if (heightMin) {
      const min = Number(heightMin);
      if (!Number.isNaN(min)) {
        filtered = filtered.filter((m) => m.height >= min);
      }
    }

    if (heightMax) {
      const max = Number(heightMax);
      if (!Number.isNaN(max)) {
        filtered = filtered.filter((m) => m.height <= max);
      }
    }

    if (ageGroup && ageGroup !== 'All') {
      filtered = filtered.filter((m) => m.ageGroup === ageGroup);
    }

    if (bodyType && bodyType !== 'All') {
      filtered = filtered.filter(
        (m) => (m.bodyType || '').toLowerCase() === bodyType.toLowerCase(),
      );
    }

    if (experienceLevel && experienceLevel !== 'All') {
      filtered = filtered.filter(
        (m) => m.experienceLevel.toLowerCase() === experienceLevel.toLowerCase(),
      );
    }

    if (availability && availability !== 'All') {
      filtered = filtered.filter((m) => m.availability === availability);
    }

    if (location && location !== 'All') {
      filtered = filtered.filter(
        (m) => m.location.toLowerCase() === location.toLowerCase(),
      );
    }

    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => b.joinedYear - a.joinedYear || b.id.localeCompare(a.id));
        break;
      case 'height_asc':
        filtered.sort((a, b) => a.height - b.height);
        break;
      case 'height_desc':
        filtered.sort((a, b) => b.height - a.height);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    const total = filtered.length;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(50, Number(limit) || 9));
    const totalPages = Math.max(1, Math.ceil(total / limitNum));
    const safePage = Math.min(pageNum, totalPages);
    const startIndex = (safePage - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    const response: PaginatedModelsResponse = {
      data: paginated,
      total,
      page: safePage,
      limit: limitNum,
      totalPages,
      availableFilters: {
        genders: Array.from(new Set(scopePool.map((m) => m.gender))),
        categories: Array.from(new Set(scopePool.flatMap((m) => m.category))),
        bodyTypes: Array.from(
          new Set(scopePool.map((m) => m.bodyType).filter(Boolean) as string[]),
        ),
        experienceLevels: Array.from(
          new Set(scopePool.map((m) => m.experienceLevel)),
        ),
        locations: Array.from(new Set(scopePool.map((m) => m.location))),
      },
    };
    return { status: 200, data: response };
  }

  const modelVideoMatch = path.match(/^\/models\/([^/]+)\/videos$/);
  if (upperMethod === 'POST' && modelVideoMatch) {
    const slug = modelVideoMatch[1];
    const idx = modelsStore.findIndex((m) => m.slug === slug);
    if (idx === -1) {
      return { status: 404, data: { message: 'Model not found' } };
    }
    const video = body as Omit<ModelVideo, 'id'> & { id?: string };
    if (!video?.title || !video?.url) {
      return { status: 400, data: { message: 'Video title and URL are required' } };
    }
    const current = modelsStore[idx];
    const nextCategories = current.category.includes('Video')
      ? current.category
      : [...current.category, 'Video'];
    modelsStore[idx] = {
      ...current,
      category: nextCategories,
      videos: [
        {
          ...video,
          id: video.id || `vid-${Date.now()}`,
        },
        ...(current.videos || []),
      ],
    };
    writeStore(STORAGE_KEYS.models, modelsStore);
    return { status: 201, data: modelsStore[idx] };
  }

  const singleModelMatch = path.match(/^\/models\/([^/]+)$/);
  if (singleModelMatch) {
    const param = singleModelMatch[1];

    if (upperMethod === 'GET') {
      const model = modelsStore.find((m) => m.slug === param);
      if (!model) {
        return { status: 404, data: { message: 'Model profile not found' } };
      }
      const similar = modelsStore
        .filter(
          (m) =>
            m.slug !== model.slug &&
            (m.status || 'active') === 'active' &&
            (m.gender === model.gender ||
              m.category.some((c) => model.category.includes(c))),
        )
        .slice(0, 4);
      return { status: 200, data: { model, similar } };
    }

    if (upperMethod === 'PATCH') {
      const updates = body as Partial<Model>;
      const idx = modelsStore.findIndex((m) => m.id === param);
      if (idx === -1) {
        return { status: 404, data: { message: 'Model not found' } };
      }
      const updated: Model = {
        ...modelsStore[idx],
        ...updates,
        id: modelsStore[idx].id,
      };
      if (
        updates.availability &&
        !['available', 'booked', 'unavailable'].includes(updates.availability)
      ) {
        updated.availability = modelsStore[idx].availability;
      }
      if (
        updates.status &&
        !VALID_MODEL_STATUSES.includes(updates.status as ModelStatus)
      ) {
        updated.status = modelsStore[idx].status;
      }
      modelsStore[idx] = updated;
      writeStore(STORAGE_KEYS.models, modelsStore);
      return { status: 200, data: updated };
    }

    if (upperMethod === 'DELETE') {
      const idx = modelsStore.findIndex((m) => m.id === param);
      if (idx === -1) {
        return { status: 404, data: { message: 'Model not found' } };
      }
      const [removed] = modelsStore.splice(idx, 1);
      writeStore(STORAGE_KEYS.models, modelsStore);

      // Prune removed model slug from linked project cast lists
      let projectsChanged = false;
      projectsStore.forEach((p, pIdx) => {
        if (p.talentSlugs.includes(removed.slug)) {
          projectsStore[pIdx] = {
            ...p,
            talentSlugs: p.talentSlugs.filter((s) => s !== removed.slug),
          };
          projectsChanged = true;
        }
      });
      if (projectsChanged) {
        writeStore(STORAGE_KEYS.projects, projectsStore);
      }

      let eventsChanged = false;
      eventsStore.forEach((evt, eIdx) => {
        if (evt.featuredTalentSlugs.includes(removed.slug)) {
          eventsStore[eIdx] = {
            ...evt,
            featuredTalentSlugs: evt.featuredTalentSlugs.filter(
              (s) => s !== removed.slug,
            ),
          };
          eventsChanged = true;
        }
      });
      if (eventsChanged) {
        writeStore(STORAGE_KEYS.events, eventsStore);
      }

      return { status: 200, data: { deleted: true, id: removed.id, slug: removed.slug } };
    }
  }

  if (upperMethod === 'POST' && path === '/models') {
    const payload = body as Partial<Model>;
    if (!payload?.name || !payload?.gender || !payload?.height) {
      return { status: 400, data: { message: 'Name, gender, and height are required' } };
    }
    const baseSlug = payload.slug
      ? payload.slug
      : payload.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
    const normalizedBaseSlug = baseSlug || `model-${Date.now()}`;
    let uniqueSlug = normalizedBaseSlug;
    let slugSuffix = 2;
    while (modelsStore.some((m) => m.slug === uniqueSlug)) {
      uniqueSlug = `${normalizedBaseSlug}-${slugSuffix}`;
      slugSuffix += 1;
    }
    const nextNumber =
      modelsStore.reduce((max, m) => {
        const parsed = Number(m.id.replace(/^(HOF|SM)-/, ''));
        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, 12) + 1;

    const newModel: Model = {
      id: payload.id || `HOF-${String(nextNumber).padStart(2, '0')}`,
      slug: uniqueSlug,
      name: payload.name,
      gender: payload.gender,
      category:
        payload.category && payload.category.length > 0
          ? payload.category
          : ['New Faces'],
      location: payload.location || 'Kathmandu',
      height: Number(payload.height),
      weight: payload.weight ? Number(payload.weight) : undefined,
      bust: payload.bust ? Number(payload.bust) : undefined,
      chest: payload.chest ? Number(payload.chest) : undefined,
      waist: payload.waist ? Number(payload.waist) : undefined,
      hips: payload.hips ? Number(payload.hips) : undefined,
      shoeSize: payload.shoeSize || undefined,
      eyeColor: payload.eyeColor || undefined,
      hairColor: payload.hairColor || undefined,
      skinTone: payload.skinTone || undefined,
      bodyType: payload.bodyType || undefined,
      dressSize: payload.dressSize || undefined,
      nationality: payload.nationality || 'Nepalese',
      ageGroup: payload.ageGroup || '23-27',
      experience: payload.experience || 'New Development Board',
      experienceLevel: payload.experienceLevel || 'New Face',
      languages:
        payload.languages && payload.languages.length > 0
          ? payload.languages
          : ['Nepali', 'English'],
      availability: payload.availability || 'available',
      status:
        payload.status && VALID_MODEL_STATUSES.includes(payload.status)
          ? payload.status
          : 'active',
      featured: Boolean(payload.featured),
      bio: payload.bio || 'Represented by House of Fashion Nepal.',
      coverImage: normalizePublicAssetUrl(
        payload.coverImage || AGENCY_ASSETS.MODEL_TARA,
      ),
      gallery:
        payload.gallery && payload.gallery.length > 0
          ? payload.gallery.map(normalizePublicAssetUrl)
          : [
              normalizePublicAssetUrl(
                payload.coverImage || AGENCY_ASSETS.MODEL_TARA,
              ),
            ],
      videos: payload.videos || [],
      joinedYear: payload.joinedYear || new Date().getFullYear(),
    };

    modelsStore.unshift(newModel);
    writeStore(STORAGE_KEYS.models, modelsStore);
    return { status: 201, data: newModel };
  }

  // Services
  if (upperMethod === 'GET' && path === '/services') {
    return { status: 200, data: AGENCY_SERVICES };
  }

  // Clients
  if (upperMethod === 'GET' && path === '/clients') {
    return { status: 200, data: [...clientsStore] };
  }

  if (upperMethod === 'POST' && path === '/clients') {
    const payload = body as Partial<ClientPartner>;
    if (!payload?.name || !payload?.industry) {
      return { status: 400, data: { message: 'Client name and industry are required' } };
    }
    const baseSlug = payload.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const normalizedClientSlug = baseSlug || `client-${Date.now()}`;
    let uniqueSlug = normalizedClientSlug;
    let clientSlugSuffix = 2;
    while (clientsStore.some((c) => c.slug === uniqueSlug)) {
      uniqueSlug = `${normalizedClientSlug}-${clientSlugSuffix}`;
      clientSlugSuffix += 1;
    }
    const nextNum =
      clientsStore.reduce((max, c) => {
        const parsed = Number(c.id.replace('CL-', ''));
        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, 8) + 1;

    const newClient: ClientPartner = {
      id: `CL-${String(nextNum).padStart(2, '0')}`,
      slug: uniqueSlug,
      name: payload.name.trim(),
      industry: payload.industry.trim(),
      location: payload.location?.trim() || 'Kathmandu, Nepal',
      yearSince: Number(payload.yearSince) || new Date().getFullYear(),
      description:
        payload.description?.trim() ||
        `${payload.name.trim()} partners with House of Fashion Nepal for editorial casting and commercial production.`,
      featured: Boolean(payload.featured),
    };
    clientsStore.unshift(newClient);
    writeStore(STORAGE_KEYS.clients, clientsStore);
    return { status: 201, data: newClient };
  }

  const clientMatch = path.match(/^\/clients\/([^/]+)$/);
  if (clientMatch) {
    const clientId = clientMatch[1];
    if (upperMethod === 'PATCH') {
      const updates = body as Partial<ClientPartner>;
      const idx = clientsStore.findIndex((c) => c.id === clientId);
      if (idx === -1) return { status: 404, data: { message: 'Client not found' } };
      const updated: ClientPartner = {
        ...clientsStore[idx],
        ...updates,
        id: clientsStore[idx].id,
      };
      clientsStore[idx] = updated;
      // Keep clientName synced across projects
      if (updates.name) {
        projectsStore.forEach((p, pIdx) => {
          if (p.clientId === updated.id) {
            projectsStore[pIdx] = { ...p, clientName: updated.name! };
          }
        });
        writeStore(STORAGE_KEYS.projects, projectsStore);
      }
      writeStore(STORAGE_KEYS.clients, clientsStore);
      return { status: 200, data: updated };
    }
    if (upperMethod === 'DELETE') {
      const idx = clientsStore.findIndex((c) => c.id === clientId);
      if (idx === -1) return { status: 404, data: { message: 'Client not found' } };
      const [removed] = clientsStore.splice(idx, 1);
      writeStore(STORAGE_KEYS.clients, clientsStore);
      return { status: 200, data: { deleted: true, id: removed.id } };
    }
  }

  // Projects
  if (upperMethod === 'GET' && path === '/projects') {
    const {
      category = '',
      clientId = '',
      search = '',
      talentSlug = '',
      featured = '',
    } = query;

    let filtered = [...projectsStore];

    if (category && category !== 'All') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }
    if (clientId && clientId !== 'All') {
      filtered = filtered.filter((p) => p.clientId === clientId);
    }
    if (talentSlug) {
      filtered = filtered.filter((p) => p.talentSlugs.includes(talentSlug));
    }
    if (featured === 'true') {
      filtered = filtered.filter((p) => p.featured);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q),
      );
    }

    return { status: 200, data: filtered.map(enrichProject) };
  }

  if (upperMethod === 'POST' && path === '/projects') {
    const payload = body as Partial<AgencyProject>;
    if (!payload?.title || !payload?.clientId || !payload?.category) {
      return {
        status: 400,
        data: { message: 'Project title, client, and category are required' },
      };
    }
    const client = clientsStore.find((c) => c.id === payload.clientId);
    if (!client) {
      return { status: 400, data: { message: 'Selected client partner was not found' } };
    }
    const baseSlug = payload.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const normalizedProjectSlug = baseSlug || `project-${Date.now()}`;
    let uniqueSlug = normalizedProjectSlug;
    let projectSlugSuffix = 2;
    while (projectsStore.some((p) => p.slug === uniqueSlug)) {
      uniqueSlug = `${normalizedProjectSlug}-${projectSlugSuffix}`;
      projectSlugSuffix += 1;
    }
    const cover = normalizePublicAssetUrl(
      payload.coverImage?.trim() || AGENCY_ASSETS.HERO_EDITORIAL,
    );
    const projectYear = String(payload.year || new Date().getFullYear());
    const nextProjectNum =
      projectsStore.reduce((max, p) => {
        const match = p.id.match(/-(\d+)$/);
        const parsed = match ? Number(match[1]) : Number.NaN;
        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, projectsStore.length) + 1;

    const newProject: AgencyProject = {
      id: `PRJ-${projectYear}-${String(nextProjectNum).padStart(2, '0')}`,
      slug: uniqueSlug,
      title: payload.title.trim(),
      clientId: client.id,
      clientName: client.name,
      category: payload.category,
      location: payload.location?.trim() || 'Kathmandu, Nepal',
      year: String(payload.year || new Date().getFullYear()),
      season: payload.season?.trim() || undefined,
      summary:
        payload.summary?.trim() ||
        `Commissioned production for ${client.name} staged and cast by House of Fashion Nepal.`,
      deliverables:
        payload.deliverables && payload.deliverables.length > 0
          ? payload.deliverables
          : ['Creative Casting', 'Editorial Production'],
      talentSlugs: payload.talentSlugs || [],
      coverImage: cover,
      gallery:
        payload.gallery && payload.gallery.length > 0 ? payload.gallery : [cover],
      featured: Boolean(payload.featured),
    };

    projectsStore.unshift(newProject);
    writeStore(STORAGE_KEYS.projects, projectsStore);
    return { status: 201, data: enrichProject(newProject) };
  }

  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    const projectId = projectMatch[1];
    if (upperMethod === 'PATCH') {
      const updates = body as Partial<AgencyProject>;
      const idx = projectsStore.findIndex((p) => p.id === projectId);
      if (idx === -1) return { status: 404, data: { message: 'Project not found' } };
      const nextClient = updates.clientId
        ? clientsStore.find((c) => c.id === updates.clientId)
        : undefined;
      const updated: AgencyProject = {
        ...projectsStore[idx],
        ...updates,
        id: projectsStore[idx].id,
        clientName: nextClient ? nextClient.name : projectsStore[idx].clientName,
      };
      projectsStore[idx] = updated;
      writeStore(STORAGE_KEYS.projects, projectsStore);
      return { status: 200, data: enrichProject(updated) };
    }
    if (upperMethod === 'DELETE') {
      const idx = projectsStore.findIndex((p) => p.id === projectId);
      if (idx === -1) return { status: 404, data: { message: 'Project not found' } };
      const [removed] = projectsStore.splice(idx, 1);
      writeStore(STORAGE_KEYS.projects, projectsStore);
      return { status: 200, data: { deleted: true, id: removed.id } };
    }
  }

  // Testimonials
  if (upperMethod === 'GET' && path === '/testimonials') {
    const { perspective = '', featured = '' } = query;
    let filtered = [...testimonialsStore];
    if (perspective && perspective !== 'All') {
      filtered = filtered.filter((t) => t.perspective === perspective);
    }
    if (featured === 'true') {
      filtered = filtered.filter((t) => t.featured);
    }
    return { status: 200, data: filtered };
  }

  if (upperMethod === 'POST' && path === '/testimonials') {
    const payload = body as Partial<Testimonial>;
    if (!payload?.authorName || !payload?.quote || !payload?.perspective) {
      return {
        status: 400,
        data: { message: 'Author name, quote, and perspective are required' },
      };
    }
    const nextNum =
      testimonialsStore.reduce((max, t) => {
        const parsed = Number(t.id.replace('TST-', ''));
        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, 8) + 1;

    const newTestimonial: Testimonial = {
      id: `TST-${String(nextNum).padStart(2, '0')}`,
      perspective: payload.perspective === 'model' ? 'model' : 'client',
      quote: payload.quote.trim(),
      authorName: payload.authorName.trim(),
      authorRole:
        payload.authorRole?.trim() ||
        (payload.perspective === 'model' ? 'Represented Model' : 'Creative Director'),
      organizationOrBoard:
        payload.organizationOrBoard?.trim() ||
        (payload.perspective === 'model'
          ? 'House of Fashion Nepal Roster'
          : 'Partner Brand House'),
      location: payload.location?.trim() || 'Kathmandu, Nepal',
      projectOrCampaign: payload.projectOrCampaign?.trim() || undefined,
      relatedSlug: payload.relatedSlug?.trim() || undefined,
      avatarImage: payload.avatarImage?.trim() || undefined,
      year: String(payload.year || new Date().getFullYear()),
      featured: Boolean(payload.featured),
    };
    testimonialsStore.unshift(newTestimonial);
    writeStore(STORAGE_KEYS.testimonials, testimonialsStore);
    return { status: 201, data: newTestimonial };
  }

  const testimonialMatch = path.match(/^\/testimonials\/([^/]+)$/);
  if (testimonialMatch) {
    const tstId = testimonialMatch[1];
    if (upperMethod === 'PATCH') {
      const updates = body as Partial<Testimonial>;
      const idx = testimonialsStore.findIndex((t) => t.id === tstId);
      if (idx === -1) return { status: 404, data: { message: 'Testimonial not found' } };
      const updated: Testimonial = {
        ...testimonialsStore[idx],
        ...updates,
        id: testimonialsStore[idx].id,
      };
      testimonialsStore[idx] = updated;
      writeStore(STORAGE_KEYS.testimonials, testimonialsStore);
      return { status: 200, data: updated };
    }
    if (upperMethod === 'DELETE') {
      const idx = testimonialsStore.findIndex((t) => t.id === tstId);
      if (idx === -1) return { status: 404, data: { message: 'Testimonial not found' } };
      const [removed] = testimonialsStore.splice(idx, 1);
      writeStore(STORAGE_KEYS.testimonials, testimonialsStore);
      return { status: 200, data: { deleted: true, id: removed.id } };
    }
  }

  // Events & Event Registrations
  if (upperMethod === 'GET' && path === '/events') {
    const {
      category = '',
      status = '',
      city = '',
      timeframe = '',
      search = '',
      featured = '',
    } = query;

    let filtered = [...eventsStore];

    if (category && category !== 'All') {
      filtered = filtered.filter(
        (evt) => evt.category.toLowerCase() === category.toLowerCase(),
      );
    }
    if (status && status !== 'All') {
      filtered = filtered.filter((evt) => evt.status === status);
    }
    if (city && city !== 'All') {
      filtered = filtered.filter(
        (evt) => evt.city.toLowerCase() === city.toLowerCase(),
      );
    }
    if (timeframe === 'upcoming') {
      filtered = filtered.filter(
        (evt) => evt.status !== 'completed' && evt.status !== 'cancelled',
      );
    } else if (timeframe === 'past') {
      filtered = filtered.filter(
        (evt) => evt.status === 'completed' || evt.status === 'cancelled',
      );
    }
    if (featured === 'true') {
      filtered = filtered.filter((evt) => evt.featured);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (evt) =>
          evt.title.toLowerCase().includes(q) ||
          evt.venue.toLowerCase().includes(q) ||
          evt.city.toLowerCase().includes(q) ||
          evt.category.toLowerCase().includes(q) ||
          evt.summary.toLowerCase().includes(q),
      );
    }

    filtered.sort((a, b) => {
      const aPast = a.status === 'completed' || a.status === 'cancelled';
      const bPast = b.status === 'completed' || b.status === 'cancelled';
      if (aPast !== bPast) return aPast ? 1 : -1;
      return aPast ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
    });

    return { status: 200, data: filtered.map(enrichEvent) };
  }

  if (upperMethod === 'POST' && path === '/events') {
    const payload = body as Partial<AgencyEvent>;
    if (!payload?.title || !payload?.category || !payload?.date || !payload?.venue) {
      return {
        status: 400,
        data: { message: 'Event title, category, date, and venue are required' },
      };
    }
    const baseSlug = (payload.slug || payload.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const normalizedBase = baseSlug || `event-${Date.now()}`;
    let uniqueSlug = normalizedBase;
    let suffix = 2;
    while (eventsStore.some((e) => e.slug === uniqueSlug)) {
      uniqueSlug = `${normalizedBase}-${suffix}`;
      suffix += 1;
    }

    const eventYear = payload.date.slice(0, 4) || String(new Date().getFullYear());
    const nextEventNum =
      eventsStore.reduce((max, evt) => {
        const match = evt.id.match(/-(\d+)$/);
        const parsed = match ? Number(match[1]) : Number.NaN;
        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, eventsStore.length) + 1;

    const capacity = Math.max(1, Number(payload.capacity) || 100);
    const status = payload.status || 'registration-open';

    const newEvent: AgencyEvent = {
      id: `EVT-${eventYear}-${String(nextEventNum).padStart(2, '0')}`,
      slug: uniqueSlug,
      title: payload.title.trim(),
      category: payload.category,
      status,
      date: payload.date,
      endDate: payload.endDate?.trim() || undefined,
      startTime: payload.startTime?.trim() || '18:00 NPT',
      endTime: payload.endTime?.trim() || undefined,
      venue: payload.venue.trim(),
      city: payload.city?.trim() || 'Kathmandu',
      summary:
        payload.summary?.trim() ||
        `Hosted by House of Fashion Nepal at ${payload.venue.trim()}.`,
      description:
        payload.description?.trim() ||
        payload.summary?.trim() ||
        `Official House of Fashion Nepal ${payload.category.toLowerCase()} programme in ${payload.city?.trim() || 'Kathmandu'}.`,
      highlights:
        payload.highlights && payload.highlights.length > 0
          ? payload.highlights
          : ['Curated by House of Fashion Nepal production desk'],
      dressCode: payload.dressCode?.trim() || undefined,
      entryType: payload.entryType || 'Free RSVP',
      ticketPrice: payload.ticketPrice?.trim() || undefined,
      capacity,
      baseRegisteredCount: Math.max(0, Number(payload.baseRegisteredCount) || 0),
      registrationOpen:
        payload.registrationOpen !== undefined
          ? Boolean(payload.registrationOpen)
          : status === 'registration-open' || status === 'upcoming',
      featured: Boolean(payload.featured),
      coverImage: normalizePublicAssetUrl(
        payload.coverImage?.trim() || AGENCY_ASSETS.EVENT_COUTURE_RUNWAY,
      ),
      featuredTalentSlugs: Array.isArray(payload.featuredTalentSlugs)
        ? payload.featuredTalentSlugs
        : [],
    };

    eventsStore.unshift(newEvent);
    writeStore(STORAGE_KEYS.events, eventsStore);
    return { status: 201, data: enrichEvent(newEvent) };
  }

  const eventMatch = path.match(/^\/events\/([^/]+)$/);
  if (eventMatch) {
    const eventParam = eventMatch[1];
    if (upperMethod === 'GET') {
      const found = eventsStore.find(
        (e) => e.id === eventParam || e.slug === eventParam,
      );
      if (!found) return { status: 404, data: { message: 'Event not found' } };
      return { status: 200, data: enrichEvent(found) };
    }
    if (upperMethod === 'PATCH') {
      const updates = body as Partial<AgencyEvent>;
      const idx = eventsStore.findIndex((e) => e.id === eventParam);
      if (idx === -1) return { status: 404, data: { message: 'Event not found' } };
      const updated: AgencyEvent = {
        ...eventsStore[idx],
        ...updates,
        id: eventsStore[idx].id,
        coverImage: updates.coverImage
          ? normalizePublicAssetUrl(updates.coverImage)
          : eventsStore[idx].coverImage,
      };
      eventsStore[idx] = updated;
      if (updates.title) {
        eventRegistrationsStore.forEach((reg, rIdx) => {
          if (reg.eventId === updated.id) {
            eventRegistrationsStore[rIdx] = { ...reg, eventTitle: updated.title };
          }
        });
        writeStore(STORAGE_KEYS.eventRegistrations, eventRegistrationsStore);
      }
      writeStore(STORAGE_KEYS.events, eventsStore);
      return { status: 200, data: enrichEvent(updated) };
    }
    if (upperMethod === 'DELETE') {
      const idx = eventsStore.findIndex((e) => e.id === eventParam);
      if (idx === -1) return { status: 404, data: { message: 'Event not found' } };
      const [removed] = eventsStore.splice(idx, 1);
      writeStore(STORAGE_KEYS.events, eventsStore);

      const remainingRegs = eventRegistrationsStore.filter(
        (r) => r.eventId !== removed.id,
      );
      if (remainingRegs.length !== eventRegistrationsStore.length) {
        eventRegistrationsStore.splice(
          0,
          eventRegistrationsStore.length,
          ...remainingRegs,
        );
        writeStore(STORAGE_KEYS.eventRegistrations, eventRegistrationsStore);
      }

      return { status: 200, data: { deleted: true, id: removed.id } };
    }
  }

  if (upperMethod === 'GET' && path === '/event-registrations') {
    const { eventId = '', status = '' } = query;
    let filtered = [...eventRegistrationsStore];
    if (eventId && eventId !== 'All') {
      filtered = filtered.filter((r) => r.eventId === eventId);
    }
    if (status && status !== 'All') {
      filtered = filtered.filter((r) => r.status === status);
    }
    return { status: 200, data: filtered };
  }

  if (upperMethod === 'POST' && path === '/event-registrations') {
    const payload = body as EventRegistrationPayload;
    if (!payload?.eventId || !payload?.fullName || !payload?.email || !payload?.phone) {
      return {
        status: 400,
        data: { message: 'Event, full name, email, and phone are required' },
      };
    }
    const targetEvent = eventsStore.find((e) => e.id === payload.eventId);
    if (!targetEvent) {
      return { status: 404, data: { message: 'Selected event was not found' } };
    }
    if (!targetEvent.registrationOpen || targetEvent.status === 'completed' || targetEvent.status === 'cancelled') {
      return {
        status: 400,
        data: { message: 'Registration is currently closed for this event.' },
      };
    }
    const enriched = enrichEvent(targetEvent);
    const isFull = (enriched.registeredCount ?? 0) >= targetEvent.capacity;

    const nextNum =
      eventRegistrationsStore.reduce((max, r) => {
        const parsed = Number(r.id.replace('REG-2026-', ''));
        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, 5) + 1;

    const record: EventRegistrationRecord = {
      id: `REG-2026-${String(nextNum).padStart(3, '0')}`,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      fullName: payload.fullName.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      role: payload.role || 'Attendee / Guest',
      organizationOrInstagram: payload.organizationOrInstagram?.trim() || undefined,
      notes: payload.notes?.trim() || undefined,
      status: isFull ? 'waitlisted' : 'pending',
      createdAt: new Date().toISOString(),
    };
    eventRegistrationsStore.unshift(record);
    writeStore(STORAGE_KEYS.eventRegistrations, eventRegistrationsStore);
    return { status: 201, data: record };
  }

  const eventRegMatch = path.match(/^\/event-registrations\/([^/]+)$/);
  if (eventRegMatch) {
    const regId = eventRegMatch[1];
    if (upperMethod === 'PATCH') {
      const updates = body as Partial<EventRegistrationRecord>;
      const idx = eventRegistrationsStore.findIndex((r) => r.id === regId);
      if (idx === -1) {
        return { status: 404, data: { message: 'Registration not found' } };
      }
      eventRegistrationsStore[idx] = {
        ...eventRegistrationsStore[idx],
        ...updates,
        id: eventRegistrationsStore[idx].id,
      };
      writeStore(STORAGE_KEYS.eventRegistrations, eventRegistrationsStore);
      return { status: 200, data: eventRegistrationsStore[idx] };
    }
    if (upperMethod === 'DELETE') {
      const idx = eventRegistrationsStore.findIndex((r) => r.id === regId);
      if (idx === -1) {
        return { status: 404, data: { message: 'Registration not found' } };
      }
      const [removed] = eventRegistrationsStore.splice(idx, 1);
      writeStore(STORAGE_KEYS.eventRegistrations, eventRegistrationsStore);
      return { status: 200, data: { deleted: true, id: removed.id } };
    }
  }

  // Bookings, Applications, Contact & Admin Overview
  if (upperMethod === 'POST' && path === '/bookings') {
    const payload = body as BookingPayload;
    if (!payload?.clientName || !payload?.email || !payload?.projectType) {
      return { status: 400, data: { message: 'Missing required booking fields' } };
    }
    const normalizedSlugs = Array.from(
      new Set(
        (payload.modelSlugs && payload.modelSlugs.length > 0
          ? payload.modelSlugs
          : payload.modelSlug
            ? [payload.modelSlug]
            : []
        ).filter(Boolean),
      ),
    );
    const resolvedModels = normalizedSlugs
      .map((slug) => modelsStore.find((m) => m.slug === slug))
      .filter((m): m is Model => Boolean(m));
    const normalizedNames =
      payload.modelNames && payload.modelNames.length > 0
        ? payload.modelNames
        : resolvedModels.length > 0
          ? resolvedModels.map((m) => m.name)
          : payload.modelName
            ? [payload.modelName]
            : [];

    const nextNum =
      bookingsStore.reduce((max, b) => {
        const parsed = Number(b.id.replace('BK-2026-', ''));
        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, 16) + 1;
    const record: BookingRecord = {
      ...payload,
      modelSlugs: normalizedSlugs.length > 0 ? normalizedSlugs : undefined,
      modelNames: normalizedNames.length > 0 ? normalizedNames : undefined,
      modelSlug: normalizedSlugs[0] || payload.modelSlug || undefined,
      modelName:
        normalizedNames.length > 0
          ? normalizedNames.join(', ')
          : payload.modelName || undefined,
      requestedGender:
        payload.requestedGender && payload.requestedGender !== 'Any'
          ? payload.requestedGender
          : undefined,
      id: `BK-2026-${String(nextNum).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    bookingsStore.unshift(record);
    writeStore(STORAGE_KEYS.bookings, bookingsStore);
    return { status: 201, data: record };
  }

  const bookingMatch = path.match(/^\/bookings\/([^/]+)$/);
  if (bookingMatch) {
    const bookingId = bookingMatch[1];
    if (upperMethod === 'PATCH') {
      const updates = body as Partial<BookingRecord>;
      const idx = bookingsStore.findIndex((b) => b.id === bookingId);
      if (idx === -1) return { status: 404, data: { message: 'Booking not found' } };
      bookingsStore[idx] = {
        ...bookingsStore[idx],
        ...updates,
        id: bookingsStore[idx].id,
      };
      writeStore(STORAGE_KEYS.bookings, bookingsStore);
      return { status: 200, data: bookingsStore[idx] };
    }
    if (upperMethod === 'DELETE') {
      const idx = bookingsStore.findIndex((b) => b.id === bookingId);
      if (idx === -1) return { status: 404, data: { message: 'Booking not found' } };
      const [removed] = bookingsStore.splice(idx, 1);
      writeStore(STORAGE_KEYS.bookings, bookingsStore);
      return { status: 200, data: { deleted: true, id: removed.id } };
    }
  }

  if (upperMethod === 'POST' && path === '/applications') {
    const payload = body as ApplicationPayload;
    if (!payload?.fullName || !payload?.email || !payload?.consentAccepted) {
      return {
        status: 400,
        data: { message: 'Missing required application fields or consent' },
      };
    }
    const nextNum =
      applicationsStore.reduce((max, a) => {
        const parsed = Number(a.id.replace('APP-2026-', ''));
        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, 102) + 1;
    const record: ApplicationRecord = {
      ...payload,
      id: `APP-2026-${String(nextNum).padStart(3, '0')}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    applicationsStore.unshift(record);
    writeStore(STORAGE_KEYS.applications, applicationsStore);
    return { status: 201, data: record };
  }

  const applicationMatch = path.match(/^\/applications\/([^/]+)$/);
  if (applicationMatch) {
    const appId = applicationMatch[1];
    if (upperMethod === 'PATCH') {
      const updates = body as Partial<ApplicationRecord>;
      const idx = applicationsStore.findIndex((a) => a.id === appId);
      if (idx === -1) return { status: 404, data: { message: 'Application not found' } };
      applicationsStore[idx] = {
        ...applicationsStore[idx],
        ...updates,
        id: applicationsStore[idx].id,
      };
      writeStore(STORAGE_KEYS.applications, applicationsStore);
      return { status: 200, data: applicationsStore[idx] };
    }
    if (upperMethod === 'DELETE') {
      const idx = applicationsStore.findIndex((a) => a.id === appId);
      if (idx === -1) return { status: 404, data: { message: 'Application not found' } };
      const [removed] = applicationsStore.splice(idx, 1);
      writeStore(STORAGE_KEYS.applications, applicationsStore);
      return { status: 200, data: { deleted: true, id: removed.id } };
    }
  }

  if (upperMethod === 'POST' && path === '/contact') {
    const payload = body as ContactPayload;
    if (!payload?.name || !payload?.email || !payload?.message) {
      return { status: 400, data: { message: 'Missing required contact fields' } };
    }
    const nextNum =
      contactsStore.reduce((max, c) => {
        const parsed = Number(c.id.replace('MSG-2026-', ''));
        return Number.isNaN(parsed) ? max : Math.max(max, parsed);
      }, 402) + 1;
    const record: ContactRecord = {
      ...payload,
      id: `MSG-2026-${String(nextNum).padStart(3, '0')}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    contactsStore.unshift(record);
    writeStore(STORAGE_KEYS.contacts, contactsStore);
    return { status: 201, data: record };
  }

  const contactMatch = path.match(/^\/contact\/([^/]+)$/);
  if (contactMatch) {
    const contactId = contactMatch[1];
    if (upperMethod === 'PATCH') {
      const updates = body as Partial<ContactRecord>;
      const idx = contactsStore.findIndex((c) => c.id === contactId);
      if (idx === -1) return { status: 404, data: { message: 'Enquiry not found' } };
      contactsStore[idx] = {
        ...contactsStore[idx],
        ...updates,
        id: contactsStore[idx].id,
      };
      writeStore(STORAGE_KEYS.contacts, contactsStore);
      return { status: 200, data: contactsStore[idx] };
    }
    if (upperMethod === 'DELETE') {
      const idx = contactsStore.findIndex((c) => c.id === contactId);
      if (idx === -1) return { status: 404, data: { message: 'Enquiry not found' } };
      const [removed] = contactsStore.splice(idx, 1);
      writeStore(STORAGE_KEYS.contacts, contactsStore);
      return { status: 200, data: { deleted: true, id: removed.id } };
    }
  }

  if (upperMethod === 'POST' && path === '/admin/reset') {
    modelsStore.splice(
      0,
      modelsStore.length,
      ...MOCK_MODELS.map((m) => ({
        ...m,
        category: [...m.category],
        languages: [...m.languages],
        coverImage: normalizePublicAssetUrl(m.coverImage),
        gallery: m.gallery.map(normalizePublicAssetUrl),
        videos: (m.videos || []).map((v) => ({
          ...v,
          poster: v.poster ? normalizePublicAssetUrl(v.poster) : undefined,
        })),
      })),
    );
    clientsStore.splice(0, clientsStore.length, ...MOCK_CLIENTS.map((c) => ({ ...c })));
    projectsStore.splice(
      0,
      projectsStore.length,
      ...MOCK_PROJECTS.map((p) => ({
        ...p,
        deliverables: [...p.deliverables],
        talentSlugs: [...p.talentSlugs],
        coverImage: normalizePublicAssetUrl(p.coverImage),
        gallery: p.gallery.map(normalizePublicAssetUrl),
      })),
    );
    testimonialsStore.splice(
      0,
      testimonialsStore.length,
      ...MOCK_TESTIMONIALS.map((t) => ({ ...t })),
    );
    bookingsStore.splice(
      0,
      bookingsStore.length,
      ...INITIAL_BOOKINGS.map((b) => ({
        ...b,
        modelSlugs: b.modelSlugs
          ? [...b.modelSlugs]
          : b.modelSlug
            ? [b.modelSlug]
            : undefined,
        modelNames: b.modelNames
          ? [...b.modelNames]
          : b.modelName
            ? [b.modelName]
            : undefined,
      })),
    );
    applicationsStore.splice(
      0,
      applicationsStore.length,
      ...INITIAL_APPLICATIONS.map((a) => ({
        ...a,
        portfolioPhotoNames: [...a.portfolioPhotoNames],
      })),
    );
    contactsStore.splice(0, contactsStore.length, ...INITIAL_CONTACTS.map((c) => ({ ...c })));
    eventsStore.splice(
      0,
      eventsStore.length,
      ...MOCK_EVENTS.map((evt) => ({
        ...evt,
        highlights: [...evt.highlights],
        featuredTalentSlugs: [...evt.featuredTalentSlugs],
        coverImage: normalizePublicAssetUrl(evt.coverImage),
      })),
    );
    eventRegistrationsStore.splice(
      0,
      eventRegistrationsStore.length,
      ...INITIAL_EVENT_REGISTRATIONS.map((r) => ({ ...r })),
    );

    writeStore(STORAGE_KEYS.models, modelsStore);
    writeStore(STORAGE_KEYS.clients, clientsStore);
    writeStore(STORAGE_KEYS.projects, projectsStore);
    writeStore(STORAGE_KEYS.testimonials, testimonialsStore);
    writeStore(STORAGE_KEYS.events, eventsStore);
    writeStore(STORAGE_KEYS.eventRegistrations, eventRegistrationsStore);
    writeStore(STORAGE_KEYS.bookings, bookingsStore);
    writeStore(STORAGE_KEYS.applications, applicationsStore);
    writeStore(STORAGE_KEYS.contacts, contactsStore);

    return { status: 200, data: { reset: true } };
  }

  if (upperMethod === 'GET' && path === '/admin/overview') {
    return {
      status: 200,
      data: {
        bookings: [...bookingsStore],
        applications: [...applicationsStore],
        contacts: [...contactsStore],
      },
    };
  }

  return { status: 404, data: { message: `Endpoint not found: ${path}` } };
}
