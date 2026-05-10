import { z } from "zod";

/**
 * Where to draw a piece of text on the certificate template. Coordinates are
 * in pixels relative to the natural template image dimensions, with (0,0) in
 * the top-left.
 *
 * `align` controls how the text is laid out within the bounding box. `font`
 * defaults to a stack that includes a Vietnamese-friendly fallback so
 * diacritics render correctly.
 */
export const textBoxSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  width: z.number().int().min(1),
  height: z.number().int().min(1),
  fontSize: z.number().int().min(8).max(400).default(64),
  minFontSize: z.number().int().min(8).max(400).default(28),
  fontFamily: z
    .string()
    .min(1)
    .default(
      "'Be Vietnam Pro', 'Inter', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
    ),
  fontWeight: z.enum(["400", "500", "600", "700", "800"]).default("700"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/u, "Mã màu phải có dạng #rrggbb.")
    .default("#1f2937"),
  align: z.enum(["left", "center", "right"]).default("center"),
  lineHeight: z.number().min(0.8).max(2.4).default(1.15),
});
export type TextBox = z.input<typeof textBoxSchema>;

/**
 * QR code position. Always rendered as a square; the side length is `size`.
 */
export const qrBoxSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  size: z.number().int().min(40).max(2000),
});
export type QrBox = z.input<typeof qrBoxSchema>;

/**
 * Full template configuration stored in `campaigns.template_config` (jsonb).
 * Coordinates assume the source template has pixel-perfect dimensions; we
 * persist `templateWidth` / `templateHeight` so the renderer can validate
 * that the uploaded template still matches.
 */
export const templateConfigSchema = z.object({
  templateWidth: z.number().int().min(1).optional(),
  templateHeight: z.number().int().min(1).optional(),
  fullName: textBoxSchema,
  studentCode: textBoxSchema,
  verificationCode: textBoxSchema.optional(),
  qrCode: qrBoxSchema.optional(),
});
export type TemplateConfig = z.input<typeof templateConfigSchema>;
export type TemplateConfigParsed = z.output<typeof templateConfigSchema>;

/**
 * Sensible defaults targeting an A4-landscape PNG at 300 DPI (3508 × 2480).
 * Real PDP templates won't match these exactly, but they're a reasonable
 * starting point that admins can tweak in the position-config form.
 */
export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  fullName: {
    x: 504,
    y: 1100,
    width: 2500,
    height: 220,
    fontSize: 130,
    minFontSize: 60,
    color: "#0f172a",
    align: "center",
    fontWeight: "700",
    lineHeight: 1.1,
  },
  studentCode: {
    x: 504,
    y: 1380,
    width: 2500,
    height: 90,
    fontSize: 64,
    minFontSize: 36,
    color: "#475569",
    align: "center",
    fontWeight: "500",
    lineHeight: 1.1,
  },
  verificationCode: {
    x: 200,
    y: 2300,
    width: 1200,
    height: 56,
    fontSize: 28,
    minFontSize: 18,
    color: "#64748b",
    align: "left",
    fontWeight: "400",
    lineHeight: 1.1,
  },
  qrCode: {
    x: 3100,
    y: 2080,
    size: 320,
  },
};
