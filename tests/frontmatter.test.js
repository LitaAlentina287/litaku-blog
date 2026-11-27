import assert from 'node:assert/strict'
import test from 'node:test'
import {
  estimateReadingTime,
  parseFrontmatter,
} from '../src/utils/frontmatter.js'

test('parseFrontmatter extracts metadata, cover fields, and markdown body', () => {
  const input = `---
title: "Belajar React: Bagian 1"
date: "2026-11-27"
summary: "Catatan pengantar komponen dan state."
tags: ["react", "frontend", "react"]
cover: "./images/work.jpg"
coverAlt: "Meja kerja laptop"
coverPosition: "center 70%"
---

Isi **artikel** dimulai di sini.`

  const result = parseFrontmatter(input)

  assert.equal(result.data.title, 'Belajar React: Bagian 1')
  assert.equal(result.data.date, '2026-11-27')
  assert.equal(result.data.summary, 'Catatan pengantar komponen dan state.')
  assert.deepEqual(result.data.tags, ['react', 'frontend'])
  assert.equal(result.data.cover, './images/work.jpg')
  assert.equal(result.data.coverAlt, 'Meja kerja laptop')
  assert.equal(result.data.coverPosition, 'center 70%')
  assert.equal(result.data.listed, true)
  assert.equal(result.data.draft, false)
  assert.equal(result.content, 'Isi **artikel** dimulai di sini.')
})

test('parseFrontmatter supports multi-line YAML lists and CRLF line endings', () => {
  const input =
    '---\r\ntitle: Panduan Vite\r\ndate: 2026-11-20\r\ntags:\r\n  - vite\r\n  - "build tool"\r\nlisted: false\r\ndraft: true\r\n---\r\n\r\nKonten CRLF.'

  const result = parseFrontmatter(input)

  assert.equal(result.data.title, 'Panduan Vite')
  assert.equal(result.data.date, '2026-11-20')
  assert.deepEqual(result.data.tags, ['vite', 'build tool'])
  assert.equal(result.data.listed, false)
  assert.equal(result.data.draft, true)
  assert.equal(result.content, 'Konten CRLF.')
})

test('parseFrontmatter falls back to heading and first paragraph when frontmatter is absent', () => {
  const input = `# Judul Tanpa Frontmatter

Paragraf pembuka dengan [tautan](https://example.com) dan **teks tebal**.`

  const result = parseFrontmatter(input)

  assert.equal(result.data.title, 'Judul Tanpa Frontmatter')
  assert.equal(
    result.data.summary,
    'Paragraf pembuka dengan tautan dan teks tebal.',
  )
  assert.deepEqual(result.data.tags, [])
})

test('estimateReadingTime calculates at least 1 minute and scales by word count', () => {
  assert.equal(estimateReadingTime('Satu dua tiga'), 1)
  const longText = Array.from({ length: 450 }, () => 'kata').join(' ')
  assert.equal(estimateReadingTime(longText), 3)
})
