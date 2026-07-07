# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Core Context

Condensed pre-2026-07-06 design learnings (full detail in git history):

- **2026-03-04 — Archives design spec:** per-tag accent colors with deliberate hue separation for the Microsoft-adjacent tags (azure-devops / windows / vs-code-extensions); light accents need `color:#111` on the active pill; sticky filter bar = `position:sticky` + `backdrop-filter:blur` + semi-transparent bg (verify `top` against nav height); `max-height` + `opacity` is the right filter transition; empty state needs `aria-live="polite"`; the `data-tag` attribute on `.archive-tag` spans is the prerequisite for pill tinting.
- **2026-03-05 — Full CSS redesign (the palette/type foundation):** replaced Lora + Open Sans with **Inter** (body + 700–800 headings) + **JetBrains Mono** (code); accent `#008aff` blue → **`#f97316` orange** (rare on dark in this space, signals confidence); flat bg → **`#0d1117` GitHub-dark** with three depth levels (`#161b22` / `#1c2128`); 1px card borders + directional hover accent; post `h1` clean orange bottom-border (not the old gradient); **terminal-style code blocks** (`.highlight::before` ●●● chrome) — the signature element. Always grep hardcoded hex when doing a palette swap.
- **2026-03-06 — Navbar utility items:** brand left, primary nav center, social/utility chips as a smaller trailing cluster (lower-contrast at rest, save the accent for hover); on mobile keep brand + menu only and move the same social destinations into the drawer at 44px targets.

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-07-06 — Impeccable Critique + Redesign Direction (read-only discovery pass)

**Current design tokens discovered — there are TWO competing token layers (split-brain):**

- `assets/css/blog.css` `:root` (the "real" system): `--page-col #0d1117` (GitHub dark), `--text-col #e6edf3`, `--link-col`/`--accent-col #f97316` (amber-orange), `--hover-col #fb923c`, surfaces `--card-bg #161b22` / `--card-image-placeholder #1c2128`, `--mid-col #8b949e`, borders `#30363d`. Fonts: `--body-font` + `--header-font` = Inter, `--mono-font` = JetBrains Mono. Full per-tag accent palette (azure-devops #0078d4, cicd #f8d57e, playwright #2dba8a, git #f05033, github-actions #3fb950, ai #c678dd, …).
- `_includes/head.html` inline `<style>` (a parallel, older system): a SECOND `:root` with `--accent #4f9cff` (blue), `--accent-grad` purple→blue gradient (`#5d3bff→#2491ff→#19c6ff`), `--home-accent #f97316`, a separate `--text-primary/secondary/tertiary/faint` ramp, glass tokens (`--glass-bg`, `--glass-border`), radii, plus `body.modern { font-family:'Open Sans'… }`, a `radial-gradient` page background and an animated `sheen` veil (mix-blend-mode overlay).
- Type scale: body 17px / line-height 1.75; post `h1` clamp(1.8–2.6rem) wght 800; hero `h1` clamp(2.15–3.25rem) wght 780; fluid `clamp()` throughout. Layout: sticky glass navbar → homepage `hero-grid` (intro + glass "Pulse" panel w/ KPI stat boxes) → auto-fill card grid; posts sit in Bootstrap-4 grid inside stacked `.container-md` cards. Theme is **dark-only** (forced `html.dark-theme`, no light mode, no `prefers-color-scheme`).

**Verified gotcha (proven in-browser):** `body.modern` forces body `font-family:'Open Sans'`, but Open Sans is **never loaded** (base.html only requests Inter + JetBrains Mono). Computed body font is `system-ui / Segoe UI` **site-wide** — the 2026-03-05 Inter *body* migration is silently defeated; only headings actually render Inter. This makes consolidating head.html → blog.css a correctness fix, not cosmetics.

**Critique verdict — PARTIAL AI-slop (mixed).** The post reading experience is genuinely strong and hard to attribute to an AI: terminal-chrome code blocks (dots + language label + copy button) with a well-tuned syntax theme, plus confident bold Inter headings with orange underlines. The chrome around it is where the AI tells live: the homepage "📊 Pulse" panel (emoji headings + "53 Posts / 10+ Years Blogging" KPI stat boxes) is a textbook AI-dashboard bolted onto a personal blog; pervasive glassmorphism (nav/drawer/hero/archives/footer all `backdrop-filter: blur`), a radial-gradient background + animated sheen veil, and vestigial blue/purple-gradient tokens; card-on-card post layout (header card + body card); and a redundant "READ POST →" chip on every card that is already a full link.

**What works (keep):** terminal code blocks + syntax theme; bold Inter heading typography; the intentional nav utility cluster (Archives pill + lighter social chips + ⌘K).

Concept anchor set: **"Engineer's field notes, not a dashboard."** Full discovery draft was filed to the inbox (later **superseded** by my editorial spec — see next entry); new skill `css-token-audit` captures how to spot/cure a split token system.

### 2026-07-06 — Distinctive Editorial Spec (Marcus's checkpoint direction)

Marcus made the direction call at the checkpoint: **NOT** restrained refinement — go **"distinctive editorial,"** with personality from **type + layout rhythm + the single orange accent**, NOT from re-adding glass/gradients/KPI widgets. Dark-only. Pulse → quiet Popular list (plain links, no counters/emoji). This *reconciles* with Keaton's scope draft: that draft assumed "quieter" (written before the checkpoint); Marcus overrode the **direction**, not the **guardrails**. Both still remove the AI-slop chrome. Full build-ready spec was filed as `fenster-editorial-spec.md` (**supersedes** my earlier `fenster-redesign-direction.md`); both are now merged into `.squad/decisions.md`. New skill: `editorial-dark-theme`.

**Display font decision — Fraunces (Google Fonts variable), title-voice only.**
- **Chose Fraunces** (high-contrast old-style display serif, `opsz` axis) over the AI-defaults Playfair Display ("editorial") and Space Grotesk ("techie") — both anti-references. It reads like an engineering *magazine* (Increment-style serif-display-over-sans-body), pairs with Inter by genuine **structure contrast** (serif + grotesque), and is one performant variable woff2 (Latin, `display:swap`). Keep `WONK`/`SOFT` at `0` defaults so it stays credible, not quirky. Runner-up: **Newsreader** (quieter, more text-like) if Marcus wants less contrast.
- **Scope = titles only:** hero headline, post `h1`, featured card title. Everything else stays **Inter** (sections `h2`–`h4`, body, UI, meta, index cards); code stays **JetBrains Mono**. Reserving the serif keeps its impact high and technical content scannable.
- Google Fonts add: `family=Fraunces:opsz,wght@9..144,400..600` (upright only; editorial italics reuse the already-loaded Inter italic 400).

**Final token spec (source of truth is §9 of the editorial-spec, now in `decisions.md`):**
- Fonts: `--font-display` Fraunces · `--body-font`/`--header-font` Inter · `--mono-font` JetBrains Mono.
- Surfaces: `--page #0d1117` / `--surface-raised #161b22` / `--surface-inset #1c2128`; lines `--border #30363d` / `--border-soft rgba(255,255,255,.06)`. Depth from hairlines, not blur/shadow.
- Text (AA-verified): primary `#e6edf3` · secondary `#c9d1d9` · muted `#8b949e` (the **AA floor** — retires `#7f93a2`, footer `#6d8394` at 4.4/4.1:1, and `#8cafc8`). Orange text passes AA (6.75:1 on page).
- Accent: `--accent #f97316` (links/focus/active/kicker only) · `--accent-hover #fb923c` · `--accent-wash rgba(249,115,22,.10)`. Killed: blue `#4f9cff`, `--accent-grad`, `--home-*` glass, radial bg, `sheen`, `pulse-glow`, `body.modern{font-family:'Open Sans'}`.
- Type scale: hero `clamp(2.5rem,1.7rem+3.6vw,4rem)`/520 · post-title `clamp(2.1rem,1.5rem+2.7vw,3.25rem)`/560 · featured `clamp(1.7rem,1.2rem+2vw,2.5rem)`/540 · h2 `…1.9rem`/700 · h3 `…1.45rem`/650 · h4 `1.05rem`/600 · body `1.0625rem`/1.7 @ **68–72ch** · meta `0.85rem`/`--text-muted` · eyebrow `0.75rem`/600/UPPERCASE/`.12em`.
- **One heading treatment** (collapse the h2-underline+gradient / h3-left-bar / h4-italic mess): a short **solid** orange kicker rule (`2.5rem × 2px`) above `h1` + `h2` only; h3/h4 differ by size/weight/space alone.
- Layout: asymmetric left-weighted hero (~62%) + Popular list in the right ~38% (stacks on mobile, not hidden); post grid = **featured (Fraunces, full-width) + Inter index** (3→2→1 col at 1024/640); un-nest post card-on-card by **un-carding** `.container-md` (add `.post-body` class, keep Bootstrap cols per Keaton) and constraining `.blog-post` to 72ch; **remove `.read-more-chip`**.
- Blur kept ONLY on command palette + mobile drawer. Per-tag palette KEPT but scoped to archives + related-post chips (3:1 min; light tags get `#111` text).
- Motion: one orchestrated homepage load (staggered `translateY`+opacity, 60–80ms, ease-out-quint) + hover/focus micro-interactions; everything under `prefers-reduced-motion` guard. No ambient/veil/pulse/parallax/elastic.
- **Selector-contract impact (pair with Hockney):** removed `.hero-panel`/`.hero-kpis`/`.read-more-chip` (update `landing.spec.ts` — assert placement not lists); new `.popular-posts`/`.popular-post-link`/`.post-card--featured`; kept `.search-trigger`, `.post-card*`, code-block chrome, `.reading-time`, `#cmd-palette*`.

### 2026-07-06 — [Scribe] Redesign shipped, QA-green, and merged to decisions.md

- The redesign (distinctive-editorial, dark-only) is implemented, **QA-green (12 specs / 70 tests)**, and **STAGED** for Marcus's review. All eight redesign inbox decisions — including my discovery draft and the superseding editorial spec — are consolidated into `.squad/decisions.md` under **"Blog Redesign — Distinctive Editorial, Dark-Only."**
- **Single source of truth (canonical):** all `:root` tokens + global/homepage styling live in `assets/css/blog.css`; `_includes/head.html` is metadata-only — never reintroduce a `:root`/inline `<style>` there. **Type system:** Fraunces = title voice only (hero `h1`, post `h1`, featured card title); Inter everywhere else; one orange accent `#f97316`; one heading kicker rule.
- Three non-blocking polish findings are open (search-trigger/cmd-palette-hint `:focus-visible`; pre-existing 320px post overflow; dead `footer-scripts.html` JS).
