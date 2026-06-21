# Ubiquitous Language

## Site structure

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **site** | The complete published artifact at chaosgoblin.xyz | "blog" (when meaning the whole project), "project" |
| **Lume project** | The Deno/Lume source tree rooted at `blog/` | "blog directory", "the blog folder" |
| **build output** | The generated static files in `blog/_site/` | "dist", "output", "compiled site" |
| **dev server** | Local preview server started with `deno task serve`, listening at `localhost:3000` | "local server", "development environment" |

## Content

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **post** | A dated, tagged piece of writing in `blog/posts/` | "article", "entry", "blog post" (redundant) |
| **page** | A non-dated static content file in `blog/pages/` | "static page", "standalone page" |
| **slug** | The kebab-case URL identifier for a post or page (no date prefix) | "URL", "filename", "path" |
| **frontmatter** | The YAML block at the top of a post or page that provides metadata | "metadata", "YAML header" |
| **tags** | Keywords attached to a post via frontmatter for thematic grouping | "categories", "labels" |

## Navigation and layout

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **header** | The full sticky top bar: logo, nav links, social icons, and dark mode toggle | "navbar", "navigation bar", "top bar" |
| **nav** | The set of navigation links within the header | "menu", "navigation", "links" |
| **overlay** | The full-screen menu panel that opens when the hamburger is activated | "hamburger menu", "mobile menu", "drawer", "overlay nav" |
| **hamburger** | The icon button that toggles the overlay; visible on mobile always, on desktop when scrolled | "menu icon", "burger", "toggle button" |
| **scroll-shrink** | The CSS behavior that reduces logo height and header padding once the page is scrolled | "sticky behavior", "scroll effect", "shrink on scroll" |
| **social icons** | The circular LinkedIn and GitHub icon links grouped in the right side of the header | "icon links", "social links", "social buttons" |
| **dark mode toggle** | The button that switches between light and dark themes; rightmost in the header | "theme toggle", "light/dark switch" |

## Design system

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **design spec** | `DESIGN.md` — the authoritative document for all visual values | "design tokens", "design system doc", "design values" |
| **implementation** | `blog/styles.css` — where the design spec is expressed as CSS; linked from `extra_head` in `blog/_data.yml` | "styles", "CSS block" |
| **extra_head** | The `_data.yml` key whose value is injected into each page's `<head>` — contains the stylesheet link and font imports | "head block", "inline styles", "style block" |
| **custom override** | A locally-defined change that supersedes a remote theme default | "theme override", "local override", "customization" |

## Theme

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **remote theme** | `theme-simple-blog@1.16.2` loaded via CDN — the upstream source of templates and base CSS | "Simple Blog", "the theme" (without "remote") |
| **template** | A `.vto` (Vento) file that defines a page layout; may be remote or a local override | "layout", "view" |
| **template override** | A local `.vto` file in `blog/_includes/` that replaces a corresponding remote theme file | "localized template", "local layout" |

## Roles

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **author** | The site owner, Anna — the person writing posts and making design decisions | "user" (when in product context), "I", "owner" |
| **reader** | A person visiting the site to read content | "visitor", "user" (avoid: collides with dev usage) |
| **recruiter** | The primary intended reader; a tech employer evaluating the author's professional profile | "hiring manager" (secondary distinction — both are "recruiter" as a role) |

## Relationships

- A **post** belongs to zero or more **tags**; a **tag** groups one or more **posts**.
- The **design spec** (`DESIGN.md`) is the single source of truth; the **implementation** (`blog/styles.css`) must mirror it.
- A **template override** replaces exactly one **remote theme** template file; it must document why in a header comment.
- The **overlay** and the inline **nav** share the same DOM `<ul>` — CSS controls which presentation is active, not separate HTML.

## Example dialogue

> **Dev:** "The **header** isn't shrinking on mobile — is that a **scroll-shrink** issue or a **custom override** conflict?"

> **Author:** "Check the **implementation** in `extra_head`. The **scroll-shrink** class is applied to the **header** via JS — make sure the selector isn't scoped to desktop only."

> **Dev:** "Found it. The `.navbar--scrolled` rule only targeted `≥769px`. Fixed. Should I update the **design spec** too?"

> **Author:** "No — **scroll-shrink** behavior is in the **design spec** only as a logo height value. The breakpoint is an **implementation** detail."

> **Dev:** "Got it. While I'm here — the **overlay** closes on link click but not on **hamburger** re-tap. Is that a bug?"

> **Author:** "Yes. The **hamburger** should toggle the **overlay** closed too. Fix it in the **template override** — don't touch the **remote theme**."

## Flagged ambiguities

- **"blog"** was used to mean three different things: the site as a whole ("the blog"), the Lume project directory (`blog/`), and the content type. Canonical terms: **site** (the whole), **Lume project** (the source tree), **post** (the content type). "Blog" should only appear in `blog/` directory paths and the `blog()` plugin call.
- **"design tokens"** appeared in the handoff document as a label for `DESIGN.md`. This conflicts with the established CSS design-token pattern (CSS custom properties). The correct term is **design spec**.
- **"theme"** was used for both the **remote theme** (Simple Blog) and for the conceptual light/dark color scheme. In navigation and CSS contexts, **dark mode** refers to the color scheme; **remote theme** refers to the Simple Blog template system.
- **"user"** was used in `PRODUCT.md` for site visitors and implicitly in dev conversation for the author. Use **reader** for visitors and **author** for the site owner. Reserve "user" for system/authentication contexts, which this project doesn't have.
- **"source of truth"** was applied to both `DESIGN.md` ("single source of truth for visual values") and the **remote theme** ("source of truth" for templates). Both usages are valid but in different scopes: `DESIGN.md` is authoritative for values; the **remote theme** is authoritative for markup structure. Context determines which is meant — be explicit.
