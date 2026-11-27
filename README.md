# LitaKu: Blog Learning in Public Mahasiswa Teknik Informatika

Proyek blog pribadi yang dibuat oleh **Lita Alentina** (Mahasiswa Semester 7 Teknik Informatika, Kelas TFK 23B, Universitas Teknologi Bandung) untuk mendokumentasikan proses belajar teknologi pemrograman serta menerapkan komunikasi tertulis profesional (*learning in public*).

## Teknologi yang Digunakan

- **React 19** & **React Router DOM 7**: Antarmuka komponen dan navigasi halaman artikel
- **Vite 8**: Development server (HMR), asset bundling (`import.meta.glob`), dan build produksi
- **Tailwind CSS v4**: Styling responsif serta dukungan tema Light & Dark (`data-theme`)
- **react-markdown** & **remark-gfm**: Rendering artikel Markdown lengkap dengan tabel, checklist, dan blok kode
- **Oxlint** & **Node Test (`node --test`)**: Pengecekan lint dan pengujian unit parser dan tema

## Fitur Utama

- Halaman beranda dengan header publikasi penulis, kartu artikel utama (*featured*), pencarian kata kunci, dan filter tag
- Halaman detail artikel dengan *reading progress bar*, blok kode berlabel bahasa & output, navigasi antar artikel, serta boks penulis
- Artikel ditulis dalam format Markdown + YAML *frontmatter* di folder `articles/`
- Mode terang dan gelap (Light/Dark mode) yang tersimpan di `localStorage`

## Struktur Proyek

```text
├── articles/                  # Artikel Markdown (*.md) dan gambar (articles/images/)
├── public/                    # Aset statis publik (favicon.svg)
├── src/
│   ├── components/            # Komponen UI (AuthorHero, ArticleCard, Layout, dll.)
│   ├── lib/                   # Loader artikel, helper filter/format tanggal, & tema
│   ├── pages/                 # Halaman HomePage, ArticlePage, NotFoundPage
│   └── utils/                 # Parser YAML frontmatter & estimasi waktu baca
├── tests/                     # Unit test (node --test)
├── index.html
├── package.json
└── vite.config.js
```

## Cara Menjalankan Aplikasi

Pastikan **Node.js** (disarankan versi 20+) dan **npm** sudah terpasang di komputer Anda.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan server development:**
   ```bash
   npm run dev
   ```
   Buka URL lokal yang tampil di terminal (umumnya `http://localhost:5173`).

3. **Perintah tambahan:**
   ```bash
   npm test        # Menjalankan 15 unit test (node --test tests/*.test.js)
   npm run lint    # Memeriksa kualitas kode dengan Oxlint
   npm run build   # Membuat build produksi ke folder dist/
   npm run preview # Menjalankan preview hasil build dari folder dist/
   ```
