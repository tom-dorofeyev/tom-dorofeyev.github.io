# Working in this repository

## Project overview

This is Tom Dorofeyev's personal software engineering blog, built with Jekyll
and hosted at <https://tom-dorofeyev.github.io> on GitHub Pages.

- [Gemfile](./Gemfile) uses the `github-pages` gem for Jekyll compatibility.
- [_config.yml](./_config.yml) configures Minima, Kramdown, Rouge, and site metadata.
- Local layouts and CSS define the current appearance; inspect these before
  assuming the site uses Minima's default markup or styling.
- There is no Node application, JavaScript build pipeline, or automated test
  suite configured in this repository.

## Where changes belong

| Location | Purpose |
| --- | --- |
| [_posts/](./_posts/) | Markdown articles with YAML front matter |
| [index.md](./index.md) | Home page entry point, using `layout: home` |
| [_layouts/default.html](./_layouts/default.html) | Shared document, metadata, header, and footer |
| [_layouts/home.html](./_layouts/home.html) | Hero, latest article, and chronological archive |
| [_layouts/post.html](./_layouts/post.html) | Article content, metadata, and previous/next navigation |
| [assets/css/style.css](./assets/css/style.css) | Shared styles, design tokens, responsive rules, and reduced-motion support |
| [assets/images/](./assets/images/) | Article illustrations |
| [README.md](./README.md) | Project introduction and writing workflow |

## How to approach work

- Read the affected files and nearby examples first. Keep changes focused on
  the requested outcome and preserve unrelated work.
- Prefer the existing Jekyll, Liquid, Markdown, HTML, and CSS approach. Add
  dependencies or tooling only when the task needs them; keep GitHub Pages
  compatibility in mind when changing gems or plugins.
- Avoid broad reformatting. Match the surrounding file's conventions.
- Do not treat generated caches or local analysis artifacts as source code.
  Do not commit `_site/`, `.jekyll-cache/`, `.jekyll-metadata`, `.sass-cache/`,
  or `.agent-craft-work/` output.
- Do not commit, push, or change publishing configuration unless requested.

## Writing and editing articles

Name posts `YYYY-MM-DD-descriptive-slug.md` inside [_posts/](./_posts/), with
front matter like:

```yaml
---
layout: post
title: "Article Title"
date: 2026-10-30
---
```

- Use the intended publication date, keeping the filename and front matter
  consistent. Do not invent historical dates or change existing dates casually:
  they affect ordering and, with the current default permalinks, article URLs.
- Preserve the author's direct, conversational voice and technical meaning.
  Do not invent personal experiences, quotations, or factual claims.
- Keep existing publication-date comments unless the task calls for a correction.
- The home page features `site.posts.first` and generates summaries from post
  excerpts. Check that an article's opening reads well as a summary.
- Do not manually add articles to the home page; its archive is generated from
  `site.posts`.
- Put illustrations in [assets/images/](./assets/images/) and supply descriptive
  alt text. Follow the existing Liquid URL pattern:

  ```liquid
  ![Description of the image.]({{ '/assets/images/example.jpg' | relative_url }})
  ```

## Layout and styling conventions

- Preserve the current dark palette, green accent, typography, and spacing
  unless a design change is requested. Reuse CSS custom properties in `:root`.
- Keep responsive behavior consistent with the existing 850px and 560px
  breakpoints. Check narrow screens for overflow and readable article content.
- Preserve semantic headings, navigation labels, image alt text, visible
  keyboard focus, the skip link, and reduced-motion support.
- Use `relative_url` for internal links and asset paths, and `absolute_url` for
  canonical URLs. Escape titles and other plain text in Liquid output; preserve
  rendered HTML where templates intentionally output `content`.
- Keep metadata, article dates, and previous/next navigation working when
  changing shared layouts.

## Validation

Use Ruby and Bundler with the dependencies declared in [Gemfile](./Gemfile):

```sh
bundle check                  # Check whether dependencies are installed
bundle install                # Install dependencies when needed
bundle exec jekyll build      # Validate the site build
bundle exec jekyll serve       # Preview at http://127.0.0.1:4000
```

- For article, template, configuration, or style changes, run the build when
  the environment supports it. Restart the preview after configuration changes.
- For visual changes, inspect the home page and an article at desktop and
  mobile widths. Check navigation, images, headings, code blocks where present,
  and keyboard focus. For content changes, check front matter and local links.
- Jekyll normally omits future-dated posts. Use `--future` for a deliberate
  preview of scheduled content, without changing production configuration.
- Run `git diff --check` and review the diff for unintended changes when Git is
  available. Documentation-only changes need a content and formatting review,
  not a site build.
- Report what changed, what was actually checked, and any checks blocked by
  missing dependencies or local tooling. Do not claim validation that did not run.
