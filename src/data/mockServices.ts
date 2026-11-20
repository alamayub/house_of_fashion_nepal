import type { CampaignItem, CategoryItem, ServiceItem, TeamMember } from '../types/index.ts';
import { AGENCY_ASSETS } from './assets.ts';

export const MODEL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-female',
    name: 'Female Models',
    slug: 'Female Models',
    description: 'High-fashion editorial, couture, and contemporary womenswear faces.',
    image: AGENCY_ASSETS.MODEL_AANYA,
    count: 8,
  },
  {
    id: 'cat-male',
    name: 'Male Models',
    slug: 'Male Models',
    description: 'Structured tailoring, modern menswear, and international runway talent.',
    image: AGENCY_ASSETS.MODEL_AARAV,
    count: 5,
  },
  {
    id: 'cat-commercial',
    name: 'Commercial Models',
    slug: 'Commercial Models',
    description: 'Versatile talent for beauty, skincare, hospitality, and regional advertising.',
    image: AGENCY_ASSETS.MODEL_SANJANA,
    count: 6,
  },
  {
    id: 'cat-fashion',
    name: 'Fashion Models',
    slug: 'Fashion Models',
    description: 'Editorial specialists for magazine covers, designer lookbooks, and ateliers.',
    image: AGENCY_ASSETS.MODEL_PRIYA,
    count: 6,
  },
  {
    id: 'cat-fitness',
    name: 'Fitness Models',
    slug: 'Fitness Models',
    description: 'Athletic physiques for technical alpine wear, sportswear, and movement.',
    image: AGENCY_ASSETS.MODEL_ROHAN,
    count: 2,
  },
  {
    id: 'cat-petite',
    name: 'Petite Models',
    slug: 'Petite Models',
    description: 'Expressive beauty, fine jewelry, and close-up campaign specialists.',
    image: AGENCY_ASSETS.MODEL_NIYAMA,
    count: 2,
  },
  {
    id: 'cat-plus',
    name: 'Plus-size Models',
    slug: 'Plus-size Models',
    description: 'Confident curve talent elevating inclusive fashion and luxury outerwear.',
    image: AGENCY_ASSETS.MODEL_BINA,
    count: 2,
  },
  {
    id: 'cat-new',
    name: 'New Faces',
    slug: 'New Faces',
    description: 'Newly scouted talent from every province across Nepal and the Himalayan region.',
    image: AGENCY_ASSETS.MODEL_TARA,
    count: 3,
  },
];

export const AGENCY_SERVICES: ServiceItem[] = [
  {
    id: 'srv-01',
    index: '01',
    title: 'Fashion Modeling',
    subtitle: 'High-Fashion & Atelier Representation',
    description:
      'Dedicated placement for luxury designer collections, seasonal lookbooks, and international apparel houses seeking distinctive Himalayan and South Asian presence.',
    deliverables: ['Seasonal lookbook casting', 'Designer showroom fittings', 'International placement'],
    image: AGENCY_ASSETS.MODEL_AANYA,
  },
  {
    id: 'srv-02',
    index: '02',
    title: 'Commercial Modeling',
    subtitle: 'Advertising & Consumer Campaigns',
    description:
      'Relatable, camera-ready talent curated for television commercials, print billboards, banking, hospitality, and national consumer brand launches.',
    deliverables: ['Print & OOH campaigns', 'TVC & digital film talent', 'Usage rights licensing'],
    image: AGENCY_ASSETS.MODEL_SANJANA,
  },
  {
    id: 'srv-03',
    index: '03',
    title: 'Editorial Modeling',
    subtitle: 'Magazine Spreads & Creative Stories',
    description:
      'Collaborations with independent art directors, stylists, and fashion publications across Nepal, Mumbai, Milan, and Tokyo.',
    deliverables: ['Cover & feature stories', 'Concept testing & styling', 'Artistic visual essays'],
    image: AGENCY_ASSETS.MODEL_KIRAN,
  },
  {
    id: 'srv-04',
    index: '04',
    title: 'Runway Modeling',
    subtitle: 'Fashion Weeks & Private Presentations',
    description:
      'Disciplined runway walkers trained in pacing, posture, and garment presentation for couture shows, bridal showcases, and cultural heritage galas.',
    deliverables: ['Runway choreography support', 'Pre-show fittings', 'Backstage call-time management'],
    image: AGENCY_ASSETS.MODEL_PRIYA,
  },
  {
    id: 'srv-05',
    index: '05',
    title: 'Brand Campaigns',
    subtitle: 'End-to-End Visual Storytelling',
    description:
      'Strategic casting and creative alignment for heritage cashmere makers, sustainable textile studios, and luxury hospitality properties.',
    deliverables: ['Moodboard & face alignment', 'Multi-day location bookings', 'Global campaign usage'],
    image: AGENCY_ASSETS.HERO_ATELIER,
  },
  {
    id: 'srv-06',
    index: '06',
    title: 'Photoshoot Management',
    subtitle: 'Nationwide Nepal & Himalayan Production',
    description:
      'Full on-ground production across Nepal — from Kathmandu Valley and Pokhara to Chitwan, Palpa, and high-altitude Mustang — connecting visiting crews with studios, permits, and stylists.',
    deliverables: ['Location scouting & permits', 'Hair, makeup & styling teams', 'Daylight studio coordination'],
    image: AGENCY_ASSETS.AGENCY_STUDIO,
  },
  {
    id: 'srv-07',
    index: '07',
    title: 'Talent Casting',
    subtitle: 'Custom Briefs & Street Scouting',
    description:
      'Bespoke casting decks tailored to film directors, advertising agencies, and international photographers within 48 hours of brief submission.',
    deliverables: ['Digital casting self-tapes', 'Callback scheduling', 'Bespoke street scouting'],
    image: AGENCY_ASSETS.MODEL_DEVENDRA,
  },
  {
    id: 'srv-08',
    index: '08',
    title: 'Event Modeling',
    subtitle: 'Brand Ambassadorship & Luxury Galas',
    description:
      'Poised, multilingual hosts and brand representatives for diplomatic receptions, watch & jewelry trunk shows, and art gallery openings.',
    deliverables: ['Multilingual talent pairing', 'Private trunk show presence', 'VIP hospitality protocol'],
    image: AGENCY_ASSETS.MODEL_NIYAMA,
  },
  {
    id: 'srv-09',
    index: '09',
    title: 'Influencer Collaborations',
    subtitle: 'Curated Digital Cultural Voices',
    description:
      'Strategic partnerships pairing House of Fashion Nepal’s culturally resonant models and creatives with luxury fragrance, skincare, and travel maisons.',
    deliverables: ['Editorial social storytelling', 'Capsule collection launches', 'Long-term brand residencies'],
    image: AGENCY_ASSETS.MODEL_SAMIR,
  },
];

export const CAMPAIGN_GALLERY: CampaignItem[] = [
  {
    id: 'camp-01',
    title: 'Silence in Cashmere',
    client: 'Atelier Mustang',
    location: 'Kathmandu Studio',
    year: '2026',
    category: 'Autumn / Winter Campaign',
    image: AGENCY_ASSETS.HERO_EDITORIAL,
    span: 'large',
  },
  {
    id: 'camp-02',
    title: 'Monolith Dawn',
    client: 'Kala Menswear',
    location: 'Patan Industrial District',
    year: '2026',
    category: 'Menswear Lookbook',
    image: AGENCY_ASSETS.CAMPAIGN_MONOLITH,
    span: 'wide',
  },
  {
    id: 'camp-03',
    title: 'Raw Silk & Brick',
    client: 'Dhaka Loom Collective',
    location: 'Lalitpur Heritage Atelier',
    year: '2025',
    category: 'Editorial Monograph',
    image: AGENCY_ASSETS.MODEL_MAYA,
    span: 'tall',
  },
  {
    id: 'camp-04',
    title: 'Nocturne Velvet',
    client: 'House of Fashion Nepal Couture Showcase',
    location: 'Durbar Marg, Kathmandu',
    year: '2026',
    category: 'Runway & Eveningwear',
    image: AGENCY_ASSETS.MODEL_PRIYA,
    span: 'standard',
  },
  {
    id: 'camp-05',
    title: 'The Plaster Light',
    client: 'Studio Jhamsikhel',
    location: 'Jhamsikhel, Lalitpur',
    year: '2026',
    category: 'Behind The Frame',
    image: AGENCY_ASSETS.AGENCY_STUDIO,
    span: 'wide',
  },
  {
    id: 'camp-06',
    title: 'Dual Silhouettes',
    client: 'House of Shrestha',
    location: 'Kathmandu Valley',
    year: '2025',
    category: 'Tailoring Campaign',
    image: AGENCY_ASSETS.HERO_ATELIER,
    span: 'standard',
  },
];

export const AGENCY_TEAM: TeamMember[] = [
  {
    id: 'team-01',
    name: 'Ritu Rajbhandari',
    role: 'Founder & Creative Director',
    bio: 'Former fashion editor across South Asia and Europe, Ritu founded House of Fashion Nepal in 2019 to place Himalayan beauty and Nepalese craft on the international stage.',
    image: AGENCY_ASSETS.MODEL_BINA,
  },
  {
    id: 'team-02',
    name: 'Siddhartha Malla',
    role: 'Head of Bookings & Commercial Casting',
    bio: 'Overseeing commercial advertising, film casting, and brand licensing across Nepal, India, and Southeast Asia.',
    image: AGENCY_ASSETS.MODEL_DEVENDRA,
  },
  {
    id: 'team-03',
    name: 'Anjali Gurung',
    role: 'Director of New Faces & Scouting',
    bio: 'Leads nationwide scouting expeditions across Nepal — from Pokhara, Dharan, and Biratnagar to Kathmandu and Butwal — mentoring emerging talent with ethical contracts and portfolio direction.',
    image: AGENCY_ASSETS.MODEL_SANJANA,
  },
];
