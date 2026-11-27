import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildArticleList,
  extractSlugFromPath,
  filterArticles,
  formatArticleDate,
  getAllTags,
  resolveArticleAssetUrl,
} from '../src/lib/articleHelpers.js'

const SAMPLE_FILES = {
  '/articles/lama.md': `---
title: "Artikel Lama"
date: "2026-10-01"
summary: "Catatan terdahulu."
tags: ["catatan"]
---
Konten lama.`,
  '/articles/baru.md': `---
title: "Artikel Terbaru"
date: "2026-11-27"
summary: "Membahas Markdown di React."
tags: ["react", "markdown"]
cover: "./images/work.jpg"
coverAlt: "Meja kerja"
---
Konten terbaru.`,
  '/articles/draf.md': `---
title: "Belum Siap"
date: "2026-11-28"
draft: true
---
Masih draf.`,
  '/articles/_template.md': `---
title: "Template"
---
Harus diabaikan.`,
}

const SAMPLE_IMAGES = {
  '/articles/images/work.jpg': '/assets/work-hashed.jpg',
  '/articles/images/profile.jpg': '/assets/profile-hashed.jpg',
}

test('extractSlugFromPath strips directory and .md extension', () => {
  assert.equal(
    extractSlugFromPath('/articles/selamat-datang.md'),
    'selamat-datang',
  )
})

test('resolveArticleAssetUrl maps local article image paths to bundled URLs', () => {
  assert.equal(
    resolveArticleAssetUrl('./images/work.jpg', SAMPLE_IMAGES),
    '/assets/work-hashed.jpg',
  )
  assert.equal(
    resolveArticleAssetUrl('images/profile.jpg', SAMPLE_IMAGES),
    '/assets/profile-hashed.jpg',
  )
  assert.equal(
    resolveArticleAssetUrl('https://example.com/photo.jpg', SAMPLE_IMAGES),
    'https://example.com/photo.jpg',
  )
})

test('buildArticleList excludes drafts/underscored files, resolves covers, and sorts newest first', () => {
  const articles = buildArticleList(SAMPLE_FILES, SAMPLE_IMAGES)

  assert.equal(articles.length, 2)
  assert.equal(articles[0].slug, 'baru')
  assert.equal(articles[0].cover, '/assets/work-hashed.jpg')
  assert.equal(articles[0].coverAlt, 'Meja kerja')
  assert.equal(articles[0].coverPosition, 'center 24%')
  assert.equal(articles[0].listed, true)
  assert.equal(articles[0].readingTime, 1)
  assert.equal(articles[1].slug, 'lama')
})

test('getAllTags aggregates tag counts sorted by frequency', () => {
  const articles = buildArticleList(SAMPLE_FILES, SAMPLE_IMAGES)
  const tags = getAllTags(articles)

  assert.deepEqual(tags, [
    { name: 'catatan', count: 1 },
    { name: 'markdown', count: 1 },
    { name: 'react', count: 1 },
  ])
})

test('filterArticles filters by search query and selected tag case-insensitively', () => {
  const articles = buildArticleList(SAMPLE_FILES, SAMPLE_IMAGES)

  const byQuery = filterArticles(articles, { query: 'MARKDOWN' })
  assert.equal(byQuery.length, 1)
  assert.equal(byQuery[0].slug, 'baru')

  const byTag = filterArticles(articles, { selectedTag: 'Catatan' })
  assert.equal(byTag.length, 1)
  assert.equal(byTag[0].slug, 'lama')

  const byBoth = filterArticles(articles, {
    query: 'markdown',
    selectedTag: 'catatan',
  })
  assert.equal(byBoth.length, 0)
})

test('formatArticleDate formats YYYY-MM-DD in Indonesian locale', () => {
  assert.equal(formatArticleDate('2026-11-27'), '27 November 2026')
  assert.equal(formatArticleDate(''), '')
})
