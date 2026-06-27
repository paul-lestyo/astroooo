import type { APIRoute } from 'astro';
import { getProjects, getBlogPosts } from '../lib/portfolio';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [projects, posts] = await Promise.all([
    getProjects(),
    getBlogPosts()
  ]);

  const siteUrl = 'https://paulus-lestyo.my.id';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/projects</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${projects.map(project => `
  <url>
    <loc>${siteUrl}/projects/${project.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('').trim()}
  ${posts.map(post => `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('').trim()}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
