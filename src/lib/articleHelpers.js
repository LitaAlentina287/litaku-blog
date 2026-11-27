import {
  estimateReadingTime,
  parseFrontmatter,
} from '../utils/frontmatter.js'

const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/
const EXTERNAL_URL_REGEX = /^(https?:|data:|blob:)/i

/**
 * Derive a URL-safe slug from a markdown file path.
 */
export function extractSlugFromPath(filePath) {
  const fileName = filePath.split('/').pop() || ''
  return fileName.replace(/\.md$/i, '')
}

/**
 * Resolve a local article image reference (e.g. ./images/profile.jpg) against
 * Vite-bundled asset URLs inside /articles/images/.
 */
export function resolveArticleAssetUrl(assetPath, imageAssetsMap = {}) {
  if (!assetPath || typeof assetPath !== 'string') return ''

  const cleaned = assetPath.trim()
  if (!cleaned) return ''
  if (EXTERNAL_URL_REGEX.test(cleaned)) return cleaned

  const normalized = cleaned.replace(/^\.\//, '').replace(/^\/+/, '')
  const fileName = normalized.split('/').pop()

  const candidates = [
    cleaned,
    `/${normalized}`,
    `/articles/${normalized}`,
    fileName ? `/articles/images/${fileName}` : '',
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (candidate in imageAssetsMap) {
      return imageAssetsMap[candidate]
    }
  }

  return cleaned
}

/**
 * Convert a date string into a UTC timestamp for consistent sorting.
 */
function toTimestamp(dateStr) {
  if (!dateStr) return Number.NEGATIVE_INFINITY

  const dateOnlyMatch = dateStr.match(DATE_ONLY_REGEX)
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch
    return Date.UTC(Number(year), Number(month) - 1, Number(day))
  }

  const parsed = Date.parse(dateStr)
  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed
}

/**
 * Build, filter out drafts, and sort articles newest-first from raw file entries.
 */
export function buildArticleList(rawFilesMap, imageAssetsMap = {}) {
  const articles = []

  for (const [filePath, rawContent] of Object.entries(rawFilesMap || {})) {
    const fileName = filePath.split('/').pop() || ''
    if (!fileName || fileName.startsWith('_')) continue

    const { data, content } = parseFrontmatter(rawContent)
    if (data.draft) continue

    const fallbackSlug = extractSlugFromPath(filePath)
    const slug = data.slug || fallbackSlug
    const title = data.title || fallbackSlug.replace(/-/g, ' ')

    articles.push({
      slug,
      title,
      date: data.date,
      summary: data.summary,
      tags: data.tags,
      cover: resolveArticleAssetUrl(data.cover, imageAssetsMap),
      coverAlt: data.coverAlt || title,
      coverPosition: data.coverPosition || 'center 24%',
      listed: data.listed !== false,
      readingTime: estimateReadingTime(content),
      content,
    })
  }

  articles.sort((a, b) => {
    const diff = toTimestamp(b.date) - toTimestamp(a.date)
    if (diff !== 0) return diff
    return a.title.localeCompare(b.title, 'id')
  })

  return articles
}

/**
 * Collect unique tags with article counts, sorted by frequency then name.
 */
export function getAllTags(articles) {
  const tagMap = new Map()

  for (const article of articles) {
    for (const tag of article.tags || []) {
      const key = tag.toLowerCase()
      const existing = tagMap.get(key)
      if (existing) {
        existing.count += 1
      } else {
        tagMap.set(key, { name: tag, count: 1 })
      }
    }
  }

  return Array.from(tagMap.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.name.localeCompare(b.name, 'id')
  })
}

/**
 * Filter articles by search query (title, summary, tags) and selected tag.
 */
export function filterArticles(articles, { query = '', selectedTag = '' } = {}) {
  const normalizedQuery = query.trim().toLowerCase()
  const normalizedTag = selectedTag.trim().toLowerCase()

  return articles.filter((article) => {
    if (normalizedTag) {
      const hasTag = (article.tags || []).some(
        (tag) => tag.toLowerCase() === normalizedTag,
      )
      if (!hasTag) return false
    }

    if (!normalizedQuery) return true

    const haystack = [
      article.title,
      article.summary,
      ...(article.tags || []),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  })
}

/**
 * Format an article ISO date string into readable Indonesian date format.
 */
export function formatArticleDate(dateStr) {
  if (!dateStr) return ''

  const dateOnlyMatch = dateStr.match(DATE_ONLY_REGEX)
  const date = dateOnlyMatch
    ? new Date(
        Date.UTC(
          Number(dateOnlyMatch[1]),
          Number(dateOnlyMatch[2]) - 1,
          Number(dateOnlyMatch[3]),
        ),
      )
    : new Date(dateStr)

  if (Number.isNaN(date.getTime())) return dateStr

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
