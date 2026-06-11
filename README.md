# Portfolio

Personal portfolio of **Mashhoor Ahdal** — Full Stack Developer & AI Engineer.

Live: https://mashhoorahdal.github.io/portfolio

## Tech Stack

- **Framework**: React 18 + Vite 7
- **Routing**: React Router 6
- **Styling**: Tailwind CSS 3
- **Animation**: Framer Motion, Lenis (smooth scroll)
- **Icons**: Lucide React
- **Deploy**: GitHub Pages (`gh-pages`)

## Features

- Animated hero, projects, skills, timeline, contact sections
- Working contact form (FormSubmit AJAX) with floating-label inputs, success animation, and client-side spam guards (honeypot, min-fill timer, per-hour cap, duplicate hash, URL limit, keyword blacklist)
- Custom cursor + background FX
- Smooth scroll via Lenis with anchor-link hijack
- `/lab` route with interactive experiments:
  - Constellation
  - Conway's Game of Life
  - Generative Ambient
  - Glitch Type
  - Particle Vortex
- 404 page, scroll-to-top button

## Project Structure

```
src/
├── App.jsx                 # Root layout, Lenis setup, router outlet
├── main.jsx                # Entry, router config
├── portfolio.js            # All site content (about, projects, skills, timeline)
├── components/             # UI components
│   ├── Hero/  Projects/  Skills/  Timeline/  Contact/
│   ├── Navbar/  Footer/  ScrollToTop/  CustomCursor/
│   ├── BackgroundFX/  ProjectContainer/  Lab/  icons/
├── experiments/            # Interactive lab demos
│   ├── Constellation.jsx
│   ├── ConwayLife.jsx
│   ├── GenerativeAmbient.jsx
│   ├── GlitchType.jsx
│   ├── ParticleVortex.jsx
│   └── index.js            # Experiment registry
├── pages/
│   ├── Home.jsx
│   ├── Lab.jsx
│   ├── Experiment.jsx      # Dynamic experiment loader
│   └── NotFound.jsx
└── contexts/
```

## Getting Started

### Prerequisites
- Bun 1.x ([install](https://bun.sh))

### Install
```bash
git clone https://github.com/mashhoorahdal/portfolio.git
cd portfolio
bun install
```

### Environment
Copy `.env.example` to `.env.local` and set:

```
VITE_FORMSUBMIT_KEY=<your-formsubmit-hash>
```

Get the hash by submitting once to `https://formsubmit.co/<your-email>` and confirming via the activation email. Without this var, the contact form falls back to a mailto link. In CI, set `VITE_FORMSUBMIT_KEY` as a GitHub Actions secret — the deploy workflow injects it at build time.

### Develop
```bash
bun run dev
```
Opens at `http://localhost:5173`.

### Build
```bash
bun run build
```
Output → `dist/`.

### Preview production build
```bash
bun run preview
```

### Lint
```bash
bun run lint
```

## Editing Content

All site content lives in `src/portfolio.js`:

- `about` — name, role, bio, resume link, socials
- `projects` — name, description, stack, sourceCode, livePreview
- `skills` / `skillCategories` — flat list + grouped categories
- `timeline` — work/education history

Update this file, rebuild, redeploy.

## Adding an Experiment

1. Create `src/experiments/MyExperiment.jsx` exporting a default React component.
2. Register it in `src/experiments/index.js` with a slug, title, and component reference.
3. It auto-appears on `/lab` and is reachable at `/lab/:slug`.

## Deploy

GitHub Pages via `gh-pages` branch:

```bash
bun run deploy
```

Runs `predeploy` (build) then publishes `dist/` to the `gh-pages` branch. CI uses GitHub Actions (see `.github/workflows/`).

## Scripts

| Script | Purpose |
|---|---|
| `bun run dev` | Vite dev server |
| `bun run build` | Production build |
| `bun run preview` | Serve `dist/` locally |
| `bun run lint` | ESLint check |
| `bun run deploy` | Build + publish to GitHub Pages |

## Releases

Versioning is automated via [release-please](https://github.com/googleapis/release-please). Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `feat!:` for breaking, etc.). On push to `main`, the workflow opens / updates a Release PR that bumps `package.json`, writes `CHANGELOG.md`, and — once merged — tags the commit (e.g. `v1.2.0`) and publishes a GitHub Release.

Commit type → bump:
- `fix:` → patch (`1.0.0` → `1.0.1`)
- `feat:` → minor (`1.0.0` → `1.1.0`)
- `feat!:` or `BREAKING CHANGE:` footer → major (`1.0.0` → `2.0.0`)

## License

Personal project — all rights reserved unless otherwise noted.

## Contact

- **LinkedIn**: https://linkedin.com/in/mashhoor-ahdal
- **GitHub**: https://github.com/mashhoorahdal
- **Email**: mashhoorahdal2@gmail.com
