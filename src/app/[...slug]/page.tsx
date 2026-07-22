import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllSongs,
  getAllArtists,
  getSongBySlug,
  getSongsByArtist,
  isArtistSlug,
} from "@/lib/lyrics";
import SongDetail from "./SongDetail";
import SongList from "@/app/components/SongList";
import type { Metadata } from "next";

// Only serve paths generated at build time
export const dynamicParams = false;

export async function generateStaticParams() {
  const songs = getAllSongs();
  const artists = getAllArtists();

  const params: { slug: string[] }[] = [];

  // Artist pages (1 segment)
  for (const artist of artists) {
    params.push({ slug: [artist.slug] });
  }

  // Song pages (2 or 3 segments)
  for (const song of songs) {
    params.push({ slug: song.slug });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug.length === 1) {
    const artistName = slug[0].replace(/_/g, " ");
    return {
      title: `${artistName} — Lyrics Translation`,
      description: `All translated songs by ${artistName}`,
    };
  }

  const song = getSongBySlug(slug);
  if (!song) {
    return { title: "Not Found — Lyrics Translation" };
  }

  return {
    title: `${song.metadata.title} — ${song.metadata.artist} — Lyrics Translation`,
    description: `Lyrics and translations of ${song.metadata.title} (${song.metadata.title_original ?? ""}) by ${song.metadata.artist}`,
  };
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  // 1 segment → Artist page
  if (slug.length === 1) {
    const artistSlug = slug[0];
    if (!isArtistSlug(artistSlug)) {
      notFound();
    }

    const songs = getSongsByArtist(artistSlug);
    const artistName =
      songs[0]?.metadata.artist ?? artistSlug.replace(/_/g, " ");

    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-200">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-zinc-900 dark:text-zinc-100">{artistName}</span>
        </nav>
        <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {artistName}
        </h1>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          {songs.length} song{songs.length !== 1 ? "s" : ""} translated
        </p>
        <SongList songs={songs} showSearch={false} />
      </div>
    );
  }

  // 2 or 3 segments → Song page
  const song = getSongBySlug(slug);
  if (!song) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-200">Home</Link>
        <span className="mx-2">›</span>
        <Link
          href={`/${song.artistSlug}`}
          className="hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          {song.metadata.artist}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-zinc-900 dark:text-zinc-100">{song.metadata.title}</span>
      </nav>
      <SongDetail song={song} />
    </div>
  );
}
