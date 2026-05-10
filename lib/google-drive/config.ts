/**
 * Drive integration runtime config + scope constants. Kept separate from
 * `oauth.ts` so server code can `import` it without dragging in window-only
 * type declarations.
 */

/**
 * `drive.file` scope: only files created by this OAuth client are visible
 * to it. The user does NOT grant the app access to their entire Drive.
 * This is the least-privilege scope Google offers and the right choice for
 * a per-school certificate uploader.
 *
 * https://developers.google.com/identity/protocols/oauth2/scopes#drive
 */
export const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

/**
 * True when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is defined at runtime. Both the
 * client and the server can import this — `process.env.NEXT_PUBLIC_*` is
 * inlined at build time so it works in both contexts.
 */
export function isGoogleDriveConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
}
