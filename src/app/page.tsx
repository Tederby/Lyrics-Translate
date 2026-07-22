import { getAllSongs } from "@/lib/lyrics";
import SongList from "./components/SongList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Lyrics Translation",
  description:
    "Personal translations of Vocaloid and J-Pop song lyrics from Japanese to Indonesian, English, and Romaji.",
};

export default function HomePage() {
  const songs = getAllSongs();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Lyrics Translation
      </h1>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Personal translations of Vocaloid &amp; J-Pop lyrics — Japanese to Indonesian
      </p>
      <SongList songs={songs} />
    </div>
  );
}
