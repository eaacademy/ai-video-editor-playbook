# Build Your Own AI Video Editor

The interactive beginner's playbook by Hana Marigmen: setting up an AI-assisted video editor with Claude Code and free247editor.

## What this is

A single static web page. There is no framework, no build step and no dependencies.

| File | Purpose |
| --- | --- |
| `index.html` | The whole playbook: content, styles and scripts |
| `vercel.json` | Vercel settings: clean URLs, basic security headers, and `noindex` so search engines don't list the paid playbook |
| `.gitignore` | Keeps secrets, dependencies and local files out of Git |

The page loads its fonts from Google Fonts. Everything else is in `index.html`.

## Deploying on Vercel

When importing this repository in Vercel:

- **Framework Preset:** Other
- **Build Command:** leave empty
- **Output Directory:** leave empty (the repository root is served as-is)
- **Install Command:** leave empty
- **Environment variables:** none needed

Every push to the `main` branch deploys automatically.

## Preview locally

Open `index.html` in a browser, or run `npx serve .` and visit the address it prints.
