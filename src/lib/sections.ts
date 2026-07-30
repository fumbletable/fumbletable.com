/*
 * The site's four sections — single source of truth.
 *
 * A post's `categories` frontmatter holds exactly one of these names.
 * `tags` carry topics. Nav, section pages and the archive all read from here,
 * so adding or renaming a section is a one-file change.
 *
 * Replaced the old video-era taxonomy (Reviews / Resources / OSWR /
 * Olde Swords Reign / Methodology / How To / Mutant Mondays) on 2026-07-30
 * when the site pivoted from YouTube companion posts to writing.
 */
export interface Section {
  /** URL slug — the page lives at /{slug} */
  slug: string;
  /** Value stored in a post's `categories` frontmatter */
  name: string;
  /** Nav label */
  label: string;
  /** Page h1 */
  heading: string;
  /** Italic standfirst under the h1, and the meta description */
  intro: string;
}

export const SECTIONS: Section[] = [
  {
    slug: 'play',
    name: 'Play',
    label: 'Play',
    heading: 'Play',
    intro: "What actually happened at the table — session reports, campaign journals, and the bits that didn't go to plan.",
  },
  {
    slug: 'reading',
    name: 'Reading',
    label: 'Reading',
    heading: 'Reading',
    intro: "Other people's games, adventures and zines. What's in them, and whether I can actually run them.",
  },
  {
    slug: 'making',
    name: 'Making',
    label: 'Making',
    heading: 'Making',
    intro: 'The games and tools I build — Olde Swords Reign, and whatever else is on the workbench.',
  },
  {
    slug: 'method',
    name: 'Method',
    label: 'Method',
    heading: 'Method',
    intro: 'How I actually run games. Prep that survives contact with the table, written for a brain that cannot picture anything.',
  },
];

export const SECTION_BY_NAME = new Map(SECTIONS.map((s) => [s.name, s]));

/** The section a post belongs to, or undefined if its category is unrecognised. */
export function sectionOf(categories: string[] | undefined): Section | undefined {
  for (const c of categories || []) {
    const hit = SECTION_BY_NAME.get(c);
    if (hit) return hit;
  }
  return undefined;
}

/**
 * Strip the markdown syntax that would otherwise show up verbatim in a card
 * description — auto-extracted excerpts come from raw body text, so a line
 * containing **bold** or a [link](url) would render with its punctuation.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')        // images — drop entirely
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')     // links — keep the label
    .replace(/`([^`]+)`/g, '$1')                 // inline code
    .replace(/(\*\*|__)(.*?)\1/g, '$2')          // bold
    .replace(/(?<!\w)([*_])(?=\S)(.+?)(?<=\S)\1(?!\w)/g, '$2') // italic
    .replace(/^>\s*/g, '')                       // blockquote marker
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Card/list description for a post: an explicit excerpt wins, then a subtitle,
 * then the first substantial line of the body.
 */
export function excerptFor(
  data: { excerpt?: string; subtitle?: string },
  body: string | undefined,
  limit = 180
): string {
  if (data.excerpt) return data.excerpt;
  if (data.subtitle) return data.subtitle;

  const line = body
    ?.split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 30 && !l.startsWith('#') && !l.startsWith('<') && !l.startsWith('!['));

  return line ? stripMarkdown(line).slice(0, limit) : '';
}
