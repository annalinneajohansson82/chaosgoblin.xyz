# Design System

Single source of truth for visual design values. Implementation lives in `blog/styles.css`, linked from `extra_head` in `blog/_data.yml`.

When changing a value, update **both** this file and `blog/styles.css` to keep them in sync.

For design *intent* and *principles*, see `PRODUCT.md` (why it looks this way). This file is *what* it looks like.

## Typography

**Families:**
- Display, UI, Headings, Body: **Google Sans Flex**
- Code: **Google Sans Code**
- Fallbacks: `sans-serif` (Flex) / `monospace` (Code)

**Source:** Google Fonts CDN.
- Flex variation axes: `opsz` 6–144, `wght` 1–1000
- Code variation axes: `wght` 300–800, `MONO` axis

**Sizes** (responsive, `clamp()`):
- Body: `1rem` → `1.125rem` (5vw scaling)
- Small: `0.85rem` → `0.9rem` (4vw scaling)

**Line heights:**
- Body: `1.6`
- Small: `1.4`

**Weights:**
- Body bold: `600`
- Extra bold (titles): `900`

## Color

**Base:** Monochrome — nearly-white / nearly-black. Concrete values TBD.

**Accent:** A single pop color, used sparingly.
- Candidates: warm turquoise, hot pink/red
- Decision: TBD

## Logo

- File: `blog/chaos_inc.png` (referenced as `/chaos_inc.png` in `_data.yml`)
- Height: `160px` (desktop, applied with `!important` on `.site-logo`)
- Width: `auto`
- **Dark mode:** inverted via `filter: invert(1)` on `[data-theme="dark"] .site-logo`. No separate white file.

## Spacing

TBD — needs visual testing before values are committed.

## Hierarchy

- `.post-title`, `.page-title`: `font-weight: 900` (extra bold)
- Body and UI: default weights from the remote theme

## Implementation

All values are CSS custom properties and minimal overrides in `blog/styles.css`, linked from `extra_head` in `blog/_data.yml`. Organized by concern: typography, logo, hierarchy, and page-specific sections. No SCSS, no build pipeline, no JS framework.

## Accessibility

- WCAG 2.2 AA floor — see `PRODUCT.md` for the underlying principles
- Color contrast targets: AA (4.5:1 for body text)
- Reduced motion: respect `prefers-reduced-motion`
- Keyboard navigation: native browser + remote theme defaults
- Dark mode: handled by the remote theme; logo inverts via CSS filter (see Logo section)

## Related

- `PRODUCT.md` — design principles, anti-references, accessibility intent
- `blog/styles.css` — implementation (must mirror this file)
- `AGENTS.md` — patterns for editing
