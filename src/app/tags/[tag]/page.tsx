import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTagsWithSlugs, getSongsByTagSlug } from "@/lib/lyrics";
import SongList from "@/app/components/SongList";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = getAllTagsWithSlugs();
  return tags.map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: slug } = await params;
  const result = getSongsByTagSlug(decodeURIComponent(slug));
  const displayTag = result?.tag ?? slug;
  return {
    title: `"${displayTag}" — Tags — Lyrics Translation`,
    description: `Songs tagged with "${displayTag}"`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: slug } = await params;
  const result = getSongsByTagSlug(decodeURIComponent(slug));

  if (!result || result.songs.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-200">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/tags" className="hover:text-zinc-700 dark:hover:text-zinc-200">Tags</Link>
        <span className="mx-2">›</span>
        <span className="text-zinc-900 dark:text-zinc-100">{result.tag}</span>
      </nav>
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Tag: {result.tag}
      </h1>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        {result.songs.length} song{result.songs.length !== 1 ? "s" : ""}
      </p>
      <SongList songs={result.songs} showSearch={false} />
    </div>
  );
}
