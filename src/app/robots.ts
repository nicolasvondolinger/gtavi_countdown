import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/search', '/signin', '/signup', '/onboarding', '/me', '/pt/search', '/pt/signin', '/pt/signup', '/pt/onboarding', '/pt/me'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
