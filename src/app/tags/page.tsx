import Link from "next/link";
import { getAllTags, getSongsByTag } from "@/lib/lyrics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags — Lyrics Translation",
  description: "Browse song translations by tag",
};

export default function TagsIndexPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Tags
      </h1>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const count = getSongsByTag(tag).length;
          return (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              {tag}
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                ({count})
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
