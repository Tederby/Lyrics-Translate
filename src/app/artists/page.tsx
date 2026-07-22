import Link from "next/link";
import { getAllArtists } from "@/lib/lyrics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artists — Lyrics Translation",
  description: "Browse all artists with translated song lyrics",
};

export default function ArtistsPage() {
  const artists = getAllArtists();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Artists
      </h1>
      <ul className="space-y-2">
        {artists.map((artist) => (
          <li key={artist.slug}>
            <Link
              href={`/${artist.slug}`}
              className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {artist.name}
              </span>
              <span className="text-sm text-zinc-400 dark:text-zinc-500">
                {artist.songCount} song{artist.songCount !== 1 ? "s" : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
