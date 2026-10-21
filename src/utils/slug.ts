const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

/** Turn marked's escaped heading text back into the characters the outline sees. */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (match, code: string) => {
      const value = Number(code);
      return Number.isFinite(value) ? String.fromCodePoint(value) : match;
    })
    .replace(/&#x([0-9a-f]+);/gi, (match, code: string) => {
      const value = Number.parseInt(code, 16);
      return Number.isFinite(value) ? String.fromCodePoint(value) : match;
    })
    .replace(/&([a-z]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

/**
 * Heading id shared by the rendered note and the "On this page" outline.
 * Apostrophes and ampersands are escaped in HTML (`&#39;`, `&amp;`) and must be
 * decoded before punctuation is removed, or the two ids will not match.
 */
export function slugifyHeading(text: string): string {
  const plain = decodeHtmlEntities(text.replace(/<[^>]*>/g, ''));

  return plain
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
