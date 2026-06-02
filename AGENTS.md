# chaosgoblin.xyz

Personal blog and implicit portfolio. Lume static site, deployed at chaosgoblin.xyz.

## Intent Layer

This project is small enough to keep all context in this single root file. There are no child `AGENTS.md` nodes.

Before modifying any file, read the relevant section below. Before making design or content decisions, read `PRODUCT.md` (brand, audience, positioning, anti-references) and `DESIGN.md` (typography, color, logo, spacing — concrete values).

## What This Is

- **Static blog** built on Lume 3.2.4 + the Simple Blog theme (loaded remotely from `theme-simple-blog@1.16.2`).
- **English-only.** No i18n. `lang: en` in `_data.yml`.
- **Personal voice** — neurodivergent developer writing about AI, code, and information structure. Not a tutorial mill, not a diary, not a CV page. See `PRODUCT.md` for the full positioning.
- **No backend, no JS framework.** Pure SSG.

## Stack

| Layer | Choice |
|---|---|
| Generator | Lume 3.2.4 (Deno) |
| Theme | `theme-simple-blog@1.16.2` via CDN import in `blog/deno.json` |
| Fonts | Google Sans Flex + Google Sans Code via Google Fonts CDN |
| CSS | Inline `<style>` in `_data.yml`'s `extra_head` — no SCSS, no UnoCSS, no local stylesheet pipeline |
| Hosting | (TBD) |

## Entry Points

- `blog/_config.ts` — Lume config. Intentionally minimal: `lume()` + `blog()` plugin + `site.copy("chaos_inc.png")`. Do not add plugins or pipelines here without a clear reason.
- `blog/_data.yml` — Site-wide data. Custom CSS, font links, logo, and meta config live here as the **implementation** of the design spec. Keep this file as the single source for global styling code.
- `blog/deno.json` — Deno tasks and import map. `deno task serve` runs the dev server, `deno task build` produces the static output in `blog/_site/`.
- `blog/posts/` — Markdown blog posts. One file per post. Naming convention: kebab-case slug, no date prefix.
- `blog/pages/` — Static pages (e.g. `about.md`).
- `blog/chaos_inc.png` — Logo. Dark mode inverts it via `filter: invert(1)`, not via a separate file.
- `PRODUCT.md` — Brand identity, audience, positioning, anti-references, design principles. **Read this before making design or content decisions.**
- `DESIGN.md` — Concrete design values (typography, color, logo, spacing). **Authoritative for visual design decisions.** Implementation lives in `blog/_data.yml`.

## Patterns

### Add a blog post
1. Create `blog/posts/<slug>.md` with frontmatter (`title`, `date`, `summary`, optional `tags`, `image`).
2. Done. The theme renders it automatically.

### Add a static page
1. Create `blog/pages/<slug>.md` with frontmatter (`title`, optional `menu` to surface it in nav).
2. Done.

### Adjust global styling
1. Read `DESIGN.md` to confirm the intended value.
2. Edit the `<style>` element in `blog/_data.yml`'s `extra_head` to match.
3. Update `DESIGN.md` if the value diverges from the spec.
4. Re-render and verify in the dev server.
5. If the `<style>` block grows past ~50 lines or develops distinct concerns, split into a dedicated CSS file referenced from `extra_head` — but only then.

### Start the dev server
```bash
cd blog
deno task serve
```
Renders at `http://localhost:3000` and watches for changes.

## Anti-patterns

- **Do not reintroduce SCSS, UnoCSS, or a local stylesheet pipeline.** The previous attempt was deliberately reset. All custom CSS goes in `extra_head`.
- **Do not localize Simple Blog templates** (`_includes/`, etc.) unless absolutely necessary. The remote theme is the source of truth. If you must override a template, document why in the file's header comment and keep the diff minimal.
- **Do not add JS frameworks, build steps, or automation** unless the user asks. Static is the point.
- **Do not add a separate white logo file for dark mode.** The CSS `filter: invert(1)` approach is intentional — broader browser support, simpler maintenance.
- **Do not use the Lume CMS plugin** unless the user requests it.
- **Do not add comments in code** unless the user asks. (No SCSS comments, no inline JS comments, no shell comments.)
- **Do not commit or push without an explicit ask.** Inspect `git status` and `git diff` first, stage only intended files, never commit secrets.

## Global Invariants

- `lang: en` in `_data.yml` — site is English-only. Do not introduce other languages.
- The logo file is `blog/chaos_inc.png`. It is referenced in `_data.yml` as `/chaos_inc.png` because `_config.ts` copies it to the site root.
- All custom CSS lives in `blog/_data.yml` until it outgrows that location. Do not scatter it. Concrete design values are documented in `DESIGN.md`; keep both in sync.
- Dark mode is toggled client-side by the theme (sets `data-theme` on `<html>`). Logo inverts in dark mode; all other styling is handled by the remote theme's own dark mode rules.
- `blog/_site/` is generated output. Gitignored. Never edit it directly.
- `.tmp/`, `.claude/`, `.impeccable/` are tooling/agent cruft and are not tracked.

## Conventions

- **Tone in content:** see `PRODUCT.md` — technical-direct-minimal, witty, honest, personal. Not corporate, not cute.
- **Frontmatter dates:** ISO 8601 (`YYYY-MM-DD`).
- **Slug format:** kebab-case, no date prefix in filenames.
- **Sentence case** in headings and titles, not Title Case.

## Verification

There are no automated tests. The site is verified by:
1. Running `deno task serve` and opening `http://localhost:3000`.
2. Spot-checking the homepage, a post page, the about page, and a dark/light toggle.
3. Running `deno task build` to confirm a clean production build with no errors.

## Related Context

- `PRODUCT.md` — read before any design or content decision.
- `DESIGN.md` — concrete design values; read before any styling change.
- Lume docs: https://lume.land
- Simple Blog theme: https://github.com/lumeland/theme-simple-blog
