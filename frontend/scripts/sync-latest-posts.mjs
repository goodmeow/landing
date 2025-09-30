#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { XMLParser } from 'fast-xml-parser'

const FEED_URL = process.env.GM_RSS_URL ?? 'https://blog.goodmeow.my.id/rss/'
const MAX_POSTS = Number.parseInt(process.env.GM_RSS_MAX_POSTS ?? '3', 10)
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  preserveOrder: false,
  removeNSPrefix: true,
  processEntities: true,
})

const here = dirname(fileURLToPath(import.meta.url))
const outputDir = join(here, '..', 'src', 'data')
const outputFile = join(outputDir, 'latestPosts.json')

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

const ENTITY_MAP = new Map([
  ['&amp;', '&'],
  ['&lt;', '<'],
  ['&gt;', '>'],
  ['&apos;', "'"],
  ['&#39;', "'"],
  ['&quot;', '"'],
  ['&nbsp;', ' '],
])

function decodeEntities(text = '') {
  return text.replace(/&[a-zA-Z0-9#]+;/g, (match) => ENTITY_MAP.get(match) ?? match)
}

function stripHtml(html = '') {
  return decodeEntities(
    html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
  ).trim()
}

async function fetchFeed(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/rss+xml, application/xml' },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS: ${response.status} ${response.statusText}`)
  }

  return response.text()
}

function normaliseItems(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return [raw]
}

function parseFeed(xml) {
  const parsed = parser.parse(xml)
  const channel = parsed?.rss?.channel
  if (!channel) return []

  const items = normaliseItems(channel.item)
  return items
    .map((item) => {
      const title = decodeEntities(item?.title ?? '')
      const url = item?.link ?? ''
      const pubDate = item?.pubDate ?? ''
      const isoDate = pubDate ? new Date(pubDate).toISOString() : ''
      const description = stripHtml(item?.description ?? '')
      const categories = normaliseItems(item?.category).filter(Boolean)
      const tags = categories
        .map((tag) => (typeof tag === 'string' ? tag : tag?._ ?? ''))
        .map((tag) => decodeEntities(tag))
        .filter(Boolean)

      return {
        title,
        url,
        date: formatDate(pubDate),
        isoDate,
        description,
        tags,
      }
    })
    .filter((post) => post.title && post.url)
    .sort((a, b) => {
      if (!a.isoDate) return 1
      if (!b.isoDate) return -1
      return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
    })
    .slice(0, MAX_POSTS)
}

try {
  const xml = await fetchFeed(FEED_URL)
  const posts = parseFeed(xml)

  await mkdir(outputDir, { recursive: true })
  await writeFile(outputFile, `${JSON.stringify(posts, null, 2)}\n`, 'utf8')

  console.log(`Saved ${posts.length} post(s) to ${outputFile}`)
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
