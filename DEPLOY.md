# Deployment Plan: chaosgoblin.xyz

> Target: live at **chaosgoblin.xyz** within 1–2 days.
> Status as of 2026-06-18: build works, no homepage, no hosting, no `_config.ts`, no CI/CD.

---

## 0. Pre-deploy Blockers (Must Fix Before Deploying)

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

### Cloudflare Pages Build Configuration

| Setting | Value |
|---|---|
| **Framework preset** | None (static HTML) |
| **Build command** | `curl -fsSL https://deno.land/install.sh | sh && /opt/buildhome/.deno/bin/deno task build` |
| **Build output directory** | `_site` |
| **Root directory** | `blog` (because the Lume project is in `blog/`) |
| **Production branch** | `main` |

### Alternative (if Cloudflare DNS is not an option): Netlify

```toml
# blog/netlify.toml
[build]
  publish = "_site"
  command = "curl -fsSL https://deno.land/install.sh | sh && /opt/buildhome/.deno/bin/deno task build"
  base = "blog"
```

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

## 4. Build Pipeline

### Option A: GitHub Actions (Recommended for Cloudflare Pages)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4

      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x

      - name: Build site
        working-directory: blog
        run: deno task build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy blog/_site --project-name=chaosgoblin-xyz
```

### Option B: Cloudflare Pages Native (No GitHub Action)

Connect the GitHub repo directly in Cloudflare Pages dashboard. Cloudflare handles the build + deploy natively. Simpler setup but less visibility into builds locally.

**Build config in dashboard:**
- Build command: `curl -fsSL https://deno.land/install.sh | sh && /opt/buildhome/.deno/bin/deno task build`
- Build output: `_site`
- Root directory: `blog`

### Option C: Local Deploy Script (Manual)

For emergencies or when you don't want CI:

```bash
# deploy.sh
#!/bin/bash
set -e
cd blog
deno task build
npx wrangler pages deploy _site --project-name=chaosgoblin-xyz
```

**Recommended path:** **Option B (Cloudflare Pages native)** for minimum setup complexity, **Option A (GitHub Actions)** for more control and visibility.

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

## 6. Technical Blockers Summary

| # | Blocker | Status | Priority | Dependency |
|---|---|---|---|---|
| 1 | No `_config.ts` | ❌ Not created | 🔴 Must fix | Blocks 2, blocks deploy |
| 2 | No homepage (`index.html`) | ❌ Missing from build | 🔴 Must fix | Depends on 1 |
| 3 | favicon.png is 4.5MB | ❌ Too large | 🟡 Should fix | None |
| 4 | No RSS/Atom feeds | ❌ Likely not generated | 🟡 Should fix | Depends on 1 |
| 5 | `/tags/` returns 404 | ❌ Broken | 🟡 Should fix | Depends on 1 |
| 6 | Anti-pattern files not cleaned | ❌ Untracked | 🟡 Should fix | Before deploy |
| 7 | DNS not configured | ❌ Not set up | 🔴 Must fix | Depends on hosting choice |
| 8 | Cloudflare Pages project | ❌ Not created | 🔴 Must fix | Depends on DNS |
| 9 | GitHub secrets for CI | ❌ Not configured | 🟡 Should fix | Depends on pipeline choice |

---

## 7. Execution Plan (Ordered)

### Day 1 — Foundation (~2 hours)

| Step | Action | Time |
|---|---|---|
| 1.1 | Create `blog/_config.ts` with blog plugin + site.copy() | 10 min |
| 1.2 | Build and verify `_site/index.html` appears | 5 min |
| 1.3 | Resize favicon.png to 32×32 | 5 min |
| 1.4 | Delete anti-pattern files (SCSS, UnoCSS, fonts, _cms.ts, localized includes, chaos_inc_white.png) | 15 min |
| 1.5 | Add tooling dirs to `.gitignore` | 5 min |
| 1.6 | Verify `/tags/` works; create `blog/tags.md` if needed | 10 min |
| 1.7 | Delete stale branch | 1 min |
| 1.8 | Update blog posts from AI-generated to real Anna voice (optional but recommended before public) | 2–4 hrs |

### Day 1-2 — Infrastructure (~1 hour)

| Step | Action | Time |
|---|---|---|
| 2.1 | Create Cloudflare account if needed; add chaosgoblin.xyz to Cloudflare DNS | 15 min |
| 2.2 | Update nameservers at registrar to Cloudflare | 10 min (DNS propagation: 1–24h) |
| 2.3 | Create Cloudflare Pages project; connect GitHub repo | 10 min |
| 2.4 | Configure build command + output dir in Cloudflare dashboard | 5 min |
| 2.5 | Set custom domain in Cloudflare Pages | 5 min |
| 2.6 | Trigger first deploy (push to main or manual) | 5 min |
| 2.7 | Verify site is live at chaosgoblin.xyz | 5 min |

### Day 2 — CI/CD (~30 minutes)

| Step | Action | Time |
|---|---|---|
| 3.1 | Create Cloudflare API token with Pages write permission | 5 min |
| 3.2 | Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to GitHub secrets | 5 min |
| 3.3 | Create `.github/workflows/deploy.yml` | 10 min |
| 3.4 | Push to main; verify CI runs and deploys | 10 min |

---

## 8. Post-Deploy Checklist

- [ ] Visit `https://chaosgoblin.xyz` — homepage renders
- [ ] Visit a post — `/posts/adhd-debugging-hyperfocus/` 
- [ ] Visit `/about/`
- [ ] Test dark mode toggle
- [ ] Verify `/tags/Engineering/` works
- [ ] Verify `/feed.xml` and `/feed.json` return valid content
- [ ] Check favicon in browser tab
- [ ] Test mobile layout (responsive nav, hamburger menu)
- [ ] Check Lighthouse score (performance, accessibility, SEO)
- [ ] Verify SSL certificate (auto-provisioned by Cloudflare)
- [ ] Test `www.chaosgoblin.xyz` redirects to apex

---

## 9. Cost Analysis

| Service | Cost | Notes |
|---|---|---|
| Domain registration (chaosgoblin.xyz) | ~$10–15/yr | Already purchased |
| Cloudflare Pages (free tier) | $0/mo | 500 builds/mo, unlimited bandwidth |
| Cloudflare DNS | $0/mo | Included |
| GitHub | $0/mo | Public repo |
| **Total ongoing** | **<$2/mo** | Just the domain renewal |

---

## 10. Rollback Plan

If something goes wrong with a deploy:

1. **Cloudflare Pages dashboard**: Go to **Deployments** → find the last working deployment → **View** → **Rollback to this deployment**
2. **Git revert**: `git revert HEAD && git push origin main` triggers a new build of the previous state
3. **Emergency DNS**: Point CNAME to a static S3 bucket or a simple "under maintenance" page

Cloudflare Pages keeps all previous deployments; rollback is instantaneous.
