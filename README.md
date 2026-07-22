# Terjemahan Lirik — Lyrics Translation

Situs terjemahan lirik lagu Jepang (Vocaloid & J-Pop) — mendukung multi-bahasa, termasuk Indonesia, English, Romaji, dan bahasa lainnya.

Dibangun dengan Next.js (App Router), konten disimpan sebagai file Markdown di repo — bisa langsung dibaca/di-share via GitHub.

## Fitur

- **Multi-bahasa fleksibel** — Sistem bahasa dinamis; setiap file `.md` di folder lagu otomatis terdeteksi sebagai bahasa baru (bukan hanya 4 bahasa hardcoded)
- **Side-by-side mode** — Bandingkan dua bahasa secara berdampingan dengan tampilan yang lebih luas
- **Dropdown language selector** — Pilih bahasa via dropdown menu (mendukung jumlah bahasa tak terbatas)
- **Fuzzy search** — Cari berdasarkan judul, artis, vocalist, producer, tag, bahkan isi lirik — tidak harus exact match
- **YouTube embed** — Video YouTube otomatis di-embed langsung di halaman lagu
- **Markdown rendering** — Lirik dirender sebagai markdown terformat (bold, italic, dll.)
- **Furigana support** — Syntax `{漢字|ふりがな}` untuk menampilkan reading di atas kanji
- **Tags** — Filter lagu berdasarkan tag (vocaloid, j-pop, ballad, dll.)
- **Copy lyrics** — Copy lirik ke clipboard dengan satu klik
- **Keyboard shortcuts** — `1–9` untuk ganti bahasa, `S` untuk toggle side-by-side
- **Language badges** — Badge bahasa tersedia di setiap card lagu di homepage
- **Stats counter** — Statistik total lagu, artis, dan tag di homepage
- **Markdown-based** — Semua lirik tersimpan sebagai `.md` file, readable langsung di GitHub
- **Static Site** — Di-generate saat build time, no database, no CMS

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + @tailwindcss/typography
- **Content**: Markdown + YAML frontmatter (`gray-matter`)
- **Markdown Rendering**: `react-markdown` + `remark-breaks` + `remark-gfm`
- **Rendering**: Static Site Generation (SSG) via `generateStaticParams`
- **Deploy**: Vercel

## Struktur Konten

Lirik disimpan di folder `lyrics/` dengan struktur:

```
lyrics/
  Artist_Name/
    Album_Name/              ← opsional, hanya jika lagu punya album
      Song_Title/
        original.md          ← sumber metadata utama (prioritas tertinggi)
        romaji.md            ← opsional
        indonesia.md         ← opsional
        english.md           ← opsional
        [bahasa_lain].md     ← opsional, otomatis terdeteksi
    Song_Title_Tanpa_Album/
      original.md
      ...
```

> **Catatan:** Minimal satu file `.md` harus ada di folder lagu agar dianggap valid. Tidak wajib `indonesia.md` atau bahasa tertentu.

### Prioritas Metadata

Metadata (title, artist, tags, dll.) diambil dari file dengan prioritas:

1. `original.md`
2. `romaji.md`
3. `indonesia.md`
4. `english.md`
5. File `.md` lainnya (urutan alfabet)

Jika file prioritas tertinggi sudah memiliki metadata, metadata dari file lain **tidak akan diambil**. Jika metadata tidak lengkap (bahkan tidak ada judul/artis), sistem akan fallback ke nama folder sebagai judul dan nama artis.

### Format File Markdown

```markdown
---
# === Field Wajib ===
title: "Judul Lagu"
artist: "Nama Artis"
tags: ["vocaloid", "melankolis", "hatsune-miku"]

# === Field Opsional ===
title_original: "曲のタイトル"
title_romaji: "Kyoku no Taitoru"
album: "Nama Album"
vocalist: "Hatsune Miku"
producer: "Nama Producer"
lyricist: "Nama Penulis Lirik"
arranger: "Nama Arranger"
illustrator: "Nama Illustrator MV"
original_language: "ja"
release_date: "2024-01-01"
translator_note: "Terjemahan bebas, bukan literal"
source_url: "https://youtube.com/..."
translated_date: "2026-07-22"
---

Isi lirik di sini, **mendukung markdown formatting**.

Baris baru dipertahankan.
*Italic* dan **bold** dirender.

Furigana: {事切|ことき}れて、またね。
```

### Furigana (Ruby Text)

Gunakan syntax `{漢字|ふりがな}` untuk menambahkan furigana di atas kanji:

```markdown
{事切|ことき}れて、またね。
{宛|あて}もなくただ{辿|たど}る{家路|いえじ}を、
{他人事|ひとごと}のように{日々|ひび}を{眺|なが}めた。
```

Akan dirender sebagai teks dengan annotation kecil di atas kanji. Browser yang tidak support ruby text akan menampilkan reading dalam tanda kurung sebagai fallback.

### Tabel Metadata

| Field | Status | Deskripsi |
|---|---|---|
| `title` | **Wajib** | Judul lagu (versi display/translated) |
| `artist` | **Wajib** | Nama artis/circle |
| `tags` | **Wajib** | Array tag untuk kategorisasi |
| `title_original` | Opsional | Judul dalam bahasa asli (e.g. Jepang) |
| `title_romaji` | Opsional | Judul dalam romaji (transliterasi Latin) |
| `album` | Opsional | Nama album |
| `vocalist` | Opsional | Nama vocalist (e.g. "Hatsune Miku") |
| `producer` | Opsional | Nama producer/composer |
| `lyricist` | Opsional | Penulis lirik (jika berbeda dari producer) |
| `arranger` | Opsional | Arranger/penata musik |
| `illustrator` | Opsional | Illustrator MV/cover |
| `original_language` | Opsional | Bahasa asli lagu (default: "ja") |
| `release_date` | Opsional | Tanggal rilis lagu (YYYY-MM-DD) |
| `translator_note` | Opsional | Catatan penerjemah |
| `source_url` | Opsional | URL sumber (YouTube, NicoNico, dll.) — YouTube otomatis di-embed |
| `translated_date` | Opsional | Tanggal diterjemahkan (YYYY-MM-DD) |

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
2. Tambah minimal satu file `.md` (e.g. `original.md`, `indonesia.md`) dengan YAML frontmatter
3. Opsional: tambah file bahasa lain — nama file akan menjadi label bahasa
4. Push ke GitHub → Vercel rebuild otomatis

### Menambah Bahasa Baru

Cukup buat file `.md` baru di folder lagu dengan nama bahasa yang diinginkan:

```
lyrics/Artis/Lagu/
  original.md      → label: "原文"
  romaji.md        → label: "Romaji"
  indonesia.md     → label: "Indonesia"
  english.md       → label: "English"
  korean.md        → label: "Korean"     ← otomatis terdeteksi!
  spanish.md       → label: "Spanish"    ← otomatis terdeteksi!
```

## Routes

| Route | Deskripsi |
|---|---|
| `/` | Homepage — daftar semua lagu, search filter, stats |
| `/[artist]` | Halaman artis — semua lagu dari artis tertentu |
| `/[artist]/[song]` | Detail lagu (tanpa album) |
| `/[artist]/[album]/[song]` | Detail lagu (dengan album) |
| `/tags` | Daftar semua tag |
| `/tags/[tag]` | Lagu-lagu dengan tag tertentu |
| `/artists` | Daftar semua artis |
| `/about` | Tentang situs ini |

## Keyboard Shortcuts (Song Detail Page)

| Key | Aksi |
|---|---|
| `1` – `9` | Switch ke bahasa ke-N |
| `S` | Toggle side-by-side mode |

## Disclaimer

Semua lirik asli, musik, dan karya seni adalah milik artis, produser, dan pemegang hak cipta masing-masing. Terjemahan di sini bersifat personal dan non-komersial, dibuat untuk tujuan apresiasi budaya dan edukasi.
