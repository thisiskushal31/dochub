# Changelog

## 2026-08-20 — Documentation Hub UI refresh

UI-only update. Existing DocHub behavior is unchanged (search, theme toggle, markdown rendering with Prism/KaTeX/Gists, cache, share/refresh, repository browsing).

### Theme and typography

- Teal primary accent for light and dark themes
- Body and UI text: **Inter**
- Code (inline and blocks): **JetBrains Mono**
- Updated CSS variables, font imports, and Tailwind `fontFamily` config
- Manifest `theme_color` / `background_color` aligned with the dark teal look

### Landing page

- Centered profile intro (avatar, name, title, bio)
- Public profile CTA kept
- Topics shown as card grid; selecting a card opens that repository in DocHub
- Grid background and teal accent styling on the intro section

### Document reading view

- Document header chrome restyled (title, path, share, refresh, GitHub link)
- Markdown body: 16px Inter, softer contrast, max line width for easier reading
- Table of contents label styling updated
- Same load/cache/share/refresh/TOC behavior as before

### Images in markdown

- Figures get a white background so transparent PNG/SVG diagrams stay visible on dark pages
- Applied via image wrapper styles and the markdown renderer

### Files touched

| File | Change |
|------|--------|
| `src/index.css` | Theme tokens, Inter / JetBrains Mono, utilities |
| `src/styles/markdown.css` | Reading styles, image backgrounds |
| `src/components/WelcomeView.tsx` | Landing intro and topic cards |
| `src/components/DocumentView.tsx` | Document chrome layout |
| `src/components/TableOfContents.tsx` | TOC label styling |
| `src/pages/Index.tsx` | Pass `onSelectRepo` into welcome view |
| `src/lib/marked/renderer.ts` | Image wrapper for background styling |
| `src/config/site.json` | Theme color metadata |
| `tailwind.config.ts` | Font families and surface color tokens |

### Not changed

- Sidebar layout and file-tree behavior (sidebar typography experiment was reverted)
- Search, dark/light toggle, GitHub API / local repo loading, caching
- Repository config and content sources
