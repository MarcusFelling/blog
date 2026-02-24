# Routing Rules

## Signal → Agent Mapping

| Signal / Keywords | Agent | Rationale |
|-------------------|-------|-----------|
| Architecture, structure, code review, decisions, scope | Mal | Lead — owns architecture and review |
| Design, redesign, CSS, layout, responsive, UI, styling, colors, fonts, theme | Kaylee | Designer/Dev — owns visual design and frontend code |
| Blog post, content, SEO, metadata, frontmatter, writing, templates | Wash | Content Dev — owns post structure and content |
| Tests, Playwright, quality, accessibility, performance, broken links | Zoe | Tester — owns testing and quality |
| Log, session, decisions merge | Scribe | Session logger |
| Backlog, work queue, issues, monitoring | Ralph | Work monitor |
| Simple bug fixes, boilerplate, scaffolding, test writing (via issue assignment) | @copilot | Coding agent — async, issue-driven |

## Multi-Agent Signals

| Signal | Agents |
|--------|--------|
| "Redesign the blog" | Mal (architecture) + Kaylee (design/CSS) |
| "Review all the code" | Mal (review) + Zoe (quality checks) |
| "New blog post" | Wash (content) + Kaylee (if template changes needed) |
| "Full audit" | Mal + Kaylee + Wash + Zoe (parallel fan-out) |
