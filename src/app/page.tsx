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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Lyrics Translation
      </h1>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        Personal translations of Vocaloid &amp; J-Pop lyrics
      </p>

      {/* Stats */}
      <div className="mb-6 flex gap-4 text-xs text-zinc-400 dark:text-zinc-500">
        <span>{songs.length} songs</span>
        <span>·</span>
        <span>{artists.length} artists</span>
        <span>·</span>
        <span>{tags.length} tags</span>
      </div>

      <SongList songs={songs} />
    </div>
  );
}
