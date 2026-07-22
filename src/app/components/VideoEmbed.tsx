"use client";

/**
 * Extracts a YouTube video ID from various URL formats.
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/shorts/
 */
function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);

    // youtube.com/watch?v=VIDEO_ID
    if (
      (parsed.hostname === "www.youtube.com" ||
        parsed.hostname === "youtube.com") &&
      parsed.pathname === "/watch"
    ) {
      return parsed.searchParams.get("v");
    }

    // youtu.be/VIDEO_ID
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }

    // youtube.com/embed/VIDEO_ID
    if (
      (parsed.hostname === "www.youtube.com" ||
        parsed.hostname === "youtube.com") &&
      parsed.pathname.startsWith("/embed/")
    ) {
      return parsed.pathname.split("/")[2] || null;
    }

    // youtube.com/shorts/VIDEO_ID
    if (
      (parsed.hostname === "www.youtube.com" ||
        parsed.hostname === "youtube.com") &&
      parsed.pathname.startsWith("/shorts/")
    ) {
      return parsed.pathname.split("/")[2] || null;
    }
  } catch {
    return null;
  }

  return null;
}

interface VideoEmbedProps {
  url: string;
}

export default function VideoEmbed({ url }: VideoEmbedProps) {
  const youtubeId = extractYouTubeId(url);

  if (youtubeId) {
    return (
      <div className="relative w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
        style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      </div>
    );
  }

  // Non-YouTube URL — render as external link
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2 text-sm text-blue-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-blue-400 dark:hover:bg-zinc-800"
    >
      <span>▶</span>
      <span>Watch source video</span>
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}
