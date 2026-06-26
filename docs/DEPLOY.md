# Deployment: chaosgoblin.xyz

> **Status (2026-06-26):** Live at **chaosgoblin.xyz**. Cloudflare Pages connected to GitHub. Auto-deploys from `main` branch on every push.

---

## 0. Pre-deploy Blockers (Must Fix Before Deploying) — ✅ Resolved

These are things that will either break the published site or produce an embarrassing first impression. Fix in order.

### 0.1 🔴 No `_config.ts` — Lume config file is missing entirely

**Severity:** HIGH  
**What's wrong:** AGENTS.md documents `blog/_config.ts` with `lume() + blog() plugin + site.copy("chaos_inc.png")` but the file does not exist on disk or in git. The build currently succeeds because Lume 3 runs with defaults, but:
- The `blog()` plugin may not be fully configured (affects tag pages, pagination, RSS feeds)
- `site.copy("chaos_inc.png")` is not happening — the logo won't appear in production builds
- No output directory or URL configuration

**Fix:** Create `blog/_config.ts`:
```ts
import lume from "lume/mod.ts";
import blog from "blog/mod.ts";

const site = lume({
  location: new URL("https://chaosgoblin.xyz"),
});

site.use(blog());

site.copy("chaos_inc.png");
site.copy("favicon.png");
site.copy("uploads");

export default site;
```

**Effort:** ~10 minutes. **Dependency for everything below.**

### 0.2 🔴 No homepage (`_site/index.html` doesn't exist)

**Severity:** HIGH  
**What's wrong:** The build output has no `index.html` at root — just 404.html, /pages/about/, and 3 posts. Visitors hitting `chaosgoblin.xyz` will get a 404 or blank page.

**Root cause:** Likely the missing `_config.ts` (the `blog()` plugin generates the homepage), or no `index.md` in `blog/`.

**Fix:** After creating `_config.ts`, verify `_site/index.html` appears. If not, create `blog/index.md`:
```markdown
---
title: chaosgoblin.xyz
---
```

(The Simple Blog theme's archive/post-list template should handle rendering.)

**Effort:** ~5–15 minutes.

### 0.3 🟡 favicon.png is 4.5 MB (2048×2048)

**Severity:** MEDIUM  
**What's wrong:** `favicon.png` is 4.5MB — a 2048×2048 image. Browsers will download this on every page load. Standard favicon should be 32×32–64×64 and < 50KB.

**Fix:** Resize to 32×32 or use a minimal SVG favicon:
```bash
# Option A: downsample with ImageMagick
convert blog/favicon.png -resize 32x32 blog/favicon.png
# Option B: create a simple SVG favicon
```

**Effort:** ~5 minutes.

### 0.4 🟡 Missing `_config.ts` means no RSS/Atom feed generation

**Severity:** MEDIUM  
**What's wrong:** The base.vto template links to `/feed.xml` and `/feed.json` for RSS discovery. With no `_config.ts` configuring the `blog()` plugin, these feeds likely don't exist.

**Fix:** Fixed by 0.1 — the `blog()` plugin generates feeds by default.

**Effort:** 0 (covered by 0.1).

### 0.5 🟡 `/tags/` returns 404 — no aggregate tag index

**Severity:** LOW-MEDIUM  
**What's wrong:** Per-tag pages work (`/tags/<name>/`) but there's no `/tags/` index page linking them.

**Fix:** After `_config.ts` is in place, this may be resolved by the `blog()` plugin. If not, create `blog/tags.md`:
```markdown
---
title: Tags
layout: layouts/archive.vto
---
```

**Effort:** ~5 minutes.

### 0.6 🟢 Stale branch `feature/responsive-header-nav` (1 commit ahead of main, mergable)

**Severity:** LOW  
**Action:** Can be pruned. No content changes needed. `git branch -d feature/responsive-header-nav`

**Effort:** 1 minute.

---

## 1. Anti-Pattern Cleanup (Files to Delete Before Deploy)

These are untracked files that should not go into the repo or the build. Some are from previous iterations, some are tooling cruft.

### Files to delete immediately

| File/Dir | Reason |
|---|---|
| `blog/styles.scss` | Anti-pattern: no SCSS build pipeline. All CSS is in `styles.css`. |
| `blog/styles/_variables.scss` | Same — SCSS cruft |
| `blog/styles/_components.scss` | Same — SCSS cruft |
| `blog/styles/_brutalist.scss` | Same — SCSS cruft |
| `blog/unocss.config.ts` | Anti-pattern: no UnoCSS. |
| `blog/_cms.ts` | Previously removed intentionally; resurfaced as untracked. Do not reintroduce. |
| `blog/_includes/templates/` | Localized remote theme templates — only `base.vto` override is intentional. These may conflict with remote theme updates. |
| `blog/_includes/layouts/page.vto` | (as above) |
| `blog/_includes/layouts/post.vto` | (as above) |
| `blog/_includes/layouts/archive.vto` | (as above) |
| `blog/_includes/layouts/archive_result.vto` | (as above) |
| `blog/fonts/` | Local font files — Google Fonts are loaded via CDN. These are dead weight. |
| `blog/chaos_inc_white.png` | Anti-pattern: no separate white logo. Dark mode uses `filter: invert(1)`. |
| `.agents/` | Tooling cruft — ignore globally |
| `.claude/` | Tooling cruft — ignore globally |
| `handoffs/` | Internal agent handoffs — not for the repo |
| `skills-lock.json` | Tooling lockfile — not for the repo |

### Update `.gitignore`

```gitignore
_site/
.agents/
.claude/
handoffs/
skills-lock.json
*.scss
unocss.config.ts
_cms.ts
fonts/
chaos_inc_white.png
```

**Effort:** ~15 minutes.

---

## 2. Hosting Infrastructure Recommendation

### ⭐ Recommended: Cloudflare Pages

**Why Cloudflare Pages wins for this project:**

| Criteria | Cloudflare Pages | Netlify | S3 + CloudFront |
|---|---|---|---|
| Free tier | ✅ Unlimited sites, unlimited requests | ✅ 100GB bandwidth/mo | ❌ S3: ~$0.023/GB + CF: $0.085/GB |
| Deno build support | ✅ Custom build command with curl+deno | ✅ Custom build command | ❌ Must build locally then upload |
| Custom domain | ✅ Free, one-click SSL | ✅ Free, one-click SSL | ✅ Free (Route53) but manual setup |
| Builds/min | 500/mo (free) | 300 min/mo (free) | N/A (manual) |
| CDN | ✅ Global (330+ PoPs) | ✅ Global | ✅ Global (CloudFront) |
| Preview deploys | ✅ Per branch | ✅ Deploy previews | ❌ Manual |
| DNS management | ✅ Cloudflare DNS | ⚠ Separate DNS provider | ✅ Route53 (but costs) |
| Setup complexity | ★☆☆ (10 min) | ★☆☆ (10 min) | ★★★ (1 hr) |

**Cloudflare Pages** is the clear winner: free tier is generous, custom domain + SSL is included, and the Deno build step works with a one-liner.

### Cloudflare Pages Build Configuration (Active — set via API)

| Setting | Value |
|---|---|
| **Framework preset** | None (static HTML) |
| **Build command** | `deno task build` |
| **Build output directory** | `_site` |
| **Root directory** | `blog` (where `deno.json` and `_config.ts` live) |
| **Production branch** | `main` |
| **Git integration** | GitHub (`annalinneajohansson82/chaosgoblin.xyz`) |
| **Preview deploys** | Disabled |

> Deno is pre-installed in Cloudflare Pages build images — no need to curl-install it.

---

## 3. Domain DNS Setup

### Domain registrar: chaosgoblin.xyz

**Required DNS changes (Cloudflare):**

1. Add chaosgoblin.xyz to Cloudflare DNS
2. Update nameservers at registrar to Cloudflare's NS records
3. Add DNS records:

| Type | Name | Value | Proxy |
|---|---|---|---|
| CNAME | @ | `chaosgoblin.xyz.pages.dev` | Proxied (orange cloud) |
| CNAME | www | `chaosgoblin.xyz.pages.dev` | Proxied |

4. In Cloudflare Pages dashboard, set custom domain to `chaosgoblin.xyz`

### If NOT using Cloudflare DNS (Netlify route):

| Type | Name | Value |
|---|---|---|
| A | @ | `75.2.60.5` (Netlify's LB IP) |
| A | @ | `99.83.190.102` (Netlify's LB IP) |
| CNAME | www | `chaosgoblin.xyz.netlify.app` |

And configure the custom domain in Netlify Site settings.

**Effort:** 30 minutes (DNS propagation can take 1–24h).

---

## 4. Build Pipeline — ✅ Cloudflare Pages Native (Active)

The GitHub repo is connected directly in Cloudflare Pages. Cloudflare handles build + deploy natively on every push to `main`.

No GitHub Actions workflow needed — the native Git integration is simpler and already running.

### Manual deploy (emergency fallback)

```bash
# deploy.sh
#!/bin/bash
set -e
cd blog
deno task build
npx wrangler pages deploy _site --project-name=chaosgoblin-xyz
```

---

## 5. CI/CD Pipeline

### Minimum viable pipeline

| Stage | What it does | Required? |
|---|---|---|
| **Build** | Runs `deno task build` | ✅ Yes |
| **Deploy** | Uploads `_site/` to Cloudflare Pages | ✅ Yes |
| **Post-deploy** | RSS/cache invalidation | ❌ Nice-to-have |

### Full pipeline (recommended)

```yaml
name: CI/CD
on: [push]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
      - run: deno lint
        working-directory: blog

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
      - run: deno task build
        working-directory: blog
      - uses: actions/upload-pages-artifact@v3
        with:
          path: blog/_site

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: [build]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-pages-artifact@v3
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy _site --project-name=chaosgoblin-xyz
```

### Secrets to configure in GitHub

| Secret | Source | Used by |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → API Tokens | Deploy step |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → right sidebar | Deploy step |

**Effort:** 30 minutes for CI + secrets setup.

---

## 6. Technical Blockers Summary — ✅ All Resolved

| # | Blocker | Status |
|---|---|---|
| 1 | No `_config.ts` | ✅ Created |
| 2 | No homepage (`index.html`) | ✅ Built |
| 3 | favicon.png too large | ✅ Resolved (SVG favicon) |
| 4 | No RSS/Atom feeds | ✅ Generated |
| 5 | `/tags/` returns 404 | ✅ Resolved |
| 6 | Anti-pattern files | ✅ Cleaned |
| 7 | DNS not configured | ✅ Cloudflare DNS + Pages |
| 8 | Cloudflare Pages project | ✅ Created + connected to GitHub |
| 9 | GitHub secrets for CI | ✅ Not needed (native Git integration) |

## 7. Execution Plan — ✅ Complete

All deployment infrastructure is live. Next deployments happen automatically on push to `main`.

### How auto-deployment works

1. Push to `main` on GitHub
2. Cloudflare Pages catches the webhook
3. Clones the repo, cd's into `blog/`
4. Runs `deno task build` → output goes to `_site/`
5. Deploys the built files to chaosgoblin.xyz + chaosgoblin-xyz.pages.dev
6. Done in ~30-60 seconds

### Rollback

In Cloudflare dashboard → Pages → chaosgoblin-xyz → Deployments → pick a previous deployment → **Rollback**. Instant.
