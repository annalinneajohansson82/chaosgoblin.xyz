# chaosgoblin.xyz — Theme Setup, SCSS + UnoCSS Pipeline

**Date:** 2026-05-24

**Project:** `/home/anna/chaosgoblin.xyz/blog`

**Status:** ✅ Build pipeline complete | 🔨 Brutalist design in progress

---

## Context

The site was initialised with `deno run -A https://lume.land/init.ts --theme=simple-blog`. The theme currently loads via CDN (jsDelivr) as a Lume plugin. No `_includes` directory exists locally; all templates are served from the remote theme (`.vto` format — Lume's native template language). There is no SCSS or UnoCSS pipeline in place.

Goal: bring the theme local for full control, wire up a SCSS + UnoCSS build pipeline, and establish the foundation for a brutalist minimalist visual design.

---

## Implementation Status

### ✅ Completed

- **Theme localized**: `_includes/layouts/` and `_includes/templates/` copied from remote (using `.vto` format instead of `.njk` — Lume's native template language, functionally equivalent)
- **Font system wired**: All 5 variable font files in `/fonts/` with proper `@font-face` declarations
- **Build pipeline**: `_config.ts` updated with `sass()` and `unocss()` plugins; remote `styles.css` disabled to avoid conflicts
- **SCSS architecture**: 
  - `styles/_variables.scss` — @font-face + ds.css custom property overrides (verified against actual ds.css API)
  - `styles/_components.scss` — all theme component styles ported from compiled output
  - `styles/_brutalist.scss` — minimal start (post-title font override only)
- **UnoCSS wired**: `unocss.config.ts` configured with presets, shortcuts, and theme; `uno.css` linked in base template
- **Template updated**: `_includes/layouts/base.vto` includes `<link rel="stylesheet" href="/uno.css">` after `styles.css`; `ds.css` loaded from unpkg
- **Build working**: `deno task serve` produces `_site/styles.css` and `_site/uno.css`; fonts copied to `_site/fonts/`

### 🔨 In Progress / Next

- **Brutalist design iteration**: `_brutalist.scss` is ready to grow with stark borders, spacing adjustments, and structural rules
- **Design system validation**: Test site rendering in browser to verify font loading, spacing, and layout
- **UnoCSS patterns**: Document element-level utility usage patterns (when to use UnoCSS vs SCSS)

---

## Decisions

- **Keep `@lumeland/ds`** as the CSS foundation (loaded from unpkg at page load). Custom SCSS overrides its custom properties rather than replacing it.
- **Keep Vto** templates as-is (no conversion to JSX). The theme uses Lume's native `.vto` format, not Nunjucks.
- **Keep** the dark mode toggle and Pagefind search (both require JS; accepted as exceptions to the zero-JS preference).
- **Use variable font files** (not static variants) for all four font families — one file per family covers all weights.

---

## File Structure

Actual structure in `/home/anna/chaosgoblin.xyz/blog/`:

```
_includes/                          ← copied from theme (Vto templates)
  layouts/
    base.vto                         ← updated with uno.css link
    post.vto
    ... (all theme layout files)
  templates/
    ... (all theme partial files)

fonts/                              ← copied from /home/anna/Chaos Inc/fonts/
  StackSansNotch-VariableFont_wght.ttf
  StackSansHeadline-VariableFont_wght.ttf
  StackSansText-VariableFont_wght.ttf
  RobotoMono-VariableFont_wght.ttf
  RobotoMono-Italic-VariableFont_wght.ttf

styles/
  _variables.scss                   ← @font-face declarations + CSS custom property overrides
  _components.scss                  ← theme component styles ported from built styles.css
  _brutalist.scss                   ← brutalist additions (borders, spacing, structural)

styles.scss                         ← entry point
unocss.config.ts                    ← UnoCSS preset and theme config
```

---

## `_config.ts` Changes

```ts
import lume from "lume/mod.ts";
import blog from "blog/mod.ts";
import sass from "lume/plugins/sass.ts";
import unocss from "lume/plugins/unocss.ts";

const site = lume();

site.use(blog());
site.use(sass());
site.use(unocss({ cssFile: "uno.css" }));

// The blog theme registers a remote styles.css; our styles.scss compiles to the
// same output path. Remove the remote registration so ours is the sole source.
// deno-lint-ignore no-explicit-any
(site as any).fs.remoteFiles.delete("/styles.css");

site.add("styles.scss");
site.copy("fonts");
site.copy("chaos_inc.png");

export default site;
```

**Notes:**
- `site.use(blog())` is retained for non-template wiring (feed generation, data defaults)
- Local `_includes` files take precedence over the plugin's templates automatically
- Remote `styles.css` registration is explicitly deleted to prevent conflicts with our compiled `styles.scss`
- `site.add("styles.scss")` ensures the entry point is watched during dev

---

## SCSS Architecture

### `styles.scss` — entry point

```scss
@use "styles/variables" as *;
@use "styles/components" as *;
@use "styles/brutalist" as *;
```

**Load order:** 
- `ds.css` is loaded separately in the template (`<link rel="stylesheet" href="https://unpkg.com/@lumeland/ds@0.5.2/ds.css">`) before `styles.css`
- `_variables.scss` redefines ds.css custom properties for fonts
- `_components.scss` uses the resolved values
- `_brutalist.scss` adds new structural styles on top

### `styles/_variables.scss`

Contains only:
1. `@font-face` declarations for the four variable font families, pointing to `/fonts/*.ttf`
2. CSS custom property overrides that redefine ds.css variables

Font roles (verified against ds.css):
- `--font-family-display` → Stack Sans Notch (h1, site name — notched letterforms carry the brutalist character)
- `--font-family-ui` → Stack Sans Headline (h2, h3, nav)
- `--font-family-code` → Roboto Mono (code blocks)
- Shorthand composites (`--font-body`, `--font-ui`, `--font-small`) are overridden directly to inject Stack Sans Text for body copy

**Implementation note:** ds.css defines shorthand font properties as composites (size + line-height + family). Body copy uses Stack Sans Text instead of the shared `--font-family-ui`, so the shorthand variables are overridden directly in `:root`.

This file contains only `@font-face` declarations and CSS custom property overrides — no selectors.

### `styles/_components.scss`

Mechanical port of the existing theme component CSS from `_site/styles.css` (`.navbar`, `.postList`, `.page-title`, `.page-header`, `.page-pagination`, etc.). No creative changes — this just gives editable source for what's already rendering.

### `styles/_brutalist.scss`

New brutalist additions: stark `border` declarations, adjusted spacing, structural rules the theme doesn't have. This is where the visual character lives.

**Current state:**
```scss
// Stack Sans Notch reserved for structural/site-level headings
.post-title {
  font-family: var(--font-family-headings);
}
```

This file is ready to grow with stark borders, spacing adjustments, and other structural rules as the design develops.

---

## UnoCSS Integration

**Role:** Utility classes applied directly in template markup for element-level one-offs. Not a replacement for SCSS component styles.

**Rule:** Structural and component styles → SCSS. Element-level tweaks on specific nodes → UnoCSS classes in markup.

### `unocss.config.ts`

```ts
import { defineConfig, presetUno } from "npm:unocss";

export default defineConfig({
  presets: [presetUno()],
  shortcuts: {
    "brutal-border": "border-2 border-black",
    "mono": "font-mono tracking-tight",
  },
  theme: {
    fontFamily: {
      notch: ["'Stack Sans Notch'", "sans-serif"],
      headline: ["'Stack Sans Headline'", "sans-serif"],
      text: ["'Stack Sans Text'", "sans-serif"],
      mono: ["'Roboto Mono'", "monospace"],
    },
    colors: {
      ink: "#0a0a0a",
      chalk: "#f5f5f0",
    },
  },
});
```

UnoCSS outputs `uno.css`. The base template (`_includes/layouts/base.vto`) includes `<link rel="stylesheet" href="/uno.css">` after `styles.css`.

---

## Build Flow

```
deno task serve
  └── blog() plugin            → registers remote theme as fallback; remote styles.css disabled
  └── sass()                   → styles.scss → _site/styles.css (includes @font-face + overrides + components + brutalist)
  └── unocss()                 → scans .vto + .md → _site/uno.css
  └── site.copy("fonts")       → fonts/ → _site/fonts/
  └── site.copy("chaos_inc.png") → chaos_inc.png → _site/chaos_inc.png
```

Templates are served from local `_includes/` with fallback to remote theme plugin (though we have full coverage).

---

## Completed Setup Notes

- ✅ Templates use Vto (Lume's native format) — already correct, no conversion needed
- ✅ ds.css remains on CDN (unpkg) — imported in template, not bundled into styles.css
- ✅ Dark mode toggle and Pagefind search retained (require JS; accepted exceptions)
- ✅ Variable fonts (not static variants) for all families in use

## Next Steps: Brutalist Design Development

Specific visual values (color palette, border weights, spacing scale) are decided and implemented in `_brutalist.scss` as design develops. Current priorities:

1. Test rendering in browser (`deno task serve` → http://localhost:3000)
2. Verify font loading and rendering (Stack Sans Notch for headings, etc.)
3. Begin adding stark borders and spacing rules to `_brutalist.scss`
4. Document UnoCSS utility usage patterns in templates
