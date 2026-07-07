# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-04 — Archives page structure
- The archives page (`archives.md`) maintains a hand-curated tag cloud (div.tag-cloud) and a set of manually maintained `## Section` lists. Both must be kept in sync when adding new topics.
- Tag cloud anchor hrefs use lowercase, hyphenated versions of the section headings (e.g., `#ai`, `#vs-code-extensions`).
- Posts without relevant tags should not be placed in a section just to fill it — remove misplaced entries rather than leave noise (e.g., "Visual Studio Marketplace Metrics" was TFS/VSTS marketplace content, not a VS Code extension).
- Prefer removing duplicates silently rather than normalising — keep the first occurrence, drop the trailing duplicate.

### 2026-03-24 — Blog post review: Work IQ MCP + ADO automation
- Marcus's voice: direct, first-person, confessional honesty about real workflow pain. Not thought-leadership. Compare to VPN Toggle post for tone baseline.
- AI-voice red flags to watch: "straightforward", "genuinely useful", "the preferred tool chain", "It's the difference between X and Y" closers, and "complementary, not competing" framing.
- Marcus likes dry humor that comes from real situations — not puns, not forced. Self-deprecating asides land well.
- Front matter pattern for 2026 posts: includes `description`, `thumbnail-img`, `nav-short: true`.
- Tags [AI, Azure DevOps] are valid per the tag slug normalization decisions.
- When reviewing claims about evolving products (Copilot Cowork, MCP tool names), flag time-sensitive assertions for the author rather than silently passing them.

### 2026-06-16 — De-AI editing pass (vibe analytics post)
- Marcus's #1 mandate: posts must read human-written, not AI-generated. This overrides polish/SEO advice. When a "fix" would make prose smoother/more quotable, skip it.
- Biggest AI tell in long posts: every section ending on a punchy mic-drop/aphorism ("does more damage than no number at all", "a brilliant demo", "still the job"). Fix: keep only one or two of the best across the whole post; let most sections end on a plain, ordinary sentence. Vary the rhythm so it isn't engineered.
- Other tells removed: rule-of-three triads baked into sentences (break to two or four items occasionally); "not just X, but Y" / "it's not about X, it's about Y" constructions (rewrite as plain statements); over-balanced symmetrical sentence pairs where both halves mirror (make one half lopsided); throat-clearing transitions ("What I didn't appreciate", "Here's the thing"); em-dash-for-drama (this post had none — don't add them).
- Reconciled a number contradiction (intro "a tenth" vs takeaways "easy 20%") by aligning intro to "a fifth of the work". Always grep a post for its own internal stats before shipping.
- A named-then-forgotten proper noun (the "Report Whisperer" agent name) reads like marketing fanfare; cutting it and calling it "the agent" was more natural than forcing a second mention.
- Tag confirmed: `GitHub Copilot` slugs to existing `ai` slug per decisions.md, so adding it is zero-cost and safe. Never add a new multi-word tag without a slug mapping.
- Saved a reusable checklist to `.squad/skills/de-ai-prose/SKILL.md`.

### 2026-07-06 — [Scribe] Blog redesign changed the post reading experience (type system)

- The blog was redesigned to "distinctive editorial" (dark-only), implemented and staged for Marcus's review. What matters for content work: **post titles now render in Fraunces** (a display serif) — long, punchy titles read differently in a serif than in the old sans, so eyeball a new title's wrap. **Body copy is Inter** at a ~68–72ch measure; **code is JetBrains Mono** (terminal-chrome blocks preserved). The **single accent is orange `#f97316`**, used only for links/focus and a short kicker rule above `h1`/`h2` — don't expect per-heading color variety anymore.
- Full record in `.squad/decisions.md` ("Blog Redesign — Distinctive Editorial, Dark-Only"). No copy/IA rewrites were part of this pass — the hero copy and post content are unchanged.
