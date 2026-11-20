import { AGENCY_ASSETS } from './assets.ts';

export interface EditorialDispatch {
  id: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  location: string;
  ctaLabel: string;
  ctaTo: string;
}

export interface AgencyMilestone {
  year: string;
  title: string;
  location: string;
  description: string;
}

export interface ProductionLocation {
  id: string;
  index: string;
  name: string;
  region: string;
  elevation: string;
  lightingProfile: string;
  bestFor: string;
  image: string;
}

export interface CharterPillar {
  index: string;
  title: string;
  summary: string;
}

export interface BookingTier {
  id: string;
  code: string;
  name: string;
  duration: string;
  usageScope: string;
  idealFor: string;
  includes: string[];
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface BoardStandard {
  board: string;
  heightGuide: string;
  focus: string;
}

export interface ScoutingStep {
  step: string;
  title: string;
  timeline: string;
  description: string;
}

export interface StudioSpec {
  label: string;
  value: string;
  detail: string;
}

export interface DepartmentDesk {
  department: string;
  lead: string;
  email: string;
  responseWindow: string;
  scope: string;
}

export const EDITORIAL_DISPATCHES: EditorialDispatch[] = [
  {
    id: 'dsp-01',
    tag: 'Casting Bulletin',
    date: 'Autumn / Winter 2026',
    title: 'Nationwide Cashmere & Handloom Lookbook Call',
    excerpt:
      'Booking multi-model ensembles for three Nepalese heritage atelier campaigns shooting across daylight studios, Palpa looms, and heritage courtyards.',
    location: 'Across Nepal',
    ctaLabel: 'Book Ensemble Talent',
    ctaTo: '/book',
  },
  {
    id: 'dsp-02',
    tag: 'Production Unit',
    date: 'Q4 Expedition Window',
    title: 'High-Altitude Alpine & Mustang Location Coordination',
    excerpt:
      'On-ground production support, altitude-acclimatized athletic models, and location permits now open for visiting international crews.',
    location: 'Pokhara & Upper Mustang',
    ctaLabel: 'Explore Production Services',
    ctaTo: '/services',
  },
  {
    id: 'dsp-03',
    tag: 'Scouting Desk',
    date: 'Rolling Review',
    title: 'Nationwide New Faces Scouting: Pokhara, Dharan & Lalitpur',
    excerpt:
      'Fresh talent aged 18+ may submit natural window-light digitals year-round with zero scouting fees or compulsory portfolio packages.',
    location: 'All Provinces, Nepal',
    ctaLabel: 'Submit Application',
    ctaTo: '/become-a-model',
  },
  {
    id: 'dsp-04',
    tag: 'Archive Monograph',
    date: 'New Release',
    title: '8 Commissioned Brand Dossiers Added to Client Index',
    excerpt:
      'Inspect complete cast credits, deliverables, and visual plates from Atelier Mustang, Kala Menswear, and Dhaka Loom Collective.',
    location: 'Digital Archive',
    ctaLabel: 'Inspect Projects',
    ctaTo: '/projects',
  },
];

export const AGENCY_MILESTONES: AgencyMilestone[] = [
  {
    year: '2019',
    title: 'Founding in Lalitpur',
    location: 'Jhamsikhel, Kathmandu Valley',
    description:
      'Established by former fashion editor Ritu Rajbhandari to replace informal word-of-mouth casting with structured contracts and editorial mentorship.',
  },
  {
    year: '2021',
    title: 'First Regional & European Placements',
    location: 'Kathmandu · Mumbai · Milan',
    description:
      'Placed principal Nepalese models into heritage wool lookbooks, regional TVCs, and international showroom presentations with full territorial usage licensing.',
  },
  {
    year: '2023',
    title: 'Consent & Transparent Rate Charter',
    location: 'Agency-Wide Policy',
    description:
      'Formalized House of Fashion Nepal’s privacy-first measurement policy, minimum 18+ verification, zero applicant fee rule, and 14-day guaranteed talent settlement.',
  },
  {
    year: '2025',
    title: 'National Scouting & Curve Expansion',
    location: 'Pokhara · Dharan · Butwal',
    description:
      'Expanded representation across Petite, Curve, Fitness, and Non-Binary boards to serve global outdoor brands and regional beauty campaigns.',
  },
  {
    year: '2026',
    title: 'Jhamsikhel Daylight Studio Wing',
    location: 'Ward 3, Lalitpur',
    description:
      'Opened a dedicated lime-plaster daylight casting studio, wardrobe fitting room, and digital showreel archive for domestic and visiting creative teams.',
  },
];

export const PRODUCTION_LOCATIONS: ProductionLocation[] = [
  {
    id: 'loc-studio',
    index: '01',
    name: 'Jhamsikhel Daylight Studio',
    region: 'Lalitpur, Kathmandu Valley',
    elevation: '1,350 m',
    lightingProfile: 'North-facing diffused skylight · Raw lime-plaster & teak',
    bestFor: 'Minimalist lookbooks, skin-close beauty, digitals & test shoots',
    image: AGENCY_ASSETS.AGENCY_STUDIO,
  },
  {
    id: 'loc-patan',
    index: '02',
    name: 'Patan & Bhaktapur Heritage Bricks',
    region: 'Durbar Squares & Medieval Courtyards',
    elevation: '1,360 m',
    lightingProfile: 'Warm terracotta bounce light · Deep architectural shadow',
    bestFor: 'Heritage couture, handloom textile monographs & fine jewelry',
    image: AGENCY_ASSETS.MODEL_MAYA,
  },
  {
    id: 'loc-pokhara',
    index: '03',
    name: 'Sarangkot & Mardi Alpine Ridge',
    region: 'Kaski District, Gandaki',
    elevation: '1,600–3,200 m',
    lightingProfile: 'Crisp blue-hour dawn · Mist-draped mountain horizon',
    bestFor: 'Performance outerwear, technical trail gear & hospitality films',
    image: AGENCY_ASSETS.MODEL_ROHAN,
  },
  {
    id: 'loc-mustang',
    index: '04',
    name: 'Upper Mustang High-Altitude Plateau',
    region: 'Lo Manthang Corridor',
    elevation: '3,800 m',
    lightingProfile: 'Unfiltered zenith sun · Ochre sandstone cliffs',
    bestFor: 'Cashmere global campaigns, sculptural menswear & cinema anthems',
    image: AGENCY_ASSETS.CAMPAIGN_MONOLITH,
  },
];

export const ETHICAL_CHARTER: CharterPillar[] = [
  {
    index: '01',
    title: 'Zero Applicant Fees',
    summary:
      'We never charge aspiring models for open casting reviews, agency representation interviews, or entry onto our boards.',
  },
  {
    index: '02',
    title: 'Consent-Controlled Specs',
    summary:
      'Every measurement on public model cards is published solely with explicit written talent consent and reviewed annually.',
  },
  {
    index: '03',
    title: 'Clear Usage Boundaries',
    summary:
      'Client licensing agreements explicitly separate Nepal domestic print, digital lookbook, broadcast TVC, and international buyouts.',
  },
  {
    index: '04',
    title: 'On-Set Safety & Chaperoning',
    summary:
      'Written call sheets, private changing facilities, overtime caps, and dedicated booker support apply to every studio and mountain location.',
  },
];

export const BOOKING_RATE_TIERS: BookingTier[] = [
  {
    id: 'tier-editorial',
    code: 'TIER 01',
    name: 'Editorial & Lookbook Day',
    duration: 'Half-Day (4h) or Full-Day (8h)',
    usageScope: 'Digital lookbook, magazine print & organic social',
    idealFor: 'Independent designers, knitwear labels, gallery monographs',
    includes: [
      'Curated shortlist within 24h',
      'Pre-shoot fitting coordination',
      '12-month digital showroom rights',
    ],
  },
  {
    id: 'tier-commercial',
    code: 'TIER 02',
    name: 'Commercial & Broadcast Campaign',
    duration: 'Full-Day Call (8–10h)',
    usageScope: 'Paid OOH billboards, retail POS, digital ads & TVC',
    idealFor: 'Skincare houses, luxury hospitality, banking & consumer brands',
    includes: [
      'Self-tape auditions & callbacks',
      'Territorial & 1–2 year buyout structuring',
      'Dedicated on-set agency liaison',
    ],
  },
  {
    id: 'tier-runway',
    code: 'TIER 03',
    name: 'Runway & Couture Presentation',
    duration: 'Fitting + Rehearsal + Show Day',
    usageScope: 'Live runway capture, press stills & recap reels',
    idealFor: 'Fashion weeks, bridal salons, private showroom trunk shows',
    includes: [
      'Multi-model ensemble casting',
      'Runway pacing & backstage call sheets',
      'Wardrobe fitting check-ins',
    ],
  },
  {
    id: 'tier-expedition',
    code: 'TIER 04',
    name: 'Multi-Day Location Expedition',
    duration: '2–7 Days Out-of-Valley',
    usageScope: 'Global campaign buyout + documentary stills',
    idealFor: 'Visiting international crews, alpine gear & resort films',
    includes: [
      'Altitude-ready talent & travel insurance',
      'Location permits & styling crew pairing',
      'Transport, lodging & per-diem scheduling',
    ],
  },
];

export const PRODUCTION_FAQS: FaqEntry[] = [
  {
    id: 'faq-prod-1',
    question: 'How quickly can House of Fashion Nepal provide talent availability and rate quotes?',
    answer:
      'Once you submit a brief via our Book a Model form or email bookings@houseoffashionnepal.com.np, our Nepal bookings desk replies within 24 business hours with confirmed availability, custom casting links, and transparent day-rate plus usage estimates.',
  },
  {
    id: 'faq-prod-2',
    question: 'Can we book multiple models or request casting by gender board?',
    answer:
      'Yes. In the booking form you can select one or multiple specific models directly from our roster, filter by Female, Male, Non-Binary, or Mixed Ensemble boards, or leave specific models unselected so our directors assemble a bespoke shortlist.',
  },
  {
    id: 'faq-prod-3',
    question: 'What is the difference between a First Option Hold and a Confirmed Booking?',
    answer:
      'A First Option provisionally reserves a model’s shoot window without fee while you finalize production dates. If another client requests the same date, you receive 24 hours to confirm in writing or release the hold. Confirmed bookings lock the date via signed call sheet and booking order.',
  },
  {
    id: 'faq-prod-4',
    question: 'Do your day rates include billboard, TVC, or international usage rights?',
    answer:
      'Standard shoot day fees cover model time on set and limited portfolio/editorial use. Paid advertising — including OOH billboards, regional/global digital ads, packaging, and broadcast TVCs — carries a clear usage fee scaled by territory and duration (6 months, 1 year, or 2 years).',
  },
  {
    id: 'faq-prod-5',
    question: 'Can House of Fashion Nepal arrange styling, hair/makeup, and studios for visiting foreign crews?',
    answer:
      'Yes. Through our Photoshoot Management division, we pair visiting photographers and producers with hair and makeup artists, textile stylists, daylight studios, and heritage, Terai, or alpine location permits anywhere in Nepal.',
  },
];

export const BOARD_STANDARDS: BoardStandard[] = [
  {
    board: 'Fashion & Runway',
    heightGuide: 'Women 170 cm+ · Men 180 cm+',
    focus: 'Editorial magazines, couture houses, seasonal lookbooks, fashion week runways.',
  },
  {
    board: 'Commercial & Beauty',
    heightGuide: 'All heights welcomed',
    focus: 'Skin-close apothecary films, hospitality campaigns, retail POS, TV commercials.',
  },
  {
    board: 'Curve & Inclusive',
    heightGuide: 'Confident proportions · Natural presence',
    focus: 'Luxury outerwear, contemporary womenswear, inclusive regional & global campaigns.',
  },
  {
    board: 'Athletic & Alpine',
    heightGuide: 'High-stamina & outdoors readiness',
    focus: 'Mountaineering apparel, sportswear lookbooks, multi-day altitude shoots.',
  },
];

export const SCOUTING_ROADMAP: ScoutingStep[] = [
  {
    step: '01',
    title: 'Digital Snapshot Review',
    timeline: 'Within 7–10 Days',
    description:
      'Our scouting directors personally inspect every applicant’s natural-light headshot and full-length digitals — no algorithmic filtering.',
  },
  {
    step: '02',
    title: 'Studio Go-See & Walk Check',
    timeline: 'Lalitpur or Video Call',
    description:
      'Shortlisted applicants are invited to our Jhamsikhel studio (or a live video call for out-of-valley talent) to meet directors and review board fit.',
  },
  {
    step: '03',
    title: 'Development & Test Shoot',
    timeline: 'Weeks 2–4',
    description:
      'Signed New Faces receive camera movement coaching, contract walkthroughs, and curated test shoots to establish an international-grade comp card.',
  },
  {
    step: '04',
    title: 'Direct Client Introductions',
    timeline: 'Active Roster Launch',
    description:
      'Your portfolio goes live on House of Fashion Nepal’s directory and is pitched directly to domestic designers, commercial agencies, and international partners.',
  },
];

export const SCOUTING_FAQS: FaqEntry[] = [
  {
    id: 'faq-scout-1',
    question: 'Does it cost anything to apply or sign with House of Fashion Nepal?',
    answer:
      'Never. House of Fashion Nepal charges zero application fees, zero interview fees, and zero upfront signing fees. Beware of anyone claiming to represent House of Fashion Nepal and requesting payment for scouting or compulsory portfolios.',
  },
  {
    id: 'faq-scout-2',
    question: 'Do I need professional studio photos before applying?',
    answer:
      'No — in fact, we prefer unedited smartphone snapshots taken in natural window light against a plain wall, wearing simple fitted basics and minimal or no makeup.',
  },
  {
    id: 'faq-scout-3',
    question: 'Can I apply if I live outside Kathmandu Valley (Pokhara, Dharan, Butwal, etc.)?',
    answer:
      'Yes. We actively represent talent across Gandaki, Koshi, Lumbini, and Madhesh provinces. Initial interviews can be conducted by video call, and regional travel is coordinated around confirmed client bookings.',
  },
  {
    id: 'faq-scout-4',
    question: 'What is the minimum age to submit an application?',
    answer:
      'Applicants must be at least 18 years old at the time of submission. Date of birth is verified privately during onboarding and is never published publicly.',
  },
];

export const STUDIO_SPECS: StudioSpec[] = [
  {
    label: 'Daylight Wing',
    value: '1,400 sq ft',
    detail: 'North-facing diffused skylight with movable lime-plaster and raw oak flats.',
  },
  {
    label: 'Casting & Audition Suite',
    value: '4K Tethered',
    detail: 'Dedicated self-tape rig, color-calibrated monitor, and silent client lounge.',
  },
  {
    label: 'Wardrobe & Fitting Prep',
    value: 'Private Suite',
    detail: 'Dual steamers, daylight vanity mirrors, racks for 80+ garments, espresso bar.',
  },
  {
    label: 'Location Radius',
    value: '15–45 mins',
    detail: 'Direct access to Patan Durbar heritage bricks, Chobhar gorges, and Nagarkot.',
  },
];

export const DEPARTMENT_DESKS: DepartmentDesk[] = [
  {
    department: 'Commercial & Editorial Bookings',
    lead: 'Siddhartha Malla',
    email: 'bookings@houseoffashionnepal.com.np',
    responseWindow: 'Within 24 business hours',
    scope: 'Option holds, rate cards, ensemble casting, call sheets, and usage licensing.',
  },
  {
    department: 'New Faces & Regional Scouting',
    lead: 'Anjali Gurung',
    email: 'scouting@houseoffashionnepal.com.np',
    responseWindow: '7–10 business days',
    scope: 'Open applications, go-sees, university & regional scouting walks.',
  },
  {
    department: 'Production, Press & Partnerships',
    lead: 'Ritu Rajbhandari',
    email: 'press@houseoffashionnepal.com.np',
    responseWindow: 'Within 48 hours',
    scope: 'Visiting international crews, location permits, fashion publications, syndication.',
  },
];
