---
title: "Belajar Menulis Parser YAML Frontmatter di JavaScript: Dari Bug CRLF hingga Unit Test"
date: "2026-11-23"
summary: "Cerita pengalaman nyata menulis parser metadata Markdown sendiri di JavaScript, membandingkan parser ringan vs library eksternal, mengatasi jebakan line ending Windows (CRLF), dan mengujinya dengan node:test."
tags: ["javascript", "unit-testing", "markdown", "teknik-informatika"]
cover: "./images/cover-parser-js.jpg"
coverAlt: "Ilustrasi proses parsing dokumen Markdown dan YAML frontmatter menjadi JSON terstruktur dengan unit test"
coverPosition: "center center"
---

Saat membangun blog berbasis file Markdown, tantangan teknis pertama yang saya hadapi adalah membaca blok metadata (*frontmatter*) di bagian atas setiap file `.md`. Daripada langsung memasang library pihak ketiga yang berat, saya memutuskan mencoba menulis parser-nya sendiri di `src/utils/frontmatter.js` menggunakan JavaScript murni dan mengujinya dengan `node --test` bawaan Node.js.

Hasilnya, aplikasi tetap ringan tanpa dependensi tambahan dan saya justru belajar banyak hal fundamental tentang *regular expression* (RegExp), perbedaan format baris Windows dan Linux (`CRLF` vs `LF`), serta pentingnya *unit testing* sebelum kode dipakai di halaman utama.

## Babak 1: Memilih Antara Library Eksternal vs Parser Sendiri

Sebelum mulai menulis kode, saya membandingkan dua pendekatan yang paling umum dipakai untuk membaca frontmatter YAML di proyek JavaScript:

| Pendekatan | Kelebihan | Kekurangan | Keputusan |
| :--- | :--- | :--- | :--- |
| **Library `gray-matter` / `front-matter`** | Mendukung spesifikasi YAML kompleks & nested object | Menambah dependensi & ukuran bundle browser (butuh polyfill `Buffer`) | Terlalu besar untuk kebutuhan metadata blog sederhana |
| **Parser JavaScript Ringan (`frontmatter.js`)** | Nol dependensi eksternal, berjalan murni di browser & Node.js | Hanya mendukung key-value, boolean, dan daftar tag sederhana | **Dipilih:** cocok untuk skema blog ini & melatih logika string/RegExp |

Karena metadata blog **LitaKu** hanya membutuhkan `title`, `date`, `summary`, `tags`, `cover`, `coverAlt`, `coverPosition`, `listed`, dan `draft`, menulis parser ringan sendiri menjadi pilihan yang paling masuk akal.

## Babak 2: Jebakan Pertama pada Line Ending Windows (`CRLF`) & BOM

Saat menulis baris kode pertama di `src/utils/frontmatter.js`, saya awalnya mengira memisahkan blok batas frontmatter cukup memakai `\n`. Ternyata, di sistem operasi Windows, file teks sering tersimpan dengan akhir baris `\r\n` (**CRLF**), bahkan kadang diawali karakter tersembunyi **UTF-8 BOM** (`\uFEFF`).

Akibatnya, file `.md` yang diedit di editor Windows sempat gagal terdeteksi blok frontmatter-nya. Solusinya adalah mengantisipasi karakter `\uFEFF?` dan `\r?\n` langsung di pola RegExp:

```js
const FRONTMATTER_REGEX = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
const EMPTY_FRONTMATTER_REGEX = /^\uFEFF?---\r?\n---(?:\r?\n|$)/
```

Selain itu, saya juga menangani tiga skenario tipe data di fungsi `parseValue()`: nilai boolean (`true` / `false`), array inline seperti `["react", "vite"]`, serta pembersihan tanda kutip tunggal maupun ganda:

```js
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
```

## Babak 3: Input, Proses, dan Output Nyata

Untuk memastikan parser bekerja konsisten, mari lihat bagaimana sebuah blok Markdown mentah diubah menjadi objek terstruktur.

**Input teks Markdown:**

```yaml
---
title: "Belajar React: Bagian 1"
date: "2026-11-27"
tags: ["react", "frontend", "react"]
listed: true
draft: false
---

Isi **artikel** dimulai di sini.
```

**Output objek JavaScript dari `parseFrontmatter()`:**

```json
{
  "data": {
    "title": "Belajar React: Bagian 1",
    "date": "2026-11-27",
    "summary": "Isi artikel dimulai di sini.",
    "tags": ["react", "frontend"],
    "listed": true,
    "draft": false
  },
  "content": "Isi **artikel** dimulai di sini."
}
```

Perhatikan dua detail kecil yang langsung tertangani:
1. Tag duplikat (`"react"` yang muncul dua kali) otomatis dibersihkan oleh `normalizeTags()` tanpa membedakan huruf besar atau kecil.
2. Karena `summary` tidak ditulis di frontmatter, fungsi `extractFallbackSummary()` otomatis mengambil paragraf pembuka dan membersihkan tanda Markdown (`**`) agar ringkasan kartu artikel tetap rapi.

## Babak 4: Menguji Edge Case dengan `node --test`

Pengalaman paling berharga saat mengerjakan modul ini adalah membiasakan diri menulis *unit test* menggunakan modul bawaan Node.js (`node:test` dan `node:assert/strict`) di `tests/frontmatter.test.js`:

```js
test('parseFrontmatter supports multi-line YAML lists and CRLF line endings', () => {
  const input =
    '---\r\ntitle: Panduan Vite\r\ndate: 2026-11-20\r\ntags:\r\n  - vite\r\n  - "build tool"\r\nlisted: false\r\ndraft: true\r\n---\r\n\r\nKonten CRLF.'

  const result = parseFrontmatter(input)

  assert.equal(result.data.title, 'Panduan Vite')
  assert.deepEqual(result.data.tags, ['vite', 'build tool'])
  assert.equal(result.data.listed, false)
  assert.equal(result.data.draft, true)
})
```

Saat dijalankan dengan perintah `npm test`, seluruh kasus uji (termasuk kondisi CRLF dan artikel tanpa frontmatter) berhasil lulus dalam hitungan milidetik:

```output
✔ parseFrontmatter extracts metadata, cover fields, and markdown body (4.13ms)
✔ parseFrontmatter supports multi-line YAML lists and CRLF line endings (1.03ms)
✔ parseFrontmatter falls back to heading and first paragraph when frontmatter is absent (0.58ms)
✔ estimateReadingTime calculates at least 1 minute and scales by word count (1.52ms)
```

> "Kode yang baru terasa berjalan di satu kasus belum tentu aman. Justru saat menulis unit test untuk CRLF, tag duplikat, dan input kosong, celah bug kecil paling cepat terlihat."

## Ringkasan Pelajaran Teknis

- **Jangan meremehkan karakter newline (`\r\n` vs `\n`):** bug lintas sistem operasi sangat sering muncul di pemrosesan teks.
- **Sediakan fallback yang aman:** jika judul atau ringkasan lupa ditulis di frontmatter, halaman blog tidak rusak karena sudah ada `extractFallbackTitle()` dan `extractFallbackSummary()`.
- **Manfaatkan fitur bawaan runtime:** `node:test` di Node.js modern memungkinkan kita membuat automated test cepat tanpa perlu memasang test framework besar.

## Referensi

- **MDN Web Docs (Regular Expressions):** [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
- **Node.js Documentation (Test Runner `node:test`):** [nodejs.org/api/test.html](https://nodejs.org/api/test.html)
