export interface SongFrontmatter {
  title: string;
  title_original?: string;
  artist: string;
  album?: string;
  vocalist?: string;
  producer?: string;
  release_date?: string;
  translator_note?: string;
  tags: string[];
  source_url?: string;
  translated_date?: string;
}

export interface SongLanguageContent {
  frontmatter: SongFrontmatter;
  content: string;
}

export type LanguageKey = "indonesia" | "english" | "romaji" | "original";

export const LANGUAGE_LABELS: Record<LanguageKey, string> = {
  indonesia: "Indonesia",
  english: "English",
  romaji: "Romaji",
  original: "原文",
};

export interface Song {
  slug: string[]; // e.g. ["Kenshi_Yonezu", "BOOTLEG", "Lemon"]
  artistSlug: string; // "Kenshi_Yonezu"
  metadata: SongFrontmatter; // merged from indonesia.md (primary)
  languages: Partial<Record<LanguageKey, SongLanguageContent>>;
}

export interface ArtistInfo {
  slug: string; // folder name e.g. "Kenshi_Yonezu"
  name: string; // display name e.g. "Kenshi Yonezu"
  songCount: number;
}
