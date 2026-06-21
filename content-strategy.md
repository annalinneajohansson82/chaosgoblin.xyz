# Content Strategy: chaosgoblin.xyz

> Based on: `about.md` (Anna's own writing), `PRODUCT.md` (positioning), `AGENTS.md` (project invariants), current post content, site structure audit.

---

## 1. Thesis

**The one-sentence thesis that ties ND + AI + code together:**

> A brain wired to compulsively structure information isn't broken for data work — it's optimized for it.

**Expanded (for internal use, not published verbatim):**

The dominant AI discourse frames itself around two poles: techno-optimism ("AI will save us") and existential fear ("AI will destroy us"). Both miss the boring, essential middle — the information-structuring work that makes AI systems actually function. That middle is data governance, taxonomies, metadata schemas, ontology design, accessibility compliance. And those are exactly the tasks that an autistic/ADHD brain — one that *cannot stop* categorizing, pattern-matching, and building structure out of chaos — is inherently good at.

The thesis isn't "neurodivergence is a superpower" (too cute). It's: **the skills required to make AI systems comprehensible, governed, and accountable are the same skills that a brain with ADHD/autism develops as survival mechanisms.** The disability and the profession are structurally aligned.

**The unasked question it answers:** "What does Anna actually believe about AI that the current discourse gets wrong?" — That the real AI problem isn't alignment or sentience, it's *information architecture*. Before AI can be safe, its data has to be structured. Before it can be accountable, its provenance has to be tracked. That's not glamorous. It's necessary. And it's exactly what this brain is built for.

---

## 2. Existing Post Audit

| Post | Verdict | Why |
|---|---|---|
| *Hyperfocus as a Debugging Tool* | **Rewrite** | Concept is fine. Execution is generic — reads like a Medium post from "ADHD in Tech" feed. No specific debugging story, no personal code example, no *Anna* in it. |
| *Documentation as External Working Memory* | **Rewrite** | Strongest concept of the three — the "documentation as accommodation" angle is genuinely good. But it's written in generic platitudes. Needs a real example: a specific system Anna documented, a specific time it saved her, the actual decision log format she uses. |
| *Naming Things Clearly Saves Cognitive Load* | **Rewrite** | Weakest of the three. The "naming is hard" take is tired and the post doesn't say anything beyond what every programmer already knows. The ADHD angle is tacked on. Could merge its useful insight (verbose naming as accommodation) into the Documentation post instead. |

**Recommendation:** Delete or archive all three. Write 2-3 new posts from scratch in Anna's real voice. Do not try to "fix" the existing ones — the gap between AI-generated placeholder voice and Anna's actual voice (direct, fragmenty, attitude at the end, specific) is too wide to bridge with edits.

---

## 3. Minimum Viable Launch Posts (Write in 1-2 Days)

### Post 1: *The Information-Shaped Hole* (or similar)

**Hook:** "I spent 14 years as a web developer before realizing what I actually liked about it wasn't the code."

**Content:** Reframe the career story from the about page as a post. The journey from "I'm a web dev" to "oh, the part I actually loved was structuring data, not writing code" to "at 42 I learned why." Implicitly demonstrates: systems thinking, self-awareness, ability to reframe failure modes as strengths.

**Why this first:** It's the most personal, most distinctive, and directly addresses the recruiter audience. It's also easiest to write since Anna already wrote it in compressed form on the about page.

**Recruiter takeaway:** "This person understands their own cognitive profile well enough to know exactly which work suits them. They're not randomly applying — they have a thesis about their own career."

### Post 2: *The Unsexy Middle of AI*

**Hook:** "Everyone's arguing about whether AI will save us or destroy us. I'm over here wondering who's going to build the taxonomies."

**Content:** The thesis post. Data governance is the boring, essential work that makes AI safe and accountable. Taxonomies, metadata schemas, provenance tracking — these aren't side tasks, they're the work. Neurodivergent pattern-seeking is an advantage here, not a distraction.

**Why this second:** It's the site's intellectual anchor. This is the post that makes a recruiter think "this person has a clear, informed take on the field."

**Recruiter takeaway:** "This person understands the real bottlenecks in data/AI work. They're not caught up in hype. They know what the job actually involves."

### Post 3 (optional, if time): *The Accommodation That Looks Like Best Practice*

**Hook:** "The thing I do that looks like excellent engineering discipline is actually a coping mechanism. It works either way."

**Content:** Merge the best ideas from the existing Documentation and Naming posts. How Anna documents as external memory, how verbose naming is an accommodation that also produces better code. End with: "the line between disability accommodation and best practice is thinner than most people think."

**Why third (lower priority):** Interesting but less distinctive than the first two. Could also become a section within Post 1.

---

## 4. Homepage

### Current state
- No `blog/index.md` exists
- `_data.yml` has `home.welcome:` with empty value
- Theme renders a default blog-roll homepage (list of post titles)
- No tagline, no intro text, no explicit thesis statement

### Recommended homepage structure

The Simple Blog theme supports a `welcome` message in `_data.yml` rendered before the post list. That's the primary hook. The homepage should:

1. **Show the logo + tagline immediately** (already works via `_data.yml` logo config)
2. **Punchy welcome message** (set in `_data.yml` home.welcome):
   > A neurodivergent developer thinking out loud about AI, information structure, and the places where code meets cognition.
3. **One-sentence thesis as subtitle** (visible right below the welcome):
   > A brain wired to compulsively structure information isn't broken for data work — it's optimized for it.
4. **Post list below** (theme default) — so returning visitors see new content immediately

**Implementation:** Add welcome text to `_data.yml`:

```yaml
home:
  welcome: |
    <p class="home-tagline">A neurodivergent developer thinking out loud about AI, information structure, and the places where code meets cognition.</p>
    <p class="home-thesis">A brain wired to compulsively structure information isn't broken for data work — it's optimized for it.</p>
```

Style the thesis in `styles.css`:

```css
.home-thesis {
  font-weight: 900;
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  max-width: 36em;
  line-height: 1.4;
}
```

**Alternative (bolder):** Create `blog/index.md` as a static page rather than using the `welcome` field, giving full control over the layout. But `welcome` is simpler and respects the theme's pagination system.

---

## 5. About Page Refinements

### Current strengths
- Authentic voice (this is Anna's actual writing — keep it as-is)
- Clear career narrative arc (14 years dev → realized what I liked ≠ code → diagnosis → reframe)
- Strong craft section with photos (humanizes the author, demonstrates patience and precision)
- Ends well with clear direction: "looking for roles in data governance, IA, admin"

### Gaps / Improvements

| Gap | Fix | Priority |
|---|---|---|
| No explicit bridge between craft section and professional pitch | Add one sentence connecting craft to profession: *"The same patience for detail that goes into assembling a curiosity cabinet goes into building a metadata schema — and the result is equally meant to outlast me."* | **High** — recruiters need to connect the dots |
| GitHub/LinkedIn links are only in the nav, not on the page | Add inline links in the body: *"I'm [on LinkedIn](https://linkedin.com/in/annalinnea) and [GitHub](https://github.com/annalinneajohansson82)."* before the craft break | **Medium** — makes it easy for recruiters to click without hunting |
| No explicit call to action | Add one: *"If that sounds like someone you'd want on your team, I'd like to hear from you."* or similar. Subtle, not pushy. | **Medium** — gives the page purpose beyond biography |
| About page is the only "pitch" page | Optional: a separate `/work` or `/now` page listing what Anna's looking for specifically (remote/hybrid, industry preferences, etc.) | **Low** — can wait until launch |

### Recommended edits to about.md

The page is 90% done. Three targeted additions:

1. After "that's an actual skill." (line 15): add the bridge sentence
2. Before the craft section (line 23): add LinkedIn/GitHub links
3. At the end (after line 31): add a soft CTA

---

## 6. Content Voice: What Anna's Posts Sound Like vs. The AI-Generated Ones

### AI-generated voice (current posts)
- Safe, generic, Medium-optimized
- Complete sentences, no fragments
- Balanced conclusions, no attitude
- "The irony isn't lost on me that..." — nobody talks like this
- Reads like a LinkedIn thought-leader post
- Every paragraph explains itself fully, no trust in the reader

### Anna's voice (from about.md)
- Opens direct: no warm-up, no throat-clearing
- "Raah! 😉" — personality, not polish
- "at 42 I finally understood" — conversational, specific
- Fragments: "Shaped and battle-hardened..." — runs on purpose
- Ends with attitude: "preferably somewhere that treats accessibility and social utility as actual priorities rather than things that happen at the end if there's time."
- Trusts the reader to follow: doesn't explain things that don't need explanation
- Uses specific numbers: "14 years," "at 42," descriptive detail

### Voice guidelines for new posts
1. **First sentence carries weight.** No warm-up. Start where the interesting part starts.
2. **Specificity over generality.** Name the CMS (WordPress), name the framework, name the year. Abstract platitudes are the enemy.
3. **Let sentences breathe.** Short declarative next to long reflective. Fragments allowed. Full stops do work.
4. **End with teeth.** Not "and that's why documentation matters" — end on an observation, a jab, or a question. Let the reader sit with it.
5. **Trust the reader.** Don't explain the metaphor. If someone doesn't get "curiosity cabinet as metadata schema," they're not the target audience.
6. **No corporate hedging.** Say what you think. If it's an opinion, own it.

---

## 7. Content Pipeline: Effort Estimates

| Item | Effort | Priority | Dependencies |
|---|---|---|---|
| Rewrite Post 1 ("The Information-Shaped Hole") | ~2 hours | **P0 — launch blocker** | None (Anna's own material, mostly adapting about.md) |
| Rewrite Post 2 ("The Unsexy Middle of AI") | ~3 hours | **P0 — launch blocker** | Thesis finalized (done above) |
| Homepage welcome text in `_data.yml` | ~15 min | **P0 — launch blocker** | None |
| About page refinements (3 edits) | ~30 min | **P1 — polish** | None |
| CSS for homepage thesis styling | ~15 min | **P1 — polish** | Welcome text written |
| Post 3 (optional) | ~2 hours | **P2 — nice to have** | Posts 1-2 done |
| Remove/archive old posts | ~10 min | **P1 — before launch** | New posts written |
| Meta description for SEO | ~10 min | **P1 — before launch** | Thesis finalized |
| `/now` or `/work` page | ~1 hour | **P2 — post-launch** | About page finalized |

**Total launch effort (P0+P1): ~6 hours** over 1-2 days, producing:
- 2 strong new posts in real voice
- Refreshed about page with recruiter-friendly tweaks
- Homepage with visible thesis and tagline
- No traces of AI-generated placeholder content

---

## 8. Post-Launch Content Ideas (Future Pipeline)

These can be written at a slower cadence (1-2 per month) to build the site out:

1. **"My Taxonomy of Taxonomies"** — A meta-post about how Anna categorizes things (could include a real taxonomy she built). Demonstrates IA skills directly.
2. **"What WCAG Audits Taught Me About Thinking"** — Accessibility as a thinking framework, not a checklist. Bridges ND + professional skill.
3. **"The Chaos Goblin Manifesto"** — What the name means (if Anna wants to explain it). Personal, brand-building, but optional.
4. **"I Don't Actually Know What 'AI Safety' Means"** — A skeptical, thoughtful take on the term. Demonstrates critical thinking.
5. **A post about a specific craft project** — The heron plaque, the stag. How making things with hands relates to making structures with data. Could include process photos.
6. **"On Being 42 and Getting Diagnosed"** — More personal than the about page allows. Could be genuinely moving and shareable.

---

## 9. Summary Checklist for Launch

- [ ] Write Post 1 (from Anna's career story)
- [ ] Write Post 2 (thesis: unsexy middle of AI)
- [ ] Delete or archive 3 placeholder posts
- [ ] Add `home.welcome` text to `_data.yml`
- [ ] Add CSS for `.home-thesis` to `styles.css`
- [ ] Add bridge sentence to about.md (craft → profession)
- [ ] Add LinkedIn/GitHub inline links to about.md
- [ ] Add soft CTA to about.md
- [ ] Set `metas.description` in `_data.yml` for SEO
- [ ] Build site (`deno task build`) and verify homepage+about+posts render cleanly
- [ ] Open `http://localhost:3000` and spot-check
