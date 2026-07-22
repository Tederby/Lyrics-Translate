# Terjemahan Lirik — Lyrics Translation

Situs terjemahan lirik lagu Jepang (Vocaloid & J-Pop) ke Bahasa Indonesia, dengan opsi terjemahan English dan Romaji.

Dibangun dengan Next.js (App Router), konten disimpan sebagai file Markdown di repo — bisa langsung dibaca/di-share via GitHub.

## Fitur

- **Multi-bahasa** — Toggle antara Indonesia, English, Romaji, dan Original (原文)
- **Side-by-side mode** — Bandingkan dua bahasa secara berdampingan
- **Search** — Cari berdasarkan judul, judul asli, atau artis
- **Tags** — Filter lagu berdasarkan tag (vocaloid, j-pop, ballad, dll.)
- **Markdown-based** — Semua lirik tersimpan sebagai `.md` file, readable langsung di GitHub
- **Static Site** — Di-generate saat build time, no database, no CMS

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Content**: Markdown + YAML frontmatter (`gray-matter`)
- **Rendering**: Static Site Generation (SSG) via `generateStaticParams`
- **Deploy**: Vercel

## Struktur Konten

Lirik disimpan di folder `lyrics/` dengan struktur:

```
lyrics/
  Artist_Name/
    Album_Name/              ← opsional, hanya jika lagu punya album
      Song_Title/
        indonesia.md         ← wajib ada
        english.md           ← opsional
        romaji.md            ← opsional
        original.md          ← opsional (lirik Jepang asli)
    Song_Title_Tanpa_Album/
      indonesia.md
      ...
```

### Format File Markdown

```markdown
---
title: "Judul Lagu"
title_original: "曲のタイトル"
artist: "Nama Artis"
album: "Nama Album"
vocalist: "Hatsune Miku"
producer: "Nama Producer"
release_date: "2024-01-01"
translator_note: "Terjemahan bebas, bukan literal"
tags: ["vocaloid", "melankolis", "hatsune-miku"]
source_url: "https://youtube.com/..."
translated_date: "2026-07-22"
---

Isi lirik di sini, plain markdown, line break dipertahankan.
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Development

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build

```bash
npm run build
```

## Menambah Terjemahan Baru

1. Buat folder di `lyrics/Nama_Artis/Judul_Lagu/` (atau `lyrics/Nama_Artis/Nama_Album/Judul_Lagu/` jika ada album)
2. Tambah `indonesia.md` (minimal) dengan YAML frontmatter
3. Opsional: tambah `english.md`, `romaji.md`, `original.md`
4. Push ke GitHub → Vercel rebuild otomatis

## Routes

| Route | Deskripsi |
|---|---|
| `/` | Homepage — daftar semua lagu, search filter |
| `/[artist]` | Halaman artis — semua lagu dari artis tertentu |
| `/[artist]/[song]` | Detail lagu (tanpa album) |
| `/[artist]/[album]/[song]` | Detail lagu (dengan album) |
| `/tags` | Daftar semua tag |
| `/tags/[tag]` | Lagu-lagu dengan tag tertentu |
| `/artists` | Daftar semua artis |
| `/about` | Tentang situs ini |

## Disclaimer

Semua lirik asli, musik, dan karya seni adalah milik artis, produser, dan pemegang hak cipta masing-masing. Terjemahan di sini bersifat personal dan non-komersial, dibuat untuk tujuan apresiasi budaya dan edukasi.
