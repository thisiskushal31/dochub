#!/usr/bin/env node
/**
 * Generate sitemap.xml for Documentation Hub
 * Includes home page and all topic pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read repositories config
const configPath = path.join(__dirname, '..', 'src', 'config', 'repositories.ts');
const configContent = fs.readFileSync(configPath, 'utf-8');

// Extract repository IDs from config
const repoIds = [];
const repoMatch = configContent.match(/export const repositories:\s*RepositoryConfig\[\]\s*=\s*\[([\s\S]*?)\];/);
if (repoMatch) {
  const repoObjects = repoMatch[1].match(/\{[\s\S]*?\}/g) || [];
  for (const repoObj of repoObjects) {
    const idMatch = repoObj.match(/id:\s*['"`]([^'"`]+)['"`]/);
    if (idMatch) {
      repoIds.push(idMatch[1]);
    }
  }
}

const baseUrl = 'https://thisiskushal31.github.io/dochub';
const currentDate = new Date().toISOString().split('T')[0];

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

  // Add topic pages (using hash router, so URLs are like /#/dsa, /#/kubernetes)
  repoIds.forEach(repoId => {
    sitemap += `
  <url>
    <loc>${baseUrl}/#/${repoId}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Generate and write sitemap
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, '..', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

console.log(`✅ Generated sitemap with ${repoIds.length + 1} URLs`);
console.log(`   - Home page: ${baseUrl}/`);
repoIds.forEach(repoId => {
  console.log(`   - Topic: ${baseUrl}/#/${repoId}`);
});

