const RAW_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
const NORMALIZED_BASE_URL = RAW_BASE_URL.endsWith('/')
  ? RAW_BASE_URL
  : `${RAW_BASE_URL}/`;

/**
 * Resolves a file inside `/public` against Vite's configured `BASE_URL`
 * so static assets resolve identically in dev, preview, root deploys, and subpath deploys.
 */
export function publicAsset(relativePath: string): string {
  const clean = relativePath.replace(/^\/+/, '');
  return `${NORMALIZED_BASE_URL}${clean}`;
}

/**
 * Rewrites any legacy `/src/assets/images/...` URLs (for example from cached localStorage)
 * to their production `/public/images/...` location.
 */
export function normalizePublicAssetUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/src/assets/images/')) {
    return publicAsset(url.slice('/src/assets/'.length));
  }
  if (url.includes('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/images/');
  }
  return url;
}

export const AGENCY_ASSETS = {
  HERO_EDITORIAL: publicAsset('images/hero_editorial_kathmandu_1794930705709.jpg'),
  HERO_ATELIER: publicAsset('images/hero_runway_atelier_1794930706414.jpg'),
  AGENCY_STUDIO: publicAsset('images/agency_intro_studio_1794930710898.jpg'),
  CAMPAIGN_MONOLITH: publicAsset('images/campaign_monolith_menswear_1794930715331.jpg'),
  MODEL_AANYA: publicAsset('images/model_aanya_shrestha_1794930706641.jpg'),
  MODEL_AARAV: publicAsset('images/model_aarav_gurung_1794930705870.jpg'),
  MODEL_SANJANA: publicAsset('images/model_sanjana_thapa_1794930707740.jpg'),
  MODEL_KIRAN: publicAsset('images/model_kiran_lama_1794930707749.jpg'),
  MODEL_PRIYA: publicAsset('images/model_priya_tamang_1794930707546.jpg'),
  MODEL_ROHAN: publicAsset('images/model_rohan_magar_1794930707853.jpg'),
  MODEL_NIYAMA: publicAsset('images/model_niyama_shakya_1794930708436.jpg'),
  MODEL_BINA: publicAsset('images/model_bina_rai_1794930708655.jpg'),
  MODEL_DEVENDRA: publicAsset('images/model_devendra_kc_1794930709293.jpg'),
  MODEL_TARA: publicAsset('images/model_tara_sherpa_1794930711312.jpg'),
  MODEL_SAMIR: publicAsset('images/model_samir_joshi_1794930710072.jpg'),
  MODEL_MAYA: publicAsset('images/model_maya_basnet_1794930710163.jpg'),
  BLOG_SKINCARE: publicAsset('images/blog_skincare_ritual_1795105667103.jpg'),
  BLOG_DAILY_ROUTINE: publicAsset('images/blog_daily_routine_1795105546385.jpg'),
  BLOG_RUNWAY_POSING: publicAsset('images/blog_runway_posing_1795105545599.jpg'),
  BLOG_MODEL_KIT: publicAsset('images/blog_model_kit_1795105546814.jpg'),
  EVENT_COUTURE_RUNWAY: publicAsset('images/event_couture_runway_1795183054992.jpg'),
  EVENT_OPEN_AUDITION: publicAsset('images/event_open_audition_1795183005432.jpg'),
  EVENT_DESIGNER_GALA: publicAsset('images/event_designer_gala_1795183012189.jpg'),
} as const;
