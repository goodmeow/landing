#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'sitemap.config.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'sitemap.xml');
const ISO_DATE = new Date().toISOString().slice(0, 10);

function normaliseUrl(base, loc = '/') {
  if (!loc) return base;
  if (/^https?:\/\//i.test(loc)) {
    return loc;
  }
  const trimmedBase = base.replace(/\/+$/, '');
  const prefixedLoc = loc.startsWith('/') ? loc : `/${loc}`;
  return `${trimmedBase}${prefixedLoc}`;
}

function buildUrlEntry(base, entry = {}) {
  const loc = normaliseUrl(base, entry.loc);
  const lastmod = entry.lastmod || ISO_DATE;
  const changefreq = entry.changefreq || undefined;
  const priority = typeof entry.priority === 'number' ? entry.priority : undefined;

  const lines = [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`
  ];

  if (changefreq) {
    lines.push(`    <changefreq>${changefreq}</changefreq>`);
  }
  if (priority !== undefined) {
    lines.push(`    <priority>${priority}</priority>`);
  }

  lines.push('  </url>');
  return lines.join('\n');
}

async function main() {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(raw);
    const baseUrl = config.siteUrl || 'https://www.goodmeow.my.id';
    const urls = Array.isArray(config.urls) && config.urls.length ? config.urls : [{ loc: '/' }];

    const entries = urls.map((entry) => buildUrlEntry(baseUrl, entry));
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      entries.join('\n'),
      '</urlset>',
      ''
    ].join('\n');

    await fs.writeFile(OUTPUT_PATH, `${xml}\n`);
    console.log(`Generated sitemap.xml with ${entries.length} entries.`);
  } catch (error) {
    console.error('Failed to generate sitemap:', error.message);
    process.exitCode = 1;
  }
}

main();
