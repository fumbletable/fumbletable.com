# Fumble Table Website — Project Status

**Repo:** `D:\Documents\Sites\fumbletable-new\`
**Stack:** Astro + Tailwind v4
**Domain:** fumbletable.com (currently pointing to Jekyll blog on GitHub Pages)
**Design mockups:** `brain/temp/fumble-table-site-*.html` (5 pages)
**Brand:** `brain/context/fumble-table/brand.md`

---

## What's Built

All 5 page layouts matching the design mockups:

| Page | Route | Status |
|------|-------|--------|
| Home | `/` | Hero card, 2-col post grid, OSWR callout, about strip |
| Archive | `/archive` | Search, category filters, full post list |
| Post | `/posts/[slug]/` | Header, lite YouTube embed, drop cap, related posts |
| About | `/about` | Hero, story, What I Cover, philosophy, connect cards |
| OSWR | `/oswr` | Hero with CTA, features, Get the Game, video grid |

**Content:** 50+ markdown posts migrated from Jekyll blog.

**Key features:**
- Auto YouTube extraction — first YouTube iframe promoted to full-width section above body
- Lite YouTube embed — loads maxresdefault thumbnail, click to play (no iframe until interaction)
- Local thumbnail support — `image:` frontmatter field overrides YouTube CDN
- Search + category filter on archive page (client-side JS)
- Related posts generated from shared categories
- Mobile responsive (hamburger menu, stacked grids)

---

## What's Needed Before Launch

### High Priority

- [ ] **Post thumbnails** — Most posts show dark placeholders. In progress in separate window (2026-04-03). Template approach using asymmetric panel design from brand session.
- [x] **GTM snippet in HTML** — GTM-NDTKXDLG installed in Base.astro (head + noscript) @done(2026-04-03)
- [ ] **GA4 tag in GTM** — GA4 Configuration tag with G-K50D1YRR90 needs creating in GTM container. API rate-limited; do manually in GTM UI.
- [x] **RSS feed** — `@astrojs/rss` installed, endpoint at `src/pages/rss.xml.ts` @done(2026-04-03)
- [ ] **Deployment** — Decision: Vercel (consistent with Beacon stack). Needs GitHub repo created first, then Vercel project linked.
- [x] **Mobile QA** — Tested at 375px. All pages stack correctly, hamburger menu works, text readable. Screenshots at `qa-mobile-*.png` @done(2026-04-03)

### Medium Priority

- [x] **Old URL redirects** — 20 Jekyll URLs redirect via `[...redirect].astro` using `redirect_from` frontmatter. HTML meta-refresh approach (works on any host) @done(2026-04-03)
- [x] **Sitemap** — `@astrojs/sitemap` installed, auto-generates `sitemap-index.xml` @done(2026-04-03)
- [x] **robots.txt** — Updated to fumbletable.com with correct sitemap path @done(2026-04-03)
- [ ] **Open Graph images** — No OG images set. Generate or use post thumbnails.
- [x] **404 page** — "Critical Fumble" themed page with brand styling and back link @done(2026-04-03)
- [x] **Cookie consent** — GDPR banner with Accept/Decline, localStorage persistence, dataLayer consent event @done(2026-04-03)
- [ ] **Categories/Tags pages** — Functional but not styled to match new design.
- [ ] **Favicon** — `.ico` copied from brain assets. SVG favicon needs updating to match brand.

### Low Priority / Content

- [ ] **Post subtitles** — Optional `subtitle:` field adds editorial polish below post titles. Add to key posts over time.
- [ ] **Post excerpts** — Optional `excerpt:` field improves card descriptions. Auto-extracted from body if not set.
- [ ] **Product cards** — Optional `product:` frontmatter for review posts (name, creator, link).
- [ ] **Verdict boxes** — Optional `verdict:` frontmatter for "Bottom Line" section on reviews.
- [ ] **Performance audit** — PageSpeed Insights after deploy. Image optimization.

---

## GTM / Tracking Setup

**Damien created accounts manually (2026-04-03):**

| Item | Value |
|------|-------|
| GTM Container | GTM-NDTKXDLG |
| GA4 Stream | fumbletable.com |
| GA4 Stream ID | 5258325608 |
| GA4 Measurement ID | G-K50D1YRR90 |

**Status:**
- [x] GTM snippet in Base.astro (head + noscript)
- [ ] GA4 Configuration tag in GTM (manual — API rate-limited, see improve queue)
- [x] Cookie consent banner with dataLayer consent event
- [ ] Verify in GA4 real-time after deploy

---

## Content Schema

Posts support these frontmatter fields:

```yaml
---
title: "Post Title"              # Required
date: 2026-01-29                 # Required
categories: ["Reviews"]          # Optional, array
tags: [osr, free]                # Optional, array
image: /img/posts/thumb.png      # Optional — local thumbnail (overrides YouTube CDN)
subtitle: "Editorial subtitle"   # Optional — italic text below title
excerpt: "Card description"      # Optional — used in post cards (auto-extracted if missing)
video: "https://youtube..."      # Optional — explicit video URL (auto-extracted from body if missing)
verdict: "Get it. It's free."    # Optional — Bottom Line box on post page
product:                         # Optional — reviewed product card
  name: "Maze Rats"
  creator: "Ben Milton"
  link: "https://..."
  linkText: "Get it on DriveThruRPG"
downloads:                       # Optional — free downloads section
  - name: "NPC Reference Card"
    url: "/downloads/npc-card.pdf"
    format: "PDF"
    size: "1 page"
---
```

---

## Thumbnail Workflow

1. Save thumbnail PNG/JPG to `/public/img/posts/`
2. Add `image: /img/posts/filename.png` to post frontmatter
3. Used on: post page video section, home page cards, archive list, related posts

Posts without `image:` fall back to YouTube CDN (sddefault → maxresdefault upgrade).

---

## Technical Notes

- **Google Fonts via `<link>` tags, NOT CSS `@import`** — Vite strips CSS @import for remote URLs. This caused the entire site to render in Georgia instead of Lora/Playfair Display. Documented in brain memory.
- **Pixel values, not rem** — All spacing uses exact pixel values (`px-[40px]`, `gap-[32px]`) because the 17px base font-size causes rem drift (~6%) from mockup values.
- **`a { color: inherit }` must be in `@layer base`** — Otherwise it overrides Tailwind utility classes like `text-ivory` on links (unlayered CSS beats `@layer utilities`).
- **Heading `line-height` not set globally** — Mockups rely on inherited body line-height for some headings. Each component sets its own.

---

## File Structure

```
src/
  components/
    FeaturedPost.astro    — Hero card on home page
    PostCard.astro        — Thumbnail + text card for grids
  content/
    posts/                — 50+ markdown files
  layouts/
    Base.astro            — Header, footer, font loading, GTM (when added)
    Post.astro            — Full post page layout
  pages/
    index.astro           — Home page
    about.astro           — About page
    oswr.astro            — OSWR page
    archive.astro         — All posts with search/filter
    posts/[...slug].astro — Individual post pages
    categories/           — Category pages (redirect + per-category)
    tags/                 — Tag pages
  styles/
    global.css            — Tailwind + brand tokens + prose styles
public/
  img/
    logo-on-light.png     — Header/footer logo
    logo-on-dark.png      — Dark background logo
    icon-amber.png        — Amber d20 icon
    posts/                — Post thumbnails (add here)
  favicon.ico
  favicon.svg
  CNAME                   — fumbletable.com
  robots.txt              — fumbletable.com (updated)
```

---

## Lessons for Website Service Process (2026-04-03)

FT is the reference implementation for a repeatable "client site delivery" service. This section captures what happened during the build so the service discovery session has real data, not theory.

### What went smoothly
- **Stack template works.** Clone `_template`, wire brand tokens, build pages. The Astro + Tailwind v4 foundation is solid.
- **Content migration was straightforward.** Jekyll markdown → Astro content collection with minimal frontmatter changes.
- **Standard packages (RSS, sitemap) are plug-and-play.** `@astrojs/rss` and `@astrojs/sitemap` — install, configure, done.
- **Redirect system for old URLs.** `redirect_from` frontmatter + catch-all route generates HTML meta-refresh pages. Works on any host.
- **Mobile responsiveness.** Built mobile-first, QA'd at 375px. No major issues.
- **Parallel workstreams.** Thumbnails and site infrastructure ran in separate Claude windows without blocking each other.

### What caused friction
- **GTM/GA4 account creation is manual.** Damien had to create the GTM container and GA4 property in the UI, then paste IDs back. No automation for "create a new web property from scratch."
- **GTM API rate limits.** Couldn't configure the GA4 tag via API — persistent rate limit on the Google Cloud project. Had to fall back to manual GTM UI setup. Script exists but couldn't run.
- **No standard form solution.** Beacon uses Apps Script → Google Sheet. FT doesn't have a contact form yet, but a client site would. Where do submissions go? Client email? Shared system? Unanswered.
- **DNS/domain management is ad-hoc.** FT domain is at the registrar pointing to GitHub Pages. Switching to Vercel means DNS changes. No central process for this.
- **Account registry gap.** GTM container ID, GA4 measurement ID, Vercel project — none of these have a standard place to live in accounts.json. The PPC accounts are well-tracked; web properties aren't.
- **No deployment playbook.** "Vercel or GitHub Pages?" came up mid-session. Should be a decided-in-advance default for the standard stack.
- **Cookie consent was hand-built.** Works, but it's inline HTML/JS in Base.astro. A reusable component or standard approach would save time on the next site.

### Decisions made
- **Standard stack going forward:** Astro + Tailwind v4 + Vercel. Sun Rooms (Next.js) flagged for migration.
- **Jekyll is valid for SRD/docs sites** (OSWR, Magic & Myth). Different purpose, different stack.
- **FT build paused for service process research.** Ad-hoc task-ticking replaced by: design the process first → build FT through the process → refine.
- **Website service needs Scout framework discovery.** Not a technical SOP — a service definition (who's it for, what's included, what does it cost, what's the delivery pipeline).

### Open questions for service discovery
1. What's included in a "standard" site build vs what's extra?
2. Who manages the domain? Client owns it, we configure it? We manage it?
3. Form submissions — where do they go? What's the default?
4. How do web property accounts (GTM, GA4, Vercel, domain) get tracked?
5. What does ongoing maintenance look like? Is it part of the retainer or separate?
6. How does this connect to the existing Google Ads client relationship?
7. What's the pricing model? Fixed project fee? Part of monthly retainer?
