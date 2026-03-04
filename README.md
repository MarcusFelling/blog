# MarcusFelling.com blog

This repo hosts my Jekyll-based blog. It uses a custom theme that's hosted at [https://github.com/MarcusFelling/blog-theme](https://github.com/MarcusFelling/blog-theme)

## Helpful Links
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Jekyll GitHub Repository](https://github.com/jekyll/jekyll)
- [Markdown Guide](https://www.markdownguide.org/)

## Running Locally

1. Install [Ruby and Bundler gems](https://jekyllrb.com/docs/).
2. In the project root, run:
   ```
   bundle install
   ```
3. Serve the site locally using the dev config for faster builds:
   ```
   bundle exec jekyll serve --config _config.yml,_config-dev.yml
   ```
4. Open your browser at http://localhost:4000

> **Note:** The dev config (`_config-dev.yml`) skips HTML compression and feed/sitemap generation, reducing cold build time from ~31s to ~19s and incremental rebuilds to ~8s. Production builds on GitHub Actions use only `_config.yml`.

## Overview

- **Blog Content:**  
  Markdown posts located in the `_posts/` directory cover topics such as Azure Pipelines, GitHub Actions, Playwright, and more.

- **GitHub Actions:**  
  GitHub Actions workflows are configured to [build and deploy the site to GitHub Pages](https://github.com/MarcusFelling/blog/actions/workflows/pages/pages-build-deployment) and [run base web tests](/.github/workflows/playwright.yml).
## Contributing

Contributions are welcome via pull requests.

