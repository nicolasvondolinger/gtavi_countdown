// Canonical site metadata + the single place to manage every outbound link.
//
// Update SITE_URL if you point a custom domain at the project.
export const SITE_URL = 'https://nicolasvondolinger.github.io/gtavi_countdown';

export const SITE_NAME = 'GTA VI Countdown';

// ---------------------------------------------------------------------------
// AFFILIATE / PURCHASE LINK
// The primary money link. Swap this for your own affiliate/referral URL.
// It powers every "Pre-order" CTA across the site.
// ---------------------------------------------------------------------------
export const PRE_ORDER_URL = 'https://link.amazon/B08tRQ2Hj';

// WhatsApp promo group invite — used by the "Join WhatsApp Group" buttons.
export const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/EoCUFcCG8aZ48MsnpYpvsK?s=cl&p=a&ilr=4';

// Official US edition pricing confirmed by Rockstar (June 2026).
export const EDITION_PRICES = {
  standard: '$79.99',
  ultimate: '$99.99',
} as const;

// Release instant (same worldwide). PS5 / Xbox Series X|S.
export const RELEASE_ISO = '2026-11-19T00:00:00Z';

// ---------------------------------------------------------------------------
// LINK HUB — affiliate + invite/community links rendered by <LinkHub />.
//
// `kind` drives the visual treatment:
//   'affiliate' → magenta primary card (your money links)
//   'official'  → neutral card (Rockstar first-party pages)
//   'community' → teal card (follow / invite / join)
//
// Add your own referral or Discord/newsletter invite links here — the UI
// scales automatically. `labelKey` maps to an i18n string (see translations).
// ---------------------------------------------------------------------------
export type LinkKind = 'affiliate' | 'official' | 'community';

export interface SiteLink {
  id: string;
  href: string;
  kind: LinkKind;
  icon: 'cart' | 'store' | 'news' | 'x' | 'youtube' | 'instagram' | 'discord';
  labelKey: string; // key in translations.links
}

export const SITE_LINKS: SiteLink[] = [
  { id: 'preorder', href: PRE_ORDER_URL, kind: 'affiliate', icon: 'cart', labelKey: 'preorder' },
  { id: 'x', href: 'https://x.com/RockstarGames', kind: 'community', icon: 'x', labelKey: 'x' },
  { id: 'youtube', href: 'https://www.youtube.com/@RockstarGames', kind: 'community', icon: 'youtube', labelKey: 'youtube' },
  { id: 'instagram', href: 'https://www.instagram.com/rockstargames', kind: 'community', icon: 'instagram', labelKey: 'instagram' },
];

// ---------------------------------------------------------------------------
// GAME FACTS — structural values for the info grid. Labels are translated
// (see translations.facts); the values below are locale-independent.
// ---------------------------------------------------------------------------
export const GAME_FACTS = {
  releaseValue: 'Nov 19, 2026',
  platformsValue: 'PS5 · Xbox Series X|S',
  studioValue: 'Rockstar Games',
  settingValue: 'Leonida · Vice City',
  enginePlayValue: 'Single-player + Online',
  editionsValue: 'Standard · Ultimate',
} as const;

// ---------------------------------------------------------------------------
// WORLD REGIONS — per-region image galleries opened by <WorldGallery />.
// Order matches translations.locations. images[0] is the grid cover; the full
// list feeds the floating carousel/lightbox. Paths are relative (asset() is
// applied at render). Add more region screenshots to public/media/world/<id>/.
// ---------------------------------------------------------------------------
export interface WorldRegion {
  id: string;
  images: string[];
}

export const WORLD_REGIONS: WorldRegion[] = [
  {
    id: 'vice_city',
    images: [
      'media/world/vice_city.webp',
      'media/world/vice_city/01.webp',
      'media/world/vice_city/02.webp',
      'media/world/vice_city/03.webp',
    ],
  },
  {
    id: 'leonida_keys',
    images: [
      'media/world/leonida_keys.webp',
      'media/world/leonida_keys/01.webp',
      'media/world/leonida_keys/02.webp',
    ],
  },
  { id: 'port_gellhorn', images: ['media/world/port_gellhorn.webp'] },
  { id: 'mount_kalaga', images: ['media/world/mount_kalaga.webp'] },
  {
    id: 'ambrosia',
    images: [
      'media/world/ambrosia.webp',
      'media/world/ambrosia/01.webp',
      'media/world/ambrosia/02.webp',
      'media/world/ambrosia/03.webp',
      'media/world/ambrosia/04.webp',
      'media/world/ambrosia/05.webp',
    ],
  },
  {
    id: 'grassrivers',
    images: [
      'media/world/grassrivers.webp',
      'media/world/grassrivers/01.webp',
      'media/world/grassrivers/02.webp',
      'media/world/grassrivers/03.webp',
      'media/world/grassrivers/04.webp',
    ],
  },
];

// Official trailers (YouTube ids).
export const TRAILERS = [
  { id: 'QdBZY2fkU-0', titleKey: 'trailer1' },
  { id: 'VQRLujxTm3c', titleKey: 'trailer2' },
] as const;
