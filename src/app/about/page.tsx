import { Info, ShieldAlert, Code2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Lyrics Translation",
  description: "About this lyrics translation project",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          About the Project
        </h1>
        <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
          Philosophy, methodology, and technical details.
        </p>
      </div>

      <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
        {/* Card 1: Methodology */}
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Info className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Translation Methodology
            </h2>
          </div>
          <div className="space-y-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              The translations on this site prioritize{" "}
              <strong className="text-zinc-900 dark:text-zinc-200">
                semantic meaning and emotional resonance
              </strong>{" "}
              over literal, word-for-word accuracy. This is a free
              interpretation approach — the goal is to convey the feeling, mood,
              and intent of the original lyrics in a way that reads naturally in
              the target language.
            </p>
            <p>
              As such, some lines may differ significantly from a direct
              translation. If you need a literal translation, the romaji and
              original Japanese versions are provided where available for
              reference.
            </p>
          </div>
        </section>

        {/* Card 2: Copyright */}
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Copyright Disclaimer
            </h2>
          </div>
          <div className="space-y-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              All original lyrics, music, and artwork belong to their respective
              artists, producers, and rights holders. The translations provided
              here are personal, non-commercial interpretations made for
              educational and cultural appreciation purposes.
            </p>
            <p>
              If you are a rights holder and would like a translation removed,
              please contact me and I will comply promptly.
            </p>
          </div>
        </section>

        {/* Card 3: Tech Stack */}
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Code2 className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              About This Site
            </h2>
          </div>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
            Built with{" "}
            <strong className="text-zinc-900 dark:text-zinc-200">
              Next.js
            </strong>
            . Lyrics are stored as Markdown files in the repository, making them
            directly readable and shareable via GitHub. The site is statically
            generated at build time — no database, no CMS.
          </p>
        </section>
      </div>
    </div>
  );
}
