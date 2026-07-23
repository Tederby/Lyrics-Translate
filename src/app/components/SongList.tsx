"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Song } from "@/lib/types";
import { getLanguageLabel } from "@/lib/types";
import { getYouTubeThumbnail } from "@/lib/youtube";

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

    const tokens = normalize(raw)
      .split(/\s+/)
      .filter(Boolean);

    return songs.filter((song) => {
      const haystack = normalize(song.searchableText);
      return tokens.every((token) => haystack.includes(token));
    });
  }, [songs, query]);

  return (
    <div>
      {showSearch && (
        <div className="mb-8">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by title, artist, vocalist, lyrics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-600 dark:focus:bg-zinc-900 dark:focus:ring-zinc-800"
            />
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            No songs found
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((song, index) => (
            <SongCard key={song.slug.join("/")} song={song} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function SongCard({ song, index }: { song: Song; index: number }) {
  const thumbnail = song.metadata.source_url
    ? getYouTubeThumbnail(song.metadata.source_url, "mqdefault")
    : null;

  return (
    <Link
      href={`/${song.slug.join("/")}`}
      className="song-card group relative flex h-40 overflow-hidden rounded-xl border border-zinc-200/80 bg-white transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Text content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          {/* Title */}
          <h2 
            className="line-clamp-2 font-semibold text-zinc-900 transition-colors group-hover:text-zinc-700 dark:text-zinc-100 dark:group-hover:text-white"
            title={song.metadata.title}
          >
            {song.metadata.title}
          </h2>
          {song.metadata.title_original && (
            <p 
              className="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400"
              title={song.metadata.title_original}
            >
              {song.metadata.title_original}
            </p>
          )}

          {/* Artist / Vocalist */}
          <p className="mt-1.5 truncate text-sm text-zinc-600 dark:text-zinc-400">
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

        {/* Bottom row: tags + language badges + date */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {song.metadata.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
            {song.metadata.tags.length > 3 && (
              <span className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                +{song.metadata.tags.length - 3}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* Language badges */}
            <div className="flex gap-0.5">
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
      </div>

      {/* Thumbnail */}
      <div className="relative w-28 shrink-0 overflow-hidden sm:w-32">
        {thumbnail ? (
          <>
            <Image
              src={thumbnail}
              alt={song.metadata.title}
              fill
              sizes="(max-width: 640px) 112px, 128px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            {/* Fade overlay from left */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent dark:from-zinc-900/90 dark:via-zinc-900/40 dark:to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
            <svg
              className="h-8 w-8 text-zinc-300 dark:text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
        )}

        {/* Date badge on thumbnail */}
        {song.metadata.translated_date && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
            {song.metadata.translated_date}
          </span>
        )}
      </div>
    </Link>
  );
}
