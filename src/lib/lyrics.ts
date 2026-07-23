import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { tagToSlug } from "./tags";
import type {
  Song,
  SongFrontmatter,
  SongLanguageContent,
  ArtistInfo,
} from "./types";

const LYRICS_DIR = path.join(process.cwd(), "lyrics");

/**
 * Priority order for determining the primary metadata source.
 * The first file found in this order becomes the metadata source.
 * Any .md file not in this list is discovered dynamically and appended after.
 */
const METADATA_PRIORITY = ["original", "romaji", "indonesia", "english"];

/**
 * Files/directories to ignore when scanning for language .md files.
 */
const IGNORED_FILES = new Set(["README.md", "readme.md"]);

/**
 * Recursively find all "song folders" under lyrics/.
 * A song folder is any directory containing at least one .md file.
 * Returns the relative path segments from lyrics/ to each song folder.
 */
function findSongFolders(dir: string, segments: string[] = []): string[][] {
  const results: string[][] = [];

  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Check if this directory IS a song folder (has at least one .md file)
  const hasMd = entries.some(
    (e) =>
      e.isFile() &&
      e.name.endsWith(".md") &&
      !IGNORED_FILES.has(e.name)
  );
  if (hasMd) {
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
 * Discover all language .md files in a song folder.
 * Returns an array of language keys (filenames without .md extension).
 */
function discoverLanguages(songFolderPath: string): string[] {
  if (!fs.existsSync(songFolderPath)) return [];

  const entries = fs.readdirSync(songFolderPath, { withFileTypes: true });

  return entries
    .filter(
      (e) =>
        e.isFile() &&
        e.name.endsWith(".md") &&
        !IGNORED_FILES.has(e.name)
    )
    .map((e) => e.name.replace(/\.md$/, ""));
}

/**
 * Sort language keys with known languages first (in priority order),
 * then unknown languages alphabetically.
 */
function sortLanguageKeys(keys: string[]): string[] {
  const knownOrder = ["original", "romaji", "indonesia", "english"];

  const known = knownOrder.filter((k) => keys.includes(k));
  const unknown = keys
    .filter((k) => !knownOrder.includes(k))
    .sort();

  return [...known, ...unknown];
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
      // Required
      title: data.title ?? "",
      artist: data.artist ?? "",
      tags: Array.isArray(data.tags) ? data.tags : [],

      // Optional (existing)
      title_original: data.title_original,
      album: data.album,
      vocalist: data.vocalist,
      producer: data.producer,
      release_date: data.release_date,
      translator_note: data.translator_note,
      source_url: data.source_url,
      translated_date: data.translated_date,

      // Optional (new)
      title_romaji: data.title_romaji,
      lyricist: data.lyricist,
      arranger: data.arranger,
      illustrator: data.illustrator,
      original_language: data.original_language,
    },
    content: content.trim(),
  };
}

/**
 * Determine the primary metadata source from available languages.
 * Priority: original → romaji → indonesia → english → first available.
 *
 * Returns the frontmatter from the highest-priority file that has metadata.
 * Falls back gracefully even if critical fields like title/artist are missing.
 */
function resolvePrimaryMetadata(
  languages: Record<string, SongLanguageContent>,
  slugSegments: string[]
): SongFrontmatter {
  const orderedKeys = [
    ...METADATA_PRIORITY.filter((k) => k in languages),
    ...Object.keys(languages).filter((k) => !METADATA_PRIORITY.includes(k)),
  ];

  // Find the first file that has non-empty metadata
  for (const key of orderedKeys) {
    const fm = languages[key]?.frontmatter;
    if (fm && (fm.title || fm.artist || fm.tags.length > 0)) {
      return fm;
    }
  }

  // Extreme fallback: no file has meaningful metadata
  // Use the first available file's frontmatter, with slug-based fallbacks
  const firstKey = orderedKeys[0];
  const baseFm = firstKey
    ? languages[firstKey].frontmatter
    : { title: "", artist: "", tags: [] };

  return {
    ...baseFm,
    title: baseFm.title || slugSegments[slugSegments.length - 1]?.replace(/_/g, " ") || "Untitled",
    artist: baseFm.artist || slugSegments[0]?.replace(/_/g, " ") || "Unknown Artist",
  };
}

/**
 * Load all language variants for a song folder.
 */
function loadSongLanguages(
  songFolderPath: string
): Record<string, SongLanguageContent> {
  const languages: Record<string, SongLanguageContent> = {};
  const langKeys = discoverLanguages(songFolderPath);

  for (const lang of langKeys) {
    const filePath = path.join(songFolderPath, `${lang}.md`);
    const parsed = parseMarkdownFile(filePath);
    if (parsed) {
      languages[lang] = parsed;
    }
  }

  return languages;
}

/**
 * Build a precomputed searchable text string from all metadata + lyrics content.
 * Used for fast client-side fuzzy search.
 */
function buildSearchableText(
  metadata: SongFrontmatter,
  languages: Record<string, SongLanguageContent>
): string {
  const parts: string[] = [
    metadata.title,
    metadata.title_original ?? "",
    metadata.title_romaji ?? "",
    metadata.artist,
    metadata.vocalist ?? "",
    metadata.producer ?? "",
    metadata.lyricist ?? "",
    metadata.arranger ?? "",
    metadata.illustrator ?? "",
    metadata.album ?? "",
    ...metadata.tags,
  ];

  // Include lyrics content from all languages
  for (const lang of Object.values(languages)) {
    parts.push(lang.content);
  }

  return parts.join(" ").toLowerCase();
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

      // Must have at least one language file
      const langKeys = Object.keys(languages);
      if (langKeys.length === 0) return null;

      const metadata = resolvePrimaryMetadata(languages, segments);
      const availableLanguages = sortLanguageKeys(langKeys);
      const searchableText = buildSearchableText(metadata, languages);

      return {
        slug: segments,
        artistSlug: segments[0],
        metadata,
        languages,
        availableLanguages,
        searchableText,
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

  // Verify this is a valid song folder (has at least one .md)
  if (!fs.existsSync(songFolderPath)) return null;

  const languages = loadSongLanguages(songFolderPath);
  const langKeys = Object.keys(languages);
  if (langKeys.length === 0) return null;

  const metadata = resolvePrimaryMetadata(languages, slugSegments);
  const availableLanguages = sortLanguageKeys(langKeys);
  const searchableText = buildSearchableText(metadata, languages);

  return {
    slug: slugSegments,
    artistSlug: slugSegments[0],
    metadata,
    languages,
    availableLanguages,
    searchableText,
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

// Re-export tagToSlug from the client-safe module
export { tagToSlug } from "./tags";

/**
 * Get all unique tags across all songs, with their slugs.
 */
export function getAllTagsWithSlugs(): { tag: string; slug: string }[] {
  const songs = getAllSongs();
  const tagSet = new Set<string>();

  for (const song of songs) {
    for (const tag of song.metadata.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet)
    .sort()
    .map((tag) => ({ tag, slug: tagToSlug(tag) }));
}

/**
 * Get all unique tags across all songs.
 */
export function getAllTags(): string[] {
  return getAllTagsWithSlugs().map((t) => t.tag);
}

/**
 * Get all songs that have a specific tag.
 */
export function getSongsByTag(tag: string): Song[] {
  return getAllSongs().filter((song) => song.metadata.tags.includes(tag));
}

/**
 * Get all songs matching a tag slug.
 * Resolves the slug back to the original tag name first.
 */
export function getSongsByTagSlug(slug: string): { tag: string; songs: Song[] } | null {
  const allTags = getAllTagsWithSlugs();
  const match = allTags.find((t) => t.slug === slug);
  if (!match) return null;

  return {
    tag: match.tag,
    songs: getSongsByTag(match.tag),
  };
}
