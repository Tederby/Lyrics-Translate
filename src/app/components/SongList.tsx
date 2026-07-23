"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
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
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by title, artist, vocalist, lyrics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-10 text-sm text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-indigo-600 dark:focus:bg-zinc-900 dark:focus:ring-indigo-900/30"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
        <motion.div 
          className="grid gap-4 sm:grid-cols-2"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {filtered.map((song, index) => (
            <motion.div 
              key={song.slug.join("/")} 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
              }}
            >
              <SongCard song={song} index={index} />
            </motion.div>
          ))}
        </motion.div>
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
      className="song-card group relative flex h-48 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-900 transition-all duration-300 hover:border-indigo-400/80 hover:shadow-xl hover:shadow-indigo-500/20 dark:border-zinc-800/80 sm:h-56"
    >
      {/* Background Thumbnail */}
      <div className="absolute inset-0 z-0">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={song.metadata.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800">
            <svg
              className="h-12 w-12 text-zinc-700"
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
      </div>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/60 to-black/10 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Top right date badge */}
      {song.metadata.translated_date && (
        <div className="absolute right-3 top-3 z-20 rounded-md bg-black/50 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur-md">
          {song.metadata.translated_date}
        </div>
      )}

      {/* Text Content (Foreground) */}
      <div className="relative z-20 flex h-full w-full flex-col justify-end p-4 sm:p-5">
        <div className="min-w-0">
          {/* Title */}
          <h2 
            className="line-clamp-2 text-lg font-bold tracking-tight text-white drop-shadow-sm transition-colors group-hover:text-indigo-100"
            title={song.metadata.title}
          >
            {song.metadata.title}
          </h2>
          {song.metadata.title_original && (
            <p 
              className="mt-0.5 truncate text-sm text-zinc-300 drop-shadow-sm"
              title={song.metadata.title_original}
            >
              {song.metadata.title_original}
            </p>
          )}

          {/* Artist / Vocalist */}
          <p className="mt-1.5 truncate text-sm font-medium text-zinc-400 drop-shadow-sm">
            {song.metadata.artist}
            {song.metadata.vocalist &&
              song.metadata.vocalist !== song.metadata.artist && (
                <span className="text-zinc-500">
                  {" "}
                  · {song.metadata.vocalist}
                </span>
              )}
          </p>
        </div>

        {/* Bottom row: tags + language badges */}
        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {song.metadata.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-zinc-200 backdrop-blur-sm border border-white/5"
              >
                {tag}
              </span>
            ))}
            {song.metadata.tags.length > 3 && (
              <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400 backdrop-blur-sm border border-white/5">
                +{song.metadata.tags.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex shrink-0 items-center gap-1">
            {/* Language badges */}
            {song.availableLanguages.map((lang) => (
              <span
                key={lang}
                title={getLanguageLabel(lang)}
                className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded bg-indigo-500/20 px-1.5 text-[10px] font-bold text-indigo-200 backdrop-blur-sm border border-indigo-400/20"
              >
                {getLanguageBadge(lang)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
