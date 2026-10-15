# Tom Dorofeyev’s Blog

This is the source for my personal blog, built with [Jekyll](https://jekyllrb.com/) and hosted on [GitHub Pages](https://pages.github.com/).

👉 Live site: [https://tom-dorofeyev.github.io](https://tom-dorofeyev.github.io)  

---

## Writing workflow

- Posts live in the `_posts/` folder.  
- File naming convention: `YYYY-MM-DD-title.md`  
- Each post begins with YAML front matter, e.g.:

```yaml
---
layout: post
title: "Post Name"
date: 2025-09-07
---
```

## Local verification

With Ruby, Bundler, and the GitHub Pages gems installed, build with `bundle exec jekyll build --baseurl /preview`. Run the rendered-page checks with `SITE_DIR=_site python3 -B -m unittest discover -s tests -v`.

For desktop/mobile browser checks, install Playwright Core outside the repository and point it at a local Chrome installation:

```sh
npm install --prefix /tmp/blog-browser-check --no-save playwright-core
NODE_PATH=/tmp/blog-browser-check/node_modules SITE_DIR=_site CHROME_PATH="/path/to/Google Chrome" node tests/browser.cjs
```

`SCREENSHOT_DIR` can be set to an existing directory to save desktop and mobile screenshots. The browser check expects a build with `--baseurl /preview`.
