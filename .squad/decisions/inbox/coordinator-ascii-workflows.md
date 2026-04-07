### 2026-04-07: ASCII-only in workflow files
**By:** Marcus Felling (via Copilot)
**What:** Never use Unicode characters (em dashes, emoji, special symbols) in GitHub Actions workflow files. Use ASCII-only — plain dashes (--), plain text descriptions, no emoji in strings. Windows encoding mismatches corrupt Unicode in YAML.
**Why:** User request — mojibake incident in squad-main-guard.yml caused CI failure on PR #74.
