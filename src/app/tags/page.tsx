import Link from "next/link";
import { getAllTagsWithSlugs, getSongsByTag } from "@/lib/lyrics";
import { Hash } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags — Lyrics Translation",
  description: "Browse song translations by tag",
};

export default function TagsIndexPage() {
  const tags = getAllTagsWithSlugs();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Tags
        </h1>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
          Browse translations by genre, mood, or series
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, slug }) => {
          const count = getSongsByTag(tag).length;
          return (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(slug)}`}
              className="group flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-4 py-2 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10"
            >
              <Hash className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-indigo-500 dark:text-zinc-500" />
              <span className="font-medium text-zinc-700 transition-colors group-hover:text-indigo-700 dark:text-zinc-300 dark:group-hover:text-indigo-300">
                {tag}
              </span>
              <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-300">
                {count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
