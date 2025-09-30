#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const Parser = require('rss-parser');

const FEED_URL = process.env.GHOST_FEED_URL || 'https://blog.goodmeow.my.id/rss/';
const POSTS_LIMIT = Number(process.env.LATEST_POSTS_LIMIT || 3);
const TARGET_FILE = path.join(__dirname, '..', 'index.html');
const BLOCK_START = '<!-- latest-posts:start -->';
const BLOCK_END = '<!-- latest-posts:end -->';

function escapeHTML(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(str = '') {
  return escapeHTML(str).replace(/`/g, '&#96;');
}

function truncate(text, maxLen) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen - 1).trim()}…`;
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
}

function buildCards(items, indent) {
  return items.map((item) => {
    const innerIndent = `${indent}  `;
    const contentIndent = `${innerIndent}  `;
    const url = item.link || '#';
    const title = escapeHTML(item.title || 'Untitled post');
    const published = formatDate(item.isoDate || item.pubDate);
    const summary = truncate(item.contentSnippet || '', 180) || 'Read the full story on the blog.';
    const tagList = Array.isArray(item.categories) ? item.categories.filter(Boolean).slice(0, 3) : [];
    const tagsHTML = tagList.length
      ? `${contentIndent}<div class="tags">${tagList.map((tag) => `<span>${escapeHTML(tag)}</span>`).join('')}</div>`
      : `${contentIndent}<div class="tags"><span>Blog</span></div>`;

    return [
      `${indent}<article class="card">`,
      `${innerIndent}<div class="card-body">`,
      `${contentIndent}<h3><a href="${escapeAttribute(url)}" rel="noopener noreferrer">${title}</a></h3>`,
      published ? `${contentIndent}<p class="muted">${published}</p>` : `${contentIndent}<p class="muted">&nbsp;</p>`,
      `${contentIndent}<p>${escapeHTML(summary)}</p>`,
      tagsHTML,
      `${innerIndent}</div>`,
      `${indent}</article>`
    ].join('\n');
  }).join('\n');
}

async function fetchLatestPosts() {
  const parser = new Parser({ timeout: 10000 });
  const feed = await parser.parseURL(FEED_URL);
  const items = Array.isArray(feed.items) ? feed.items.filter(Boolean) : [];
  if (!items.length) {
    throw new Error('No posts returned from feed');
  }
  return items.slice(0, POSTS_LIMIT);
}

async function updateIndex(posts) {
  const html = await fs.readFile(TARGET_FILE, 'utf8');
  const startIdx = html.indexOf(BLOCK_START);
  const endIdx = html.indexOf(BLOCK_END, startIdx);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error('Could not locate latest posts block in index.html');
  }

  const preStartNewline = html.lastIndexOf('\n', startIdx);
  const indent = preStartNewline === -1 ? '' : html.slice(preStartNewline + 1, startIdx);

  const blockStartIdx = startIdx - indent.length;
  const afterEnd = endIdx + BLOCK_END.length;
  const before = html.slice(0, blockStartIdx);
  const after = html.slice(afterEnd);

  const cards = buildCards(posts, indent);
  const replacement = `${indent}${BLOCK_START}\n${cards}\n${indent}${BLOCK_END}`;
  const updated = `${before}${replacement}${after}`;
  await fs.writeFile(TARGET_FILE, updated);
}

(async function main() {
  try {
    const posts = await fetchLatestPosts();
    await updateIndex(posts);
    console.log(`Updated latest posts with ${posts.length} entries from ${FEED_URL}`);
  } catch (err) {
    console.error('Failed to update latest posts:', err.message);
    process.exitCode = 1;
  }
})();
