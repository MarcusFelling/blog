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
3. Serve the site locally:
   ```
   bundle exec jekyll serve
   ```
4. Open your browser at http://localhost:4000

## Overview

- **Blog Content:**  
  Markdown posts located in the `_posts/` directory cover topics such as Azure Pipelines, GitHub Actions, Playwright, and more.

- **GitHub Actions:**  
  GitHub Actions workflows are configured [build and deploy the site to GitHub Pages](https://github.com/MarcusFelling/blog/actions/workflows/pages/pages-build-deployment) and [run base web tests](/.github/workflows/playwright.yml).

## Contributing

Contributions are welcome via pull requests.

