// Resolves a public asset path against the configured basePath.
//
// next.config sets basePath to "/gtavi_countdown" only in production (GitHub
// Pages) and "" in development. Hardcoding the prefix made every <img> 404 in
// `next dev`; this helper produces the correct URL in both environments.
export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/gtavi_countdown' : '';

export const asset = (path: string): string => `${BASE_PATH}/${path.replace(/^\/+/, '')}`;
