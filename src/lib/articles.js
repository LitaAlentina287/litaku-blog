import {
  buildArticleList,
  filterArticles,
  formatArticleDate,
  getAllTags,
  resolveArticleAssetUrl,
} from './articleHelpers.js'

const rawArticleFiles = import.meta.glob('/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const rawImageAssets = import.meta.glob(
  '/articles/images/*.{jpg,jpeg,png,webp,gif,svg}',
  {
    query: '?url',
    import: 'default',
    eager: true,
  },
)

const ALL_ARTICLES = buildArticleList(rawArticleFiles, rawImageAssets)
const LISTED_ARTICLES = ALL_ARTICLES.filter(
  (article) => article.listed !== false,
)

/**
 * Return all listed published articles sorted newest first.
 */
export function getAllArticles() {
  return LISTED_ARTICLES
}

/**
 * Find a single article by its slug, or return null if not found.
 */
export function getArticleBySlug(slug) {
  return ALL_ARTICLES.find((article) => article.slug === slug) || null
}

/**
 * Return adjacent listed articles (newer and older) for detail-page navigation.
 */
export function getAdjacentArticles(slug) {
  const index = LISTED_ARTICLES.findIndex((article) => article.slug === slug)
  if (index === -1) return { newer: null, older: null }

  return {
    newer: index > 0 ? LISTED_ARTICLES[index - 1] : null,
    older:
      index < LISTED_ARTICLES.length - 1 ? LISTED_ARTICLES[index + 1] : null,
  }
}

/**
 * Resolve an image path referenced inside Markdown articles.
 */
export function resolveArticleImage(src) {
  return resolveArticleAssetUrl(src, rawImageAssets)
}

/**
 * Return the bundled URL for the author's profile portrait.
 */
export function getProfileImage() {
  return resolveArticleAssetUrl('./images/profile.jpeg', rawImageAssets)
}

export { filterArticles, formatArticleDate, getAllTags }
