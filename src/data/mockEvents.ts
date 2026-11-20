import type { AgencyEvent, EventRegistrationRecord } from '../types/index.ts';
import { AGENCY_ASSETS } from './assets.ts';

export const EVENT_CATEGORIES = [
  'Fashion Show',
  'Audition & Casting',
  'Workshop & Masterclass',
  'Designer Showcase',
  'Gala & Networking',
] as const;

export const EVENT_STATUS_LABELS: Record<AgencyEvent['status'], string> = {
  upcoming: 'Upcoming',
  'registration-open': 'Registration Open',
  'sold-out': 'Sold Out',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const MOCK_EVENTS: AgencyEvent[] = [
  {
    id: 'EVT-2026-01',
    slug: 'himalayan-couture-week-winter-2026',
    title: 'Himalayan Couture Week — Winter Edition',
    category: 'Fashion Show',
    status: 'registration-open',
    date: '2026-12-12',
    endDate: '2026-12-13',
    startTime: '18:00 NPT',
    endTime: '21:30 NPT',
    venue: 'Patan Museum Courtyard',
    city: 'Lalitpur',
    summary:
      'Two evenings of architectural Nepalese couture, handloom cashmere, and sculptural eveningwear staged inside the historic brick courtyards of Patan.',
    description:
      'House of Fashion Nepal’s flagship winter runway presentation brings together eight Nepalese ateliers, master weavers from Mustang and Pokhara, and twenty-four represented runway models under dusk architectural lighting. Front-row accreditation is open to buyers, press, creative directors, and registered guests.',
    highlights: [
      '8 Nepalese couture & contemporary heritage ateliers on the stone runway',
      'Live acoustic sarangi and ambient soundscape commissioned for dusk seating',
      'Backstage press preview and designer showroom opening on Day 2',
      '24 House of Fashion Nepal principal and new-face runway models',
    ],
    dressCode: 'Monochrome Tailoring / Contemporary Formal',
    entryType: 'Ticketed',
    ticketPrice: 'NPR 3,500',
    capacity: 220,
    baseRegisteredCount: 168,
    registrationOpen: true,
    featured: true,
    coverImage: AGENCY_ASSETS.EVENT_COUTURE_RUNWAY,
    featuredTalentSlugs: ['aanya-shrestha', 'priya-tamang', 'aarav-gurung', 'kiran-lama'],
  },
  {
    id: 'EVT-2026-02',
    slug: 'nepal-nationwide-model-audition-kathmandu',
    title: 'Kathmandu Valley Open Model Audition & Go-See',
    category: 'Audition & Casting',
    status: 'registration-open',
    date: '2026-12-05',
    startTime: '10:30 NPT',
    endTime: '16:30 NPT',
    venue: 'Jhamsikhel Atelier Wing',
    city: 'Lalitpur',
    summary:
      'Zero-fee open casting call for aspiring editorial, runway, commercial, curve, and fitness models aged 18+ across Nepal.',
    description:
      'Meet House of Fashion Nepal’s Scouting & Representation Directors in person. Candidates receive a natural-light studio polaroid test, basic measurements verification, and a 60-second runway walk review. No prior modeling portfolio or agency experience is required — zero audition fees.',
    highlights: [
      'Zero scouting or registration fees — open to all genders & boards (18+)',
      'Complimentary natural-light studio polaroids captured on site',
      'Walk assessment and constructive direct feedback from scouting directors',
      'Direct fast-track consideration for 2027 Spring/Summer representation boards',
    ],
    dressCode: 'Fitted Monochrome Basics · Minimal Makeup · Clean Footwear',
    entryType: 'Open Audition',
    ticketPrice: 'Free Entry',
    capacity: 120,
    baseRegisteredCount: 84,
    registrationOpen: true,
    featured: true,
    coverImage: AGENCY_ASSETS.EVENT_OPEN_AUDITION,
    featuredTalentSlugs: ['tara-sherpa', 'samir-joshi'],
  },
  {
    id: 'EVT-2026-03',
    slug: 'runway-cadence-posing-masterclass',
    title: 'Runway Cadence, Camera Angles & Posing Intensive',
    category: 'Workshop & Masterclass',
    status: 'registration-open',
    date: '2026-12-18',
    startTime: '13:00 NPT',
    endTime: '17:30 NPT',
    venue: 'House of Fashion Daylight Studio',
    city: 'Kathmandu',
    summary:
      'A focused afternoon clinic led by principal runway coaches and editorial photographers covering walk discipline, micro-angles, and live strobe framing.',
    description:
      'Designed for emerging talent preparing for fashion weeks and commercial bookings, this small-cohort intensive breaks down posture geometry, garment movement for silk and heavy wool, eye-line control on camera, and call-sheet professionalism.',
    highlights: [
      'Live runway walk video breakdown with frame-by-frame coaching',
      'Tethered studio portrait lab with instant angle feedback',
      'Commercial expression range vs. high-fashion stillness drills',
      'Limited to 28 participants to guarantee individual coaching time',
    ],
    dressCode: 'Structured Activewear / Fitted Black & Clean Heels or Boots',
    entryType: 'Ticketed',
    ticketPrice: 'NPR 2,000',
    capacity: 28,
    baseRegisteredCount: 21,
    registrationOpen: true,
    featured: false,
    coverImage: AGENCY_ASSETS.BLOG_RUNWAY_POSING,
    featuredTalentSlugs: ['priya-tamang', 'aanya-shrestha'],
  },
  {
    id: 'EVT-2027-01',
    slug: 'pokhara-lakeside-open-casting-day',
    title: 'Pokhara Open Scouting & Regional Casting Day',
    category: 'Audition & Casting',
    status: 'upcoming',
    date: '2027-01-10',
    startTime: '11:00 NPT',
    endTime: '16:00 NPT',
    venue: 'Temple Tree Heritage Hall, Lakeside',
    city: 'Pokhara',
    summary:
      'Regional scouting tour bringing House of Fashion Nepal’s casting table directly to Gandaki Province talent, photographers, and local brands.',
    description:
      'Part of our nationwide representation initiative outside Kathmandu Valley. Aspiring models from Pokhara, Syangja, Baglung, and Chitwan can audition in person for editorial, commercial, athletic, and hospitality rosters.',
    highlights: [
      'In-person scouting for Gandaki Province & Western Nepal talent',
      'On-site digital measurements and natural daylight casting frames',
      'Dedicated Q&A on ethical modeling contracts and travel support',
      'Special athletic & outdoor lifestyle casting segment with Rohan Magar',
    ],
    dressCode: 'Fitted Plain Tee & Denim / Trousers · Natural Hair',
    entryType: 'Open Audition',
    ticketPrice: 'Free Entry',
    capacity: 90,
    baseRegisteredCount: 37,
    registrationOpen: true,
    featured: false,
    coverImage: AGENCY_ASSETS.AGENCY_STUDIO,
    featuredTalentSlugs: ['rohan-magar', 'aarav-gurung'],
  },
  {
    id: 'EVT-2027-02',
    slug: 'artisanal-loom-resort-2027-designer-salon',
    title: 'Artisanal Loom & Cashmere — Resort 2027 Salon',
    category: 'Designer Showcase',
    status: 'upcoming',
    date: '2027-01-24',
    startTime: '17:30 NPT',
    endTime: '21:00 NPT',
    venue: 'Dwarika’s Heritage Wing',
    city: 'Kathmandu',
    summary:
      'An intimate candlelit preview connecting Nepalese textile designers with regional hospitality buyers, international press, and private collectors.',
    description:
      'Stepping away from conventional stage seating, this gallery-style living presentation places models in slow architectural motion beside tactile installations of Dhaka silk, allo nettle fiber, and high-altitude pashmina.',
    highlights: [
      'Private gallery presentation featuring 5 sustainable Nepalese textile houses',
      'Direct buyer appointments and atelier textile provenance dossiers',
      'Curated Himalayan tea & twilight reception in the heritage courtyard',
      'Press accreditation and private editorial pull scheduling',
    ],
    dressCode: 'Evening Heritage / Understated Black & Sand',
    entryType: 'Invite Only',
    ticketPrice: 'Accredited Guests',
    capacity: 110,
    baseRegisteredCount: 72,
    registrationOpen: true,
    featured: true,
    coverImage: AGENCY_ASSETS.EVENT_DESIGNER_GALA,
    featuredTalentSlugs: ['maya-basnet', 'kiran-lama', 'niyama-shakya'],
  },
  {
    id: 'EVT-2026-00',
    slug: 'house-of-fashion-nepal-annual-gala-2026',
    title: 'House of Fashion Nepal Annual Industry Gala',
    category: 'Gala & Networking',
    status: 'completed',
    date: '2026-10-18',
    startTime: '19:00 NPT',
    endTime: '22:30 NPT',
    venue: 'Hyatt Regency Ballroom, Boudha',
    city: 'Kathmandu',
    summary:
      'Annual gathering celebrating Nepal’s fashion photographers, stylists, makeup artists, partner houses, and breakthrough New Faces of 2026.',
    description:
      'Our Autumn 2026 industry dinner brought together over 180 creative partners across Nepal and South Asia to recognize ethical production leadership, craft excellence, and emerging modeling careers.',
    highlights: [
      '180+ fashion directors, photographers, stylists, and brand partners attended',
      'New Face of the Year recognition and archival lookbook exhibition',
      'Charity textile scholarship auction supporting rural handloom weavers',
    ],
    dressCode: 'Black Tie / Nepalese Couture',
    entryType: 'Invite Only',
    ticketPrice: 'Archive Event',
    capacity: 185,
    baseRegisteredCount: 185,
    registrationOpen: false,
    featured: false,
    coverImage: AGENCY_ASSETS.HERO_ATELIER,
    featuredTalentSlugs: ['aanya-shrestha', 'bina-rai', 'devendra-kc'],
  },
];

export const INITIAL_EVENT_REGISTRATIONS: EventRegistrationRecord[] = [
  {
    id: 'REG-2026-001',
    eventId: 'EVT-2026-01',
    eventTitle: 'Himalayan Couture Week — Winter Edition',
    fullName: 'Ananya Koirala',
    email: 'ananya@himalayanstyle.com.np',
    phone: '+977 9841008822',
    role: 'Press & Media',
    organizationOrInstagram: 'Himalayan Style Quarterly',
    notes: 'Requesting Day 1 front-row editorial press seat and backstage photographer pass.',
    status: 'confirmed',
    adminNotes: 'Press credential #P-14 assigned; backstage access confirmed for 17:15.',
    createdAt: '2026-11-14T11:20:00.000Z',
  },
  {
    id: 'REG-2026-002',
    eventId: 'EVT-2026-02',
    eventTitle: 'Kathmandu Valley Open Model Audition & Go-See',
    fullName: 'Prashant Subedi',
    email: 'prashant.subedi22@gmail.com',
    phone: '+977 9860224491',
    role: 'Aspiring Model (Audition)',
    organizationOrInstagram: '@prashant.sbd',
    notes: 'Height 184 cm, based in Baneshwor. Interested in editorial & runway menswear board.',
    status: 'confirmed',
    adminNotes: 'Morning slot 11:00 AM confirmed.',
    createdAt: '2026-11-16T08:45:00.000Z',
  },
  {
    id: 'REG-2026-003',
    eventId: 'EVT-2026-01',
    eventTitle: 'Himalayan Couture Week — Winter Edition',
    fullName: 'Sujata Rana',
    email: 'sujata@ateliermustang.com.np',
    phone: '+977 9801199330',
    role: 'Designer / Brand',
    organizationOrInstagram: 'Atelier Mustang Cashmere',
    notes: 'Attending with two regional retail buyers from Bangkok.',
    status: 'pending',
    createdAt: '2026-11-18T14:05:00.000Z',
  },
  {
    id: 'REG-2026-004',
    eventId: 'EVT-2026-03',
    eventTitle: 'Runway Cadence, Camera Angles & Posing Intensive',
    fullName: 'Kritika Magar',
    email: 'kritika.m@gmail.com',
    phone: '+977 9818553319',
    role: 'Aspiring Model (Audition)',
    organizationOrInstagram: '@kritika.magar',
    notes: 'Emerging commercial model looking to sharpen runway turn cadence before winter shows.',
    status: 'confirmed',
    adminNotes: 'Tuition verified at studio desk.',
    createdAt: '2026-11-19T09:12:00.000Z',
  },
  {
    id: 'REG-2026-005',
    eventId: 'EVT-2027-02',
    eventTitle: 'Artisanal Loom & Cashmere — Resort 2027 Salon',
    fullName: 'Claire Moreau',
    email: 'cmoreau@atelierorient.fr',
    phone: '+33 6 19 45 20 88',
    role: 'Sponsor / VIP',
    organizationOrInstagram: 'Atelier Orient Paris',
    notes: 'In Kathmandu in late January scouting sustainable handloom capsules.',
    status: 'pending',
    createdAt: '2026-11-19T16:30:00.000Z',
  },
];

export function formatEventDate(dateIso: string, endDateIso?: string): string {
  const start = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(start.getTime())) return dateIso;

  if (endDateIso && endDateIso !== dateIso) {
    const end = new Date(`${endDateIso}T00:00:00`);
    if (!Number.isNaN(end.getTime())) {
      const sameMonth =
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth();
      if (sameMonth) {
        const month = start.toLocaleDateString('en-US', { month: 'short' });
        return `${month} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  }

  return start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getEventDateBadge(dateIso: string): {
  month: string;
  day: string;
  year: string;
} {
  const parsed = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { month: 'TBA', day: '--', year: '' };
  }
  return {
    month: parsed.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: String(parsed.getDate()).padStart(2, '0'),
    year: String(parsed.getFullYear()),
  };
}
