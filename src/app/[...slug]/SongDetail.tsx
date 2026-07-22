"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import TagChip from "@/app/components/TagChip";
import VideoEmbed from "@/app/components/VideoEmbed";
import type { Song } from "@/lib/types";
import { getLanguageLabel } from "@/lib/types";

interface SongDetailProps {
  song: Song;
}

export default function SongDetail({ song }: SongDetailProps) {
  const { metadata, availableLanguages } = song;

  const [activeLanguage, setActiveLanguage] = useState<string>(
    availableLanguages.includes("indonesia")
      ? "indonesia"
      : availableLanguages[0]
  );
  const [sideBySide, setSideBySide] = useState(false);
  const [secondLanguage, setSecondLanguage] = useState<string>(() => {
    const others = availableLanguages.filter((l) => l !== activeLanguage);
    if (others.includes("original")) return "original";
    return others[0] ?? activeLanguage;
  });

  // Update second language when active changes to avoid same-language side-by-side
  useEffect(() => {
    if (secondLanguage === activeLanguage) {
      const others = availableLanguages.filter((l) => l !== activeLanguage);
      if (others.length > 0) {
        setSecondLanguage(others.includes("original") ? "original" : others[0]);
      }
    }
  }, [activeLanguage, secondLanguage, availableLanguages]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Number keys 1-9 to switch language
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= availableLanguages.length) {
        e.preventDefault();
        setActiveLanguage(availableLanguages[num - 1]);
        return;
      }

      // S to toggle side-by-side
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        setSideBySide((prev) => !prev);
      }
    },
    [availableLanguages]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Metadata items for the info grid
  const metadataItems: { label: string; value: string | undefined }[] = [
    { label: "Artist", value: metadata.artist },
    { label: "Vocalist", value: metadata.vocalist },
    { label: "Producer", value: metadata.producer },
    { label: "Lyricist", value: metadata.lyricist },
    { label: "Arranger", value: metadata.arranger },
    { label: "Illustrator", value: metadata.illustrator },
    { label: "Album", value: metadata.album },
    { label: "Release Date", value: metadata.release_date },
  ];

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
        {metadata.title_romaji && (
          <p className="mt-0.5 text-sm italic text-zinc-400 dark:text-zinc-500">
            {metadata.title_romaji}
          </p>
        )}

        {/* Metadata grid */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          {metadataItems
            .filter((item) => item.value)
            .map((item) => (
              <div key={item.label}>
                <dt className="text-zinc-500 dark:text-zinc-400">
                  {item.label}
                </dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                  {item.value}
                </dd>
              </div>
            ))}
        </dl>

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

      {/* Video embed */}
      {metadata.source_url && (
        <div className="mb-6">
          <VideoEmbed url={metadata.source_url} />
        </div>
      )}

      {/* Language controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Language dropdown selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="lang-select"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            Language
          </label>
          <select
            id="lang-select"
            value={activeLanguage}
            onChange={(e) => setActiveLanguage(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {availableLanguages.map((lang, i) => (
              <option key={lang} value={lang}>
                {getLanguageLabel(lang)}
                {i < 9 ? ` [${i + 1}]` : ""}
              </option>
            ))}
          </select>
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
            Side-by-side [S]
          </label>
        )}

        {/* Second language selector (when side-by-side is on) */}
        {sideBySide && (
          <select
            value={secondLanguage}
            onChange={(e) => setSecondLanguage(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {availableLanguages
              .filter((l) => l !== activeLanguage)
              .map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </option>
              ))}
          </select>
        )}
      </div>

      {/* Lyrics content */}
      {sideBySide ? (
        <div className="grid gap-4 md:grid-cols-2">
          <LyricsPane
            label={getLanguageLabel(activeLanguage)}
            content={song.languages[activeLanguage]?.content ?? ""}
            expanded
          />
          <LyricsPane
            label={getLanguageLabel(secondLanguage)}
            content={song.languages[secondLanguage]?.content ?? ""}
            expanded
          />
        </div>
      ) : (
        <LyricsPane
          label={getLanguageLabel(activeLanguage)}
          content={song.languages[activeLanguage]?.content ?? ""}
        />
      )}

      {/* Keyboard shortcuts hint */}
      <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600">
        Keyboard shortcuts: 1–{availableLanguages.length} to switch language, S
        to toggle side-by-side
      </p>
    </article>
  );
}

/**
 * Preprocess markdown content to convert {漢字|かんじ} syntax into HTML <ruby> tags.
 * This enables furigana annotations in lyrics.
 * Example: {事切|ことき}れて → <ruby>事切<rp>(</rp><rt>ことき</rt><rp>)</rp></ruby>れて
 */
function preprocessFurigana(content: string): string {
  return content.replace(
    /\{([^|{}]+)\|([^|{}]+)\}/g,
    (_match, base: string, reading: string) =>
      `<ruby>${base}<rp>(</rp><rt>${reading}</rt><rp>)</rp></ruby>`
  );
}

function LyricsPane({
  label,
  content,
  expanded,
}: {
  label: string;
  content: string;
  expanded?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: no-op
    }
  };

  return (
    <div
      className={`rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 ${
        expanded ? "min-h-[60vh]" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {label}
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          title="Copy lyrics to clipboard"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="prose prose-zinc max-w-none leading-relaxed dark:prose-invert prose-p:my-4 prose-p:leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks, remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {preprocessFurigana(content)}
        </ReactMarkdown>
      </div>
    </div>
  );
}
