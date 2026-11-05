import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

// Picks the language from the saved choice, then the browser's Accept-Language.
export default createMiddleware(routing);

export const config = { matcher: '/((?!api|_next|_vercel|media|.*\\..*).*)' };
