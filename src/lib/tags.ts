/**
 * Convert a tag to a filesystem-safe slug.
 * Replaces characters that are invalid in Windows filenames: * ? " < > |
 *
 * This is in a separate file (not lyrics.ts) because it's imported
 * by client components (TagChip) and cannot depend on Node.js `fs`.
 */
export function tagToSlug(tag: string): string {
  return tag
    .replace(/[*?"<>|]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
