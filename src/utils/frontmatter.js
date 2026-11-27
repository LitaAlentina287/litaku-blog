const FRONTMATTER_REGEX = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
const EMPTY_FRONTMATTER_REGEX = /^\uFEFF?---\r?\n---(?:\r?\n|$)/

/**
 * Remove matching single or double quotes around a scalar YAML value.
 */
function unquote(value) {
  const trimmed = value.trim()
  if (trimmed.length >= 2) {
    const first = trimmed[0]
    const last = trimmed[trimmed.length - 1]
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      const inner = trimmed.slice(1, -1)
      return first === '"'
        ? inner.replace(/\\"/g, '"')
        : inner.replace(/''/g, "'")
    }
  }
  return trimmed
}

/**
 * Parse a single YAML scalar or inline array value.
 */
function parseValue(rawValue) {
  const trimmed = rawValue.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim()
    if (!inner) return []
    return inner
      .split(',')
      .map((item) => unquote(item))
      .filter(Boolean)
  }

  return unquote(trimmed)
}

/**
 * Parse simple YAML frontmatter key/value pairs and list items.
 */
function parseYamlBlock(yamlBlock) {
  const data = {}
  let currentListKey = null

  for (const rawLine of yamlBlock.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const listMatch = rawLine.match(/^\s*-\s+(.*)$/)
    if (listMatch && currentListKey) {
      if (!Array.isArray(data[currentListKey])) {
        data[currentListKey] = []
      }
      const item = unquote(listMatch[1])
      if (item) data[currentListKey].push(item)
      continue
    }

    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) {
      currentListKey = null
      continue
    }

    const key = line.slice(0, colonIndex).trim()
    const rawValue = line.slice(colonIndex + 1).trim()

    if (!key) {
      currentListKey = null
      continue
    }

    if (rawValue === '') {
      data[key] = []
      currentListKey = key
    } else {
      data[key] = parseValue(rawValue)
      currentListKey = null
    }
  }

  return data
}

/**
 * Normalize tags into a deduplicated array of trimmed strings.
 */
function normalizeTags(rawTags) {
  const list = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === 'string'
      ? rawTags.split(',')
      : []

  const seen = new Set()
  const result = []

  for (const tag of list) {
    const cleaned = String(tag).trim()
    if (!cleaned) continue
    const lowered = cleaned.toLowerCase()
    if (!seen.has(lowered)) {
      seen.add(lowered)
      result.push(cleaned)
    }
  }

  return result
}

/**
 * Extract the first H1 heading from markdown body as a fallback title.
 */
export function extractFallbackTitle(markdownBody) {
  const match = markdownBody.match(/^\s*#\s+(.+)$/m)
  return match ? match[1].trim() : ''
}

/**
 * Extract a plain-text excerpt from the first non-heading paragraph.
 */
export function extractFallbackSummary(markdownBody, maxLength = 160) {
  const cleaned = markdownBody
    .replace(/```[\s\S]*?```/g, '')
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .find(
      (block) =>
        block &&
        !block.startsWith('#') &&
        !block.startsWith('>') &&
        !block.startsWith('!['),
    )

  if (!cleaned) return ''

  const plain = cleaned
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (plain.length <= maxLength) return plain
  return `${plain.slice(0, maxLength - 1).trimEnd()}…`
}

/**
 * Estimate reading time in whole minutes (~200 words/min) for markdown content.
 */
export function estimateReadingTime(markdownBody) {
  if (!markdownBody || typeof markdownBody !== 'string') return 1

  const plain = markdownBody
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~|-]/g, ' ')
    .trim()

  if (!plain) return 1
  const wordCount = plain.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

/**
 * Parse YAML frontmatter and Markdown content from a raw Markdown file string.
 */
export function parseFrontmatter(rawContent) {
  const source = typeof rawContent === 'string' ? rawContent : ''
  let rawData = {}
  let content = source.replace(/^\uFEFF/, '')

  if (EMPTY_FRONTMATTER_REGEX.test(content)) {
    content = content.replace(EMPTY_FRONTMATTER_REGEX, '')
  } else {
    const match = content.match(FRONTMATTER_REGEX)
    if (match) {
      rawData = parseYamlBlock(match[1])
      content = content.slice(match[0].length)
    }
  }

  const normalizedContent = content.trim()
  const title =
    typeof rawData.title === 'string' && rawData.title.trim()
      ? rawData.title.trim()
      : extractFallbackTitle(normalizedContent)

  const summary =
    typeof rawData.summary === 'string' && rawData.summary.trim()
      ? rawData.summary.trim()
      : extractFallbackSummary(normalizedContent)

  const rawCover =
    typeof rawData.cover === 'string'
      ? rawData.cover.trim()
      : typeof rawData.coverImage === 'string'
        ? rawData.coverImage.trim()
        : ''

  return {
    data: {
      title,
      date: typeof rawData.date === 'string' ? rawData.date.trim() : '',
      summary,
      tags: normalizeTags(rawData.tags),
      slug: typeof rawData.slug === 'string' ? rawData.slug.trim() : '',
      cover: rawCover,
      coverAlt:
        typeof rawData.coverAlt === 'string' ? rawData.coverAlt.trim() : '',
      coverPosition:
        typeof rawData.coverPosition === 'string'
          ? rawData.coverPosition.trim()
          : '',
      listed: rawData.listed !== false,
      draft: rawData.draft === true,
    },
    content: normalizedContent,
  }
}
