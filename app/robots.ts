import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
     
      // Add disallow rules here if there are specific paths that should not be crawled
      // e.g., disallow: '/admin/',
    },
    sitemap: 'https://ani-box-nine.vercel.app/sitemap.xml',
  };
}
