"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import TagChip from "./TagChip";
import type { Song } from "@/lib/types";

interface SongListProps {
  songs: Song[];
  showSearch?: boolean;
}

export default function SongList({ songs, showSearch = true }: SongListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return songs;
    const q = query.toLowerCase();
    return songs.filter(
      (song) =>
        song.metadata.title.toLowerCase().includes(q) ||
        (song.metadata.title_original ?? "").toLowerCase().includes(q) ||
        song.metadata.artist.toLowerCase().includes(q)
    );
  }, [songs, query]);

  return (
    <div>
      {showSearch && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, original title, or artist..."
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
                    </p>
                  </div>
                  {song.metadata.translated_date && (
                    <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                      {song.metadata.translated_date}
                    </span>
                  )}
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
