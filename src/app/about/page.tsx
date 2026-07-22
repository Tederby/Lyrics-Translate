import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Lyrics Translation",
  description: "About this lyrics translation project",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        About
      </h1>

      <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Translation Methodology
          </h2>
          <p>
            The translations on this site prioritize{" "}
            <strong>semantic meaning and emotional resonance</strong> over literal,
            word-for-word accuracy. This is a free interpretation approach — the
            goal is to convey the feeling, mood, and intent of the original lyrics
            in a way that reads naturally in the target language.
          </p>
          <p className="mt-2">
            As such, some lines may differ significantly from a direct translation.
            If you need a literal translation, the romaji and original Japanese
            versions are provided where available for reference.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Copyright Disclaimer
          </h2>
          <p>
            All original lyrics, music, and artwork belong to their respective
            artists, producers, and rights holders. The translations provided here
            are personal, non-commercial interpretations made for educational and
            cultural appreciation purposes.
          </p>
          <p className="mt-2">
            If you are a rights holder and would like a translation removed, please
            contact me and I will comply promptly.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            About This Site
          </h2>
          <p>
            Built with Next.js. Lyrics are stored as Markdown files in the
            repository, making them directly readable and shareable via GitHub.
            The site is statically generated at build time — no database, no CMS.
          </p>
        </section>
      </div>
    </div>
  );
}
