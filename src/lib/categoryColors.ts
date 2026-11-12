import { categoryMetadata, type CategoryKey } from "./categoryMetadata";

/* Accessible variants of the category hues (WCAG AA, 4.5:1).
   The raw hues in categoryMetadata.ts stay as they are for dots and borders;
   text and chip colours are derived from them here at build time, moving each
   hue only as far as needed to reach the required ratio. */

const CARD_LIGHT = "#ffffff"; // --color-surface-card
const CARD_DARK = "#2b2b2b"; // --color-surface-card in .dark
const CHIP_DARK_TEXT = "#1c1c1c";
const TARGET = 4.55; // a little above 4.5 so rounding never lands below it

type RGB = [number, number, number];

const toRgb = (hex: string): RGB =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
const toHex = (c: RGB) =>
  "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

const luminance = (c: RGB) => {
  const [r, g, b] = c.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a: string, b: string) => {
  const [l1, l2] = [luminance(toRgb(a)), luminance(toRgb(b))].sort(
    (x, y) => y - x,
  );
  return (l1 + 0.05) / (l2 + 0.05);
};

/** Mixes `hex` towards `towards` in 1% steps until `ok(candidate)` holds. */
const shift = (
  hex: string,
  towards: RGB,
  ok: (candidate: string) => boolean,
) => {
  const from = toRgb(hex);
  for (let t = 0; t <= 1.0001; t += 0.01) {
    const candidate = toHex(
      from.map((v, i) => v + (towards[i] - v) * t) as RGB,
    );
    if (ok(candidate)) return candidate;
  }
  return toHex(towards);
};

export type CategoryColors = {
  /** text colour on a light card */
  text: string;
  /** text colour on a dark card */
  textDark: string;
  /** chip background */
  chipBg: string;
  /** chip text colour (white or near-black, whichever needs the smaller change) */
  chipFg: string;
};

export function getCategoryColors(category: CategoryKey): CategoryColors {
  const hue = categoryMetadata[category].color;

  const text = shift(hue, [0, 0, 0], (c) => contrast(c, CARD_LIGHT) >= TARGET);
  const textDark = shift(
    hue,
    [255, 255, 255],
    (c) => contrast(c, CARD_DARK) >= TARGET,
  );

  // Hues that read well with dark text (amber, yellow, teal...) keep their colour;
  // the rest get the smallest darkening that makes white text pass.
  const darkTextWorks = contrast(hue, CHIP_DARK_TEXT) >= TARGET;
  const chipBg = darkTextWorks
    ? hue
    : shift(hue, [0, 0, 0], (c) => contrast("#ffffff", c) >= TARGET);
  const chipFg = darkTextWorks ? CHIP_DARK_TEXT : "#ffffff";

  return { text, textDark, chipBg, chipFg };
}
