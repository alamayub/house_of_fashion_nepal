export type SocialPlatformId = 'facebook' | 'instagram' | 'youtube' | 'x';

export interface SocialChannel {
  id: SocialPlatformId;
  name: string;
  handle: string;
  url: string;
  ariaLabel: string;
}

export const AGENCY_SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    handle: '@houseoffashionnepal',
    url: 'https://www.facebook.com/houseoffashionnepal',
    ariaLabel: 'Follow House of Fashion Nepal on Facebook',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@houseoffashionnepal',
    url: 'https://www.instagram.com/houseoffashionnepal',
    ariaLabel: 'Follow House of Fashion Nepal on Instagram',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@houseoffashionnepal',
    url: 'https://www.youtube.com/@houseoffashionnepal',
    ariaLabel: 'Subscribe to House of Fashion Nepal on YouTube',
  },
  {
    id: 'x',
    name: 'X',
    handle: '@houseoffashionnepal',
    url: 'https://x.com/houseoffashionnepal',
    ariaLabel: 'Follow House of Fashion Nepal on X',
  },
];
