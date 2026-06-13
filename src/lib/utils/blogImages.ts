import type { ImageMetadata } from "astro";

export type ImageLoader = () => Promise<{ default: ImageMetadata }>;

// Blog images live in src/images/blog (optimized-only: originals never ship
// in dist). Site chrome (logo, favicon) stays in public/images and is served
// verbatim. Frontmatter keeps the historical "/images/..." paths; this maps
// them to whichever location holds the file.
const srcImages = import.meta.glob("/src/images/blog/**/*.{jpeg,jpg,png,gif}");
const publicImages = import.meta.glob("/public/images/**/*.{jpeg,jpg,png,gif}");

export const resolveImage = (path: string): ImageLoader | undefined => {
  return (srcImages[`/src${path}`] ?? publicImages[`/public${path}`]) as
    | ImageLoader
    | undefined;
};
