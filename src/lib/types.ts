export interface SongFrontmatter {
  // === Required fields ===
  title: string;
  artist: string;
  tags: string[];

  // === Optional fields (existing) ===
  title_original?: string;
  album?: string;
  vocalist?: string;
  producer?: string;
  release_date?: string;
  translator_note?: string;
  source_url?: string;
  translated_date?: string;

  // === Optional fields (new) ===
  title_romaji?: string;
  lyricist?: string;
  arranger?: string;
  illustrator?: string;
  original_language?: string; // default: "ja"
}

export interface SongLanguageContent {
  frontmatter: SongFrontmatter;
  content: string;
}

/**
 * Language key is now dynamic — any .md filename (without extension) is a valid key.
 * Common keys: "indonesia", "english", "romaji", "original"
 */
export type LanguageKey = string;

/**
 * Display labels for known languages.
 * Unknown languages will have their key capitalized as fallback.
 */
export const LANGUAGE_LABELS: Record<string, string> = {
  indonesia: "Indonesia",
  english: "English",
  romaji: "Romaji",
  original: "原文",
};

/**
 * Get display label for a language key.
 * Falls back to capitalizing the key if not in LANGUAGE_LABELS.
 */
export function getLanguageLabel(key: string): string {
  return (
    LANGUAGE_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
  );
}

export interface Song {
  slug: string[]; // e.g. ["Kenshi_Yonezu", "BOOTLEG", "Lemon"]
  artistSlug: string; // "Kenshi_Yonezu"
  metadata: SongFrontmatter; // merged from primary .md (priority-based)
  languages: Record<string, SongLanguageContent>;
  availableLanguages: string[]; // e.g. ["original", "romaji", "indonesia", "english"]
  searchableText: string; // precomputed lowercase string for search
}

export interface ArtistInfo {
  slug: string; // folder name e.g. "Kenshi_Yonezu"
  name: string; // display name e.g. "Kenshi Yonezu"
  songCount: number;
}
