import Link from "next/link";
import { getAllArtists } from "@/lib/lyrics";
import { Mic2, Music2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artists — Lyrics Translation",
  description: "Browse all artists with translated song lyrics",
};

export default function ArtistsPage() {
  const artists = getAllArtists();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Artists
        </h1>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
          Discover translations by your favorite singers and producers
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <Link
            key={artist.slug}
            href={`/${artist.slug}`}
            className="group relative flex items-center gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-indigo-500/50"
          >
            {/* Avatar Placeholder */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-400">
              <Mic2 className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate font-semibold text-zinc-900 transition-colors group-hover:text-indigo-700 dark:text-zinc-100 dark:group-hover:text-indigo-300">
                {artist.name}
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                <Music2 className="h-3.5 w-3.5" />
                <span>
                  {artist.songCount} song{artist.songCount !== 1 ? "s" : ""}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
