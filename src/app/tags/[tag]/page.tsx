import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags, getSongsByTag } from "@/lib/lyrics";
import SongList from "@/app/components/SongList";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `"${decodedTag}" — Tags — Lyrics Translation`,
    description: `Songs tagged with "${decodedTag}"`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const songs = getSongsByTag(decodedTag);

  if (songs.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-200">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/tags" className="hover:text-zinc-700 dark:hover:text-zinc-200">Tags</Link>
        <span className="mx-2">›</span>
        <span className="text-zinc-900 dark:text-zinc-100">{decodedTag}</span>
      </nav>
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Tag: {decodedTag}
      </h1>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        {songs.length} song{songs.length !== 1 ? "s" : ""}
      </p>
      <SongList songs={songs} showSearch={false} />
    </div>
  );
}
