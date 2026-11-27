---
title: "Mengapa 78% Pekerjaan IT Butuh Menulis: Menerapkan BLUF & 5C di Dokumentasi Proyek dan Git"
date: "2026-11-21"
summary: "Refleksi nyata mempraktikkan materi Bab 7 tentang komunikasi tertulis profesional, mulai dari arsitektur BLUF, lima pilar 5C, hingga penulisan README, pesan commit Git, dan Minute of Meeting."
tags: ["learning-in-public", "komunikasi-teknis", "git", "teknik-informatika"]
cover: "./images/cover-komunikasi-git.jpg"
coverAlt: "Ilustrasi alur Git branching, README proyek, dan checklist komunikasi teknis"
coverPosition: "center center"
---

Di perkuliahan Bab 7 kelas **TFK 23B** (Universitas Teknologi Bandung), ada satu fakta yang langsung mengubah cara pandang saya sebagai mahasiswa Teknik Informatika: **sekitar 78% komunikasi di dunia perangkat lunak dan TI dilakukan secara tertulis** lewat email, tiket Jira, *pull request* GitHub, chat tim, hingga dokumentasi sistem.

Selama ini saya sering mengira kemampuan utama anak IT cukup di bagian menulis kode. Padahal, tanpa komunikasi tertulis yang jernih, pesan singkat yang ambigu di grup kerja kelompok atau repositori GitHub tanpa `README` yang jelas justru memperlambat kolaborasi satu tim.

## Babak 1: Memahami Arsitektur BLUF dan Lima Pilar 5C

Materi Bab 7 memperkenalkan dua konsep praktis yang langsung saya praktikkan di proyek blog ini maupun komunikasi kuliah sehari-hari:

1. **BLUF (*Bottom Line Up Front*):** Letakkan inti kesimpulan, status kritis, atau permintaan tindakan di paragraf pertama agar pembaca yang memindai teks dengan cepat langsung menangkap maksud utama tanpa basa-basi.
2. **Lima Pilar 5C:**
   - **Clear:** bermakna tunggal tanpa tafsir ganda.
   - **Concise:** ringkas, langsung ke pokok persoalan.
   - **Concrete:** didukung fakta terukur, log error, atau data nyata.
   - **Correct:** memakai ejaan baku dan istilah teknis yang tepat.
   - **Courteous:** tetap sopan serta menjaga empati pembaca.

## Babak 2: Perbandingan Pesan Biasa vs Pendekatan BLUF + 5C

Saat mengerjakan tugas kelompok atau melaporkan kendala ke dosen maupun rekan tim, perbedaan antara pesan yang asal kirim dan pesan terstruktur sangat terasa. Berikut perbandingan nyata yang saya rangkum:

| Situasi | Contoh Kurang Efektif | Contoh dengan BLUF + 5C |
| :--- | :--- | :--- |
| **Meminta rekan membuat slide tugas** | *"Tolong buatin PPT presentasi kita ya, nanti kabari kalau udah."* | *"Mohon bantuannya menyusun 8 slide presentasi Bab 7 (bagian contoh BLUF). Deadline Kamis, 27 Nov pukul 19.00 WIB agar sempat kita review bersama."* |
| **Melaporkan bug gambar di proyek** | *"Pak/Teman, fotonya error tidak muncul di web, kenapa ya?"* | *"Foto profil gagal tampil saat build karena file diletakkan di `dist/assets/` dan masih berekstensi `.jpg`. Solusi: pindahkan foto ke `articles/images/` dan perbarui `getProfileImage()` menjadi `profile.jpeg`."* |
| **Mengirim lampiran tugas** | Mengirim file `WhatsApp Image 01.pdf` tanpa judul & pengantar | Memberi nama `Laporan-Bab7-Lita-TFK23B.pdf` disertai salam, ringkasan isi 2 kalimat, dan penutup sopan |

Dari contoh di atas terlihat jelas bahwa menyertakan **tindakan yang diminta** dan **tenggat waktu (*deadline*)** membuat rekan tim lebih mudah mengatur prioritas mereka.

## Babak 3: Menerapkan 5C ke Pesan Commit Git & `README.md`

Prinsip komunikasi tertulis ini ternyata sangat nyambung ketika diterapkan ke alat kerja developer seperti **Git** dan file **`README.md`**. Alih-alih menulis pesan commit singkat yang membingungkan seperti `fix bug` atau `update`, saya mulai membiasakan format commit yang jelas dan terstruktur:

```bash
git add articles/ src/ README.md
git commit -m "feat(blog): tambah artikel storytelling dan perbaiki blok kode"
```

Ketika dilihat kembali lewat perintah riwayat commit, alur pengerjaan proyek menjadi rapi dan mudah dipahami dosen maupun rekan tim:

```output
a1b2c3d feat(blog): tambah artikel storytelling dan perbaiki blok kode
9f8e7d6 fix(images): pindah aset foto ke articles/images dan atur framing CSS
4c3b2a1 docs(readme): lengkapi panduan instalasi dan cara menjalankan proyek
```

Begitu pula saat menyusun `README.md` di proyek **LitaKu** ini. Karena repositori GitHub akan di-clone dan dijalankan langsung oleh dosen, bagian paling penting diletakkan dengan jelas mulai dari prasyarat Node.js hingga perintah terminal yang langsung bisa disalin:

```powershell
npm install
npm run dev
```

## Babak 4: Mengingat Etika Data & *Minute of Meeting* (MoM)

Satu poin penting lain dari perkuliahan Bab 7 adalah **kesadaran kerahasiaan data** serta kebiasaan menulis **Minute of Meeting (MoM)**. Saat membagikan cerita proyek atau kendala teknis di blog publik (*learning in public*), saya belajar untuk tidak pernah mengunggah kredensial, API key, atau source code sensitif milik klien atau perusahaan. Cukup tampilkan kode proyek pribadi atau contoh terisolasi yang aman.

Sementara untuk kerja tim di kampus, membiasakan mencatat ringkasan rapat (masalah yang dibahas, keputusan, penanggung jawab, dan tenggat tanggal) mencegah miskomunikasi dan tugas yang molor.

### Checklist Komunikasi Teknis Sebelum Mengirim / Push

- [x] Inti pesan atau tujuan utama sudah berada di bagian paling atas (**BLUF**)
- [x] Menyertakan data konkret (versi tool, pesan error, atau output terminal)
- [x] Memberikan tenggat waktu yang jelas jika meminta tindakan rekan tim
- [x] Memastikan tidak ada password, token, atau data sensitif di dalam artikel atau kode
- [x] Menyebutkan sumber referensi atau model AI secara jujur

> "Tulisan yang jernih adalah cerminan dari pikiran yang jernih; ketertiban dokumentasi sering kali mencerminkan kerapian logika di balik kode yang kita tulis."

## Referensi

- **Materi Perkuliahan Bab 7 (Kelas TFK 23B, Universitas Teknologi Bandung):** Komunikasi tertulis TI (statistik 78%, BLUF, 5C, struktur email profesional, MoM, serta etika kerahasiaan data)
- **Conventional Commits Specification:** Konvensi penulisan pesan commit Git yang terstruktur ([conventionalcommits.org](https://www.conventionalcommits.org))
