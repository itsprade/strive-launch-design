// Design tokens and application constants

export const ROUTES = {
  HOME: '/',
  CAMPAIGNS: '/campaigns',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  CHAT: '/chat',
} as const;

export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const;

export const SPACING = {
  XS: '0.25rem',
  SM: '0.5rem',
  MD: '1rem',
  LG: '1.5rem',
  XL: '2rem',
  '2XL': '3rem',
} as const;
