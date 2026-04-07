# MarcusFelling.com blog

Jekyll blog hosted on GitHub Pages at [marcusfelling.com](https://marcusfelling.com). Covers DevOps, CI/CD, cloud engineering, AI, Playwright, GitHub Actions, Terraform, Bicep, and more.

## Running Locally

1. Install [Ruby and Bundler](https://jekyllrb.com/docs/installation/).
2. Install dependencies:
   ```
   bundle install
   npm install
   ```
3. Serve the site locally using the dev config for faster builds:
   ```
   bundle exec jekyll serve --config _config.yml,_config-dev.yml
   ```
4. Open http://localhost:4000

> The dev config (`_config-dev.yml`) skips feed and sitemap generation, cutting cold build time roughly in half. Production builds on GitHub Pages use only `_config.yml`.

## Project Structure

```
_posts/          # Blog posts (Markdown)
_layouts/        # Page templates (base, home, post, page)
_includes/       # Reusable partials (head, nav, footer)
_data/           # Data files (top_pages.yml)
assets/          # CSS and JS
content/         # Images and uploads
tests/           # Playwright E2E tests
.github/workflows/  # CI/CD workflows
```

## Testing

[Playwright](https://playwright.dev/) E2E tests live in `tests/` and cover the landing page, archives, post navigation, search, scroll-to-top, images, and 404 handling.

```
npx playwright test
```

Tests run automatically on PRs to `main` and on a daily schedule via the [Playwright workflow](.github/workflows/playwright.yml).

## CI/CD

- **GitHub Pages** — the site is built and deployed automatically on push to `main`.
- **Playwright Tests** — run on every PR and nightly via [playwright.yml](.github/workflows/playwright.yml).

## Contributing

Contributions are welcome via pull requests.

