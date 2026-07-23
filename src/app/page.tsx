import { getAllSongs, getAllArtists, getAllTags } from "@/lib/lyrics";
import SongList from "./components/SongList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Lyrics Translation",
  description:
    "Personal translations of Vocaloid and J-Pop song lyrics.",
};

export default function HomePage() {
  const songs = getAllSongs();
  const artists = getAllArtists();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Lyrics Translation
        </h1>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
          Personal translations of Vocaloid &amp; J-Pop lyrics
        </p>

        {/* Stats pills */}
        <div className="mt-4 flex gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {songs.length}
            </span>
            songs
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {artists.length}
            </span>
            artists
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {tags.length}
            </span>
            tags
          </span>
        </div>
      </div>

      <SongList songs={songs} />
    </div>
  );
}
