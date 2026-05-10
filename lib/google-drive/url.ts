/**
 * Helpers for building Google Drive sharing URLs from a file ID.
 *
 * Drive doesn't return canonical view/download URLs in its file metadata, but
 * the URL formats are stable as long as the file is shared "Anyone with the
 * link can view". For M9 (manual-upload MVP) we simply derive the URLs from
 * the file ID — the admin pastes a manifest of `filename, file_id` and we
 * compute the rest.
 */

const FILE_ID_RE = /^[A-Za-z0-9_-]{10,}$/;

/**
 * Validate that a string is a plausible Drive file ID. Drive IDs are URL-safe
 * base64-ish; the SDK's `id` field is typically 25–44 chars but we accept
 * anything ≥10 chars matching the alphabet to keep this forgiving.
 */
export function isValidDriveFileId(value: string): boolean {
  return FILE_ID_RE.test(value);
}

/**
 * Build the canonical "view" URL — opens the Drive preview in a new tab.
 * Works for any file shared "Anyone with link" without OAuth.
 */
export function buildDriveViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Build the canonical "download" URL — triggers a browser download of the
 * file (no Drive UI). Useful for the "Tải về (PNG)" button on /lookup.
 */
export function buildDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Try to extract a file ID from a Drive URL the admin may have pasted
 * instead of a raw ID. Supports the common URL shapes:
 *
 *   https://drive.google.com/file/d/{ID}/view
 *   https://drive.google.com/file/d/{ID}/edit
 *   https://drive.google.com/open?id={ID}
 *   https://drive.google.com/uc?id={ID}
 *
 * Returns the ID, or null if no plausible ID was found.
 */
export function extractFileIdFromUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Pattern 1: /file/d/{ID}/...
  const m1 = /\/file\/d\/([A-Za-z0-9_-]{10,})/.exec(trimmed);
  if (m1) return m1[1];

  // Pattern 2: ?id={ID} or &id={ID}
  const m2 = /[?&]id=([A-Za-z0-9_-]{10,})/.exec(trimmed);
  if (m2) return m2[1];

  // Otherwise — maybe the value already IS a raw ID?
  if (isValidDriveFileId(trimmed)) return trimmed;

  return null;
}
