export type AvailabilityStatus = 'available' | 'booked' | 'unavailable';

export type ModelStatus = 'active' | 'inactive' | 'on-hold' | 'banned' | 'left';

export type ExperienceLevel = 'New Face' | 'Emerging' | 'Established' | 'Principal';

export type AgeGroup = '18-22' | '23-27' | '28+';

export type SortOption =
  | 'featured'
  | 'newest'
  | 'height_asc'
  | 'height_desc'
  | 'name_asc';

export interface ModelVideo {
  id: string;
  title: string;
  type: 'youtube' | 'vimeo' | 'upload';
  url: string;
  category?: string;
  duration?: string;
  poster?: string;
}

export interface Model {
  id: string;
  slug: string;
  name: string;
  gender: string;
  category: string[];
  location: string;
  height: number;
  weight?: number;
  bust?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoeSize?: string;
  eyeColor?: string;
  hairColor?: string;
  skinTone?: string;
  bodyType?: string;
  dressSize?: string;
  nationality?: string;
  ageGroup: AgeGroup;
  experience: string;
  experienceLevel: ExperienceLevel;
  languages: string[];
  availability: AvailabilityStatus;
  status: ModelStatus;
  featured: boolean;
  bio: string;
  coverImage: string;
  gallery: string[];
  videos?: ModelVideo[];
  joinedYear: number;
}

export type CreateModelPayload = Omit<
  Model,
  'id' | 'slug' | 'joinedYear' | 'status'
> & {
  id?: string;
  slug?: string;
  joinedYear?: number;
  status?: ModelStatus;
};

export type UpdateModelPayload = Partial<Model> & { id: string };

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
}

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  image: string;
}

export interface CampaignItem {
  id: string;
  title: string;
  client: string;
  location: string;
  year: string;
  category: string;
  image: string;
  span: 'large' | 'tall' | 'wide' | 'standard';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface ModelsQueryParams {
  search?: string;
  gender?: string;
  category?: string;
  heightMin?: number;
  heightMax?: number;
  ageGroup?: string;
  bodyType?: string;
  experienceLevel?: string;
  availability?: string;
  status?: string;
  includeAllStatuses?: boolean;
  location?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface PaginatedModelsResponse {
  data: Model[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  availableFilters: {
    genders: string[];
    categories: string[];
    bodyTypes: string[];
    experienceLevels: string[];
    locations: string[];
  };
}

export interface BookingPayload {
  clientName: string;
  companyName?: string;
  email: string;
  phone: string;
  modelSlug?: string;
  modelName?: string;
  modelSlugs?: string[];
  modelNames?: string[];
  requestedGender?: string;
  projectType: string;
  shootDate: string;
  location: string;
  details: string;
}

export interface BookingRecord extends BookingPayload {
  id: string;
  status: 'pending' | 'reviewing' | 'confirmed';
  adminNotes?: string;
  createdAt: string;
}

export interface ApplicationPayload {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  gender: string;
  category: string;
  height: number;
  weight?: number;
  experience: string;
  instagram?: string;
  portfolioUrl?: string;
  introduction: string;
  profilePhotoName: string;
  portfolioPhotoNames: string[];
  consentAccepted: boolean;
}

export interface ApplicationRecord extends ApplicationPayload {
  id: string;
  status: 'new' | 'shortlisted' | 'onboarded' | 'archived';
  adminNotes?: string;
  createdAt: string;
}

export interface ContactPayload {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactRecord extends ContactPayload {
  id: string;
  status: 'new' | 'in-progress' | 'resolved';
  adminNotes?: string;
  createdAt: string;
}

export type ProjectCategory =
  | 'Brand Campaign'
  | 'Editorial'
  | 'Runway'
  | 'Commercial TVC'
  | 'Lookbook';

export interface ClientPartner {
  id: string;
  slug: string;
  name: string;
  industry: string;
  location: string;
  yearSince: number;
  description: string;
  featured: boolean;
}

export interface CastTalentSummary {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
}

export interface AgencyProject {
  id: string;
  slug: string;
  title: string;
  clientId: string;
  clientName: string;
  category: ProjectCategory;
  location: string;
  year: string;
  season?: string;
  summary: string;
  deliverables: string[];
  talentSlugs: string[];
  cast?: CastTalentSummary[];
  coverImage: string;
  gallery: string[];
  featured: boolean;
}

export interface ProjectsQueryParams {
  category?: string;
  clientId?: string;
  search?: string;
  talentSlug?: string;
  featured?: boolean;
}

export type CreateClientPayload = Omit<ClientPartner, 'id' | 'slug'>;

export type CreateProjectPayload = Omit<AgencyProject, 'id' | 'slug' | 'clientName' | 'cast'>;

export type TestimonialPerspective = 'client' | 'model';

export interface Testimonial {
  id: string;
  perspective: TestimonialPerspective;
  quote: string;
  authorName: string;
  authorRole: string;
  organizationOrBoard: string;
  location: string;
  projectOrCampaign?: string;
  relatedSlug?: string;
  avatarImage?: string;
  year: string;
  featured: boolean;
}

export interface TestimonialsQueryParams {
  perspective?: TestimonialPerspective | 'All';
  featured?: boolean;
}

export type CreateTestimonialPayload = Omit<Testimonial, 'id'>;

export type UpdateClientPayload = Partial<Omit<ClientPartner, 'id'>> & { id: string };

export type UpdateProjectPayload = Partial<Omit<AgencyProject, 'id' | 'cast'>> & {
  id: string;
};

export type UpdateTestimonialPayload = Partial<Omit<Testimonial, 'id'>> & { id: string };

export type UpdateBookingPayload = Partial<Omit<BookingRecord, 'id' | 'createdAt'>> & {
  id: string;
};

export type UpdateApplicationPayload = Partial<
  Omit<ApplicationRecord, 'id' | 'createdAt'>
> & { id: string };

export type UpdateContactPayload = Partial<Omit<ContactRecord, 'id' | 'createdAt'>> & {
  id: string;
};

export type BlogCategory =
  | 'Fashion & Styling'
  | 'Skincare & Beauty'
  | 'Daily Routine'
  | 'Runway & Posing'
  | 'Fitness & Nutrition'
  | 'Casting & Career'
  | 'On-Set & Travel';

export interface BlogSection {
  id: string;
  heading: string;
  paragraphs: string[];
  checklist?: string[];
  studioNote?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: BlogCategory;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  featured: boolean;
  tags: string[];
  keyTakeaways: string[];
  sections: BlogSection[];
}

export type EventCategory =
  | 'Fashion Show'
  | 'Audition & Casting'
  | 'Workshop & Masterclass'
  | 'Designer Showcase'
  | 'Gala & Networking';

export type EventStatus =
  | 'upcoming'
  | 'registration-open'
  | 'sold-out'
  | 'completed'
  | 'cancelled';

export type EventEntryType =
  | 'Free RSVP'
  | 'Open Audition'
  | 'Invite Only'
  | 'Ticketed';

export type EventRegistrationRole =
  | 'Attendee / Guest'
  | 'Aspiring Model (Audition)'
  | 'Designer / Brand'
  | 'Press & Media'
  | 'Sponsor / VIP';

export type EventRegistrationStatus =
  | 'pending'
  | 'confirmed'
  | 'waitlisted'
  | 'cancelled';

export interface AgencyEvent {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  status: EventStatus;
  date: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  venue: string;
  city: string;
  summary: string;
  description: string;
  highlights: string[];
  dressCode?: string;
  entryType: EventEntryType;
  ticketPrice?: string;
  capacity: number;
  baseRegisteredCount: number;
  registeredCount?: number;
  registrationOpen: boolean;
  featured: boolean;
  coverImage: string;
  featuredTalentSlugs: string[];
  featuredTalent?: CastTalentSummary[];
}

export interface EventsQueryParams {
  category?: string;
  status?: string;
  city?: string;
  timeframe?: 'All' | 'upcoming' | 'past';
  search?: string;
  featured?: boolean;
}

export type CreateEventPayload = Omit<
  AgencyEvent,
  'id' | 'slug' | 'registeredCount' | 'featuredTalent'
> & {
  slug?: string;
};

export type UpdateEventPayload = Partial<
  Omit<AgencyEvent, 'id' | 'registeredCount' | 'featuredTalent'>
> & {
  id: string;
};

export interface EventRegistrationPayload {
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  role: EventRegistrationRole;
  organizationOrInstagram?: string;
  notes?: string;
}

export interface EventRegistrationRecord extends EventRegistrationPayload {
  id: string;
  eventTitle: string;
  status: EventRegistrationStatus;
  adminNotes?: string;
  createdAt: string;
}

export type UpdateEventRegistrationPayload = Partial<
  Omit<EventRegistrationRecord, 'id' | 'eventId' | 'createdAt'>
> & {
  id: string;
};
