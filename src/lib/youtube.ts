/**
 * Extracts a YouTube video ID from various URL formats.
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/shorts/
 */
export function extractYouTubeId(url: string): string | null {
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

    // youtube.com/embed/VIDEO_ID or youtube.com/shorts/VIDEO_ID
    if (
      (parsed.hostname === "www.youtube.com" ||
        parsed.hostname === "youtube.com") &&
      (parsed.pathname.startsWith("/embed/") ||
        parsed.pathname.startsWith("/shorts/"))
    ) {
      return parsed.pathname.split("/")[2] || null;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Get YouTube thumbnail URL from a video URL.
 * Returns mqdefault (320x180) for card thumbnails.
 * Returns null if the URL is not a valid YouTube URL.
 */
export function getYouTubeThumbnail(
  url: string,
  quality: "maxresdefault" | "hqdefault" | "mqdefault" | "default" = "mqdefault"
): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}
