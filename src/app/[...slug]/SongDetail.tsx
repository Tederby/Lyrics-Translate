"use client";

import { useState } from "react";
import TagChip from "@/app/components/TagChip";
import type { Song, LanguageKey } from "@/lib/types";
import { LANGUAGE_LABELS } from "@/lib/types";

interface SongDetailProps {
  song: Song;
}

export default function SongDetail({ song }: SongDetailProps) {
  const availableLanguages = Object.keys(song.languages) as LanguageKey[];

  const [activeLanguage, setActiveLanguage] = useState<LanguageKey>(
    availableLanguages.includes("indonesia") ? "indonesia" : availableLanguages[0]
  );
  const [sideBySide, setSideBySide] = useState(false);
  const [secondLanguage, setSecondLanguage] = useState<LanguageKey>(
    availableLanguages.includes("original") ? "original" : availableLanguages[0]
  );

  const { metadata } = song;

  return (
    <article>
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {metadata.title}
        </h1>
        {metadata.title_original && (
          <p className="mt-1 text-lg text-zinc-500 dark:text-zinc-400">
            {metadata.title_original}
          </p>
        )}

        {/* Metadata */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Artist</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-100">
              {metadata.artist}
            </dd>
          </div>
          {metadata.vocalist && (
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Vocalist</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                {metadata.vocalist}
              </dd>
            </div>
          )}
          {metadata.producer && (
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Producer</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                {metadata.producer}
              </dd>
            </div>
          )}
          {metadata.album && (
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Album</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                {metadata.album}
              </dd>
            </div>
          )}
          {metadata.release_date && (
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Release Date</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                {metadata.release_date}
              </dd>
            </div>
          )}
        </dl>

        {/* Source URL */}
        {metadata.source_url && (
          <a
            href={metadata.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ▶ Watch on YouTube
          </a>
        )}

        {/* Tags */}
        {metadata.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {metadata.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Translator note */}
        {metadata.translator_note && (
          <p className="mt-3 rounded bg-zinc-100 px-3 py-2 text-sm italic text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {metadata.translator_note}
          </p>
        )}
      </header>

      {/* Language controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Language toggle buttons */}
        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700">
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLanguage(lang)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
                activeLanguage === lang
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>

        {/* Side-by-side toggle */}
        {availableLanguages.length >= 2 && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={sideBySide}
              onChange={(e) => setSideBySide(e.target.checked)}
              className="rounded"
            />
            Side-by-side
          </label>
        )}

        {/* Second language selector (when side-by-side is on) */}
        {sideBySide && (
          <select
            value={secondLanguage}
            onChange={(e) => setSecondLanguage(e.target.value as LanguageKey)}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {availableLanguages
              .filter((l) => l !== activeLanguage)
              .map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang]}
                </option>
              ))}
          </select>
        )}
      </div>

      {/* Lyrics content */}
      {sideBySide ? (
        <div className="grid gap-6 md:grid-cols-2">
          <LyricsPane
            label={LANGUAGE_LABELS[activeLanguage]}
            content={song.languages[activeLanguage]?.content ?? ""}
          />
          <LyricsPane
            label={LANGUAGE_LABELS[secondLanguage]}
            content={song.languages[secondLanguage]?.content ?? ""}
          />
        </div>
      ) : (
        <LyricsPane
          label={LANGUAGE_LABELS[activeLanguage]}
          content={song.languages[activeLanguage]?.content ?? ""}
        />
      )}
    </article>
  );
}

function LyricsPane({ label, content }: { label: string; content: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {label}
      </h3>
      <div className="whitespace-pre-line text-zinc-800 leading-relaxed dark:text-zinc-200">
        {content}
      </div>
    </div>
  );
}
