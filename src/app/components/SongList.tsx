"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import TagChip from "./TagChip";
import type { Song } from "@/lib/types";
import { getLanguageLabel } from "@/lib/types";

/** Short emoji/text badges for common languages */
const LANGUAGE_BADGE: Record<string, string> = {
  indonesia: "🇮🇩",
  english: "🇬🇧",
  romaji: "Rj",
  original: "原",
};

function getLanguageBadge(key: string): string {
  return LANGUAGE_BADGE[key] ?? key.slice(0, 2).toUpperCase();
}

/**
 * Normalize a string for fuzzy matching:
 * lowercase, remove diacritics, collapse whitespace.
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface SongListProps {
  songs: Song[];
  showSearch?: boolean;
}

export default function SongList({ songs, showSearch = true }: SongListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const raw = query.trim();
    if (!raw) return songs;

    // Split into tokens for AND-matching
    const tokens = normalize(raw)
      .split(/\s+/)
      .filter(Boolean);

    return songs.filter((song) => {
      const haystack = normalize(song.searchableText);
      // All tokens must appear in the searchable text
      return tokens.every((token) => haystack.includes(token));
    });
  }, [songs, query]);

  return (
    <div>
      {showSearch && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, artist, vocalist, lyrics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No songs found.
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((song) => (
            <li key={song.slug.join("/")}>
              <Link
                href={`/${song.slug.join("/")}`}
                className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
                      {song.metadata.title}
                    </h2>
                    {song.metadata.title_original && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {song.metadata.title_original}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {song.metadata.artist}
                      {song.metadata.vocalist &&
                        song.metadata.vocalist !== song.metadata.artist && (
                          <span className="text-zinc-400 dark:text-zinc-500">
                            {" "}
                            · {song.metadata.vocalist}
                          </span>
                        )}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {song.metadata.translated_date && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {song.metadata.translated_date}
                      </span>
                    )}
                    {/* Language badges */}
                    <div className="flex gap-1">
                      {song.availableLanguages.map((lang) => (
                        <span
                          key={lang}
                          title={getLanguageLabel(lang)}
                          className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded bg-zinc-100 px-1 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {getLanguageBadge(lang)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {song.metadata.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {song.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
