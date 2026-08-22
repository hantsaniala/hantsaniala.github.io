# Hantsaniala Eléo — Portfolio & Blog

> Freelance software developer specializing in Go, Python, and full-stack development. Available for consulting and contract work.

**Live site:** <https://hantsaniala.is-a.dev>

## Overview

Personal portfolio and blog built with [Astro](https://astro.build). Features a single-page landing with a flat "pill" design system, a content-collections blog, and aggressive AI-search/SEO optimization (sitemap, robots rules for AI crawlers, `llms.txt`, JSON-LD structured data).

## Features

- **Flat pill design system** — consistent tokens, pill buttons, cards, minimal chrome
- **Light / dark theme** — CSS custom-property tokens, `.dark` class, toggle persisted to `localStorage`
- **Bilingual (EN/FR)** — client-side translation via `data-i18n` attributes and a `#lang-switcher` toggle (landing page)
- **Typing headline** — typewriter effect with click sound, static fallback text for crawlers
- **Animated hero** — cursor-following gradient blobs, animated stat counters
- **Blog** — Astro content collections (`src/content/blog/*.md`) with per-post frontmatter schema
- **SEO / AEO** — auto-generated `sitemap.xml`, `robots.txt` with AI-crawler allow/deny rules, `llms.txt`, Person + FAQ JSON-LD
- **Utility pages** — 404, privacy policy, terms of service
- **Extras** — back-to-top button, downloadable resume, WhatsApp / social links

## Tech Stack

| Layer | Tooling |
| --- | --- |
| Framework | [Astro](https://astro.build) 5 (static output) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 3 via `@astrojs/tailwind` |
| Motion | [anime.js](https://animejs.com) |
| Icons | [Phosphor Icons](https://phosphoricons.com) (`@phosphor-icons/web`) |
| Sitemap | `@astrojs/sitemap` |

## Getting Started

Prerequisites: **Node.js 20+** and npm.

```bash
npm install
npm run dev        # http://localhost:4321
```

Build and preview:

```bash
npm run build      # outputs static site to ./dist
npm run preview    # serve the production build locally
```

## Project Structure

```
.
├── .github/workflows/
│   └── deploy.yml            # GitHub Pages build + deploy
├── public/                   # static assets
│   ├── llms.txt              # LLM-readable summary of the site
│   ├── robots.txt            # crawler rules incl. AI search bots
│   ├── resume.pdf
│   ├── typing.js             # typewriter + counter scripts
│   ├── favicon.ico
│   └── img/                  # logo, profile photos
├── src/
│   ├── components/           # Astro components (Hero, Sidebar, Skills, …)
│   ├── content/
│   │   └── blog/             # markdown blog posts
│   ├── data/                 # site config + content JSON
│   │   ├── site.ts           # identity, contact, socials, nav
│   │   ├── skills.json
│   │   ├── experience.json
│   │   └── education.json
│   ├── layouts/
│   │   └── BaseLayout.astro  # shell, i18n dict, theme, blob canvas
│   ├── pages/                # index, blog, 404, privacy, terms
│   ├── styles/
│   │   └── global.css        # design tokens + component styles
│   └── content.config.ts     # Astro content collections
├── astro.config.mjs          # site URL, Tailwind, sitemap integrations
└── tailwind.config.mjs
```

## Content Management

- **Identity & contact** — edit `src/data/site.ts` (name, email, phone, WhatsApp, socials, nav items)
- **Skills / experience / education** — edit `src/data/skills.json`, `src/data/experience.json`, `src/data/education.json`
- **Blog posts** — add a Markdown file to `src/content/blog/`:

```markdown
---
title: My post title
description: Short summary
date: 2026-01-15
tags: ["astro", "go"]
draft: false
---

Post body…
```

## Internationalization (i18n)

Translation is handled client-side:

- Elements carry `data-i18n="<key>"` (text) or `data-i18n-html="<key>"` (inner HTML) attributes.
- The `en` / `fr` dictionaries live in `src/layouts/BaseLayout.astro`.
- `#lang-switcher` (and `#lang-switcher-mobile`) toggle the active language, update the `<html lang>` attribute, and persist the choice to `localStorage`.
- `.lang-label` elements are updated alongside translations.

> Scope: the landing page is fully translated; blog, privacy, and terms pages are English-only.

## Theming

Design tokens are defined in `src/styles/global.css` using CSS custom properties. The `.dark` class switches the palette; the theme toggle persists the preference.

| Token | Light | Dark |
| --- | --- | --- |
| `--bg` | `#fafafa` | `#0a0a0a` |
| `--text` | `#1a1a1a` | `#f0f0f0` |
| `--accent` | `#ffd200` | `#eab308` |
| `--accent-text` | `#0a0a0a` | `#0a0a0a` |

Accent-colored buttons always use dark text for contrast against the yellow background.

## Deployment

[GitHub Pages](https://pages.github.com) via `.github/workflows/deploy.yml`:

- **Trigger:** push to the `master` branch, or manual `workflow_dispatch`
- **Steps:** checkout → Node 20 + `npm ci` → `npm run build` → upload `./dist` → `actions/deploy-pages`
- **Base URL:** `/` (site is `https://hantsaniala.is-a.dev`, configured in `astro.config.mjs`)

## SEO / AEO

- **`sitemap.xml`** — auto-generated by `@astrojs/sitemap` from the `site` URL in `astro.config.mjs`
- **`robots.txt`** — allows general crawlers, AI search bots (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot…), denies Bytespider / CCBot / cohere-ai, and declares the sitemap
- **`llms.txt`** — human/LLM-readable overview of services, skills, experience, and blog
- **JSON-LD** — `Person` schema in the hero and `FAQPage` schema in the FAQ section

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Astro dev server |
| `npm run build` | Build the static site to `./dist` |
| `npm run preview` | Serve the production build locally |
| `npx astro` | Astro CLI passthrough |

## License

All rights reserved. The content and design of this site may not be reused without explicit permission.
