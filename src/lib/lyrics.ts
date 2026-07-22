import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  Song,
  SongFrontmatter,
  SongLanguageContent,
  LanguageKey,
  ArtistInfo,
} from "./types";

const LYRICS_DIR = path.join(process.cwd(), "lyrics");
const LANGUAGE_FILES: LanguageKey[] = [
  "indonesia",
  "english",
  "romaji",
  "original",
];

/**
 * Recursively find all "song folders" under lyrics/.
 * A song folder is any directory containing at least `indonesia.md`.
 * Returns the relative path segments from lyrics/ to each song folder.
 */
function findSongFolders(dir: string, segments: string[] = []): string[][] {
  const results: string[][] = [];

  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Check if this directory IS a song folder (has indonesia.md)
  const hasIndonesia = entries.some(
    (e) => e.isFile() && e.name === "indonesia.md"
  );
  if (hasIndonesia) {
    results.push([...segments]);
  }

  // Recurse into subdirectories
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      results.push(
        ...findSongFolders(path.join(dir, entry.name), [
          ...segments,
          entry.name,
        ])
      );
    }
  }

  return results;
}

/**
 * Parse a single .md file and return its frontmatter + content.
 */
function parseMarkdownFile(filePath: string): SongLanguageContent | null {
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: {
      title: data.title ?? "",
      title_original: data.title_original,
      artist: data.artist ?? "",
      album: data.album,
      vocalist: data.vocalist,
      producer: data.producer,
      release_date: data.release_date,
      translator_note: data.translator_note,
      tags: Array.isArray(data.tags) ? data.tags : [],
      source_url: data.source_url,
      translated_date: data.translated_date,
    },
    content: content.trim(),
  };
}

/**
 * Load all language variants for a song folder.
 */
function loadSongLanguages(
  songFolderPath: string
): Partial<Record<LanguageKey, SongLanguageContent>> {
  const languages: Partial<Record<LanguageKey, SongLanguageContent>> = {};

  for (const lang of LANGUAGE_FILES) {
    const filePath = path.join(songFolderPath, `${lang}.md`);
    const parsed = parseMarkdownFile(filePath);
    if (parsed) {
      languages[lang] = parsed;
    }
  }

  return languages;
}

/**
 * Get all songs from the lyrics/ directory.
 * Sorted by translated_date descending (newest first).
 */
export function getAllSongs(): Song[] {
  const songPaths = findSongFolders(LYRICS_DIR);

  const songs: Song[] = songPaths
    .map((segments) => {
      const songFolderPath = path.join(LYRICS_DIR, ...segments);
      const languages = loadSongLanguages(songFolderPath);

      // indonesia.md is the primary source of truth
      const primary = languages.indonesia;
      if (!primary) return null;

      return {
        slug: segments,
        artistSlug: segments[0],
        metadata: primary.frontmatter,
        languages,
      };
    })
    .filter((s): s is Song => s !== null);

  // Sort by translated_date, newest first
  songs.sort((a, b) => {
    const dateA = a.metadata.translated_date ?? "";
    const dateB = b.metadata.translated_date ?? "";
    return dateB.localeCompare(dateA);
  });

  return songs;
}

/**
 * Resolve a slug (URL segments) to a Song.
 * Supports both Artist/Song (2 segments) and Artist/Album/Song (3 segments).
 */
export function getSongBySlug(slugSegments: string[]): Song | null {
  const songFolderPath = path.join(LYRICS_DIR, ...slugSegments);

  // Verify this is a song folder
  if (
    !fs.existsSync(songFolderPath) ||
    !fs.existsSync(path.join(songFolderPath, "indonesia.md"))
  ) {
    return null;
  }

  const languages = loadSongLanguages(songFolderPath);
  const primary = languages.indonesia;
  if (!primary) return null;

  return {
    slug: slugSegments,
    artistSlug: slugSegments[0],
    metadata: primary.frontmatter,
    languages,
  };
}

/**
 * Check if a slug represents an artist (a top-level directory in lyrics/).
 */
export function isArtistSlug(slug: string): boolean {
  const artistPath = path.join(LYRICS_DIR, slug);
  return (
    fs.existsSync(artistPath) &&
    fs.statSync(artistPath).isDirectory()
  );
}

/**
 * Get all unique artists.
 */
export function getAllArtists(): ArtistInfo[] {
  if (!fs.existsSync(LYRICS_DIR)) return [];

  const songs = getAllSongs();
  const artistMap = new Map<string, { name: string; count: number }>();

  for (const song of songs) {
    const slug = song.artistSlug;
    const existing = artistMap.get(slug);
    if (existing) {
      existing.count++;
    } else {
      // Use the artist name from metadata, fall back to slug with underscores replaced
      artistMap.set(slug, {
        name: song.metadata.artist || slug.replace(/_/g, " "),
        count: 1,
      });
    }
  }

  return Array.from(artistMap.entries()).map(([slug, info]) => ({
    slug,
    name: info.name,
    songCount: info.count,
  }));
}

/**
 * Get all songs by a specific artist (by folder slug).
 */
export function getSongsByArtist(artistSlug: string): Song[] {
  return getAllSongs().filter((song) => song.artistSlug === artistSlug);
}

/**
 * Get all unique tags across all songs.
 */
export function getAllTags(): string[] {
  const songs = getAllSongs();
  const tagSet = new Set<string>();

  for (const song of songs) {
    for (const tag of song.metadata.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

/**
 * Get all songs that have a specific tag.
 */
export function getSongsByTag(tag: string): Song[] {
  return getAllSongs().filter((song) => song.metadata.tags.includes(tag));
}
