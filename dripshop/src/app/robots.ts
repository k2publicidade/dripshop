import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
 return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/conta', '/api'] }, sitemap: 'https://www.dripshop.com.br/sitemap.xml' };
}
