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
- Node.js 20+
- npm

### Install
```bash
git clone https://github.com/mashhoorahdal/portfolio.git
cd portfolio
npm install
```

### Develop
```bash
npm run dev
```
Opens at `http://localhost:5173`.

### Build
```bash
npm run build
```
Output → `dist/`.

### Preview production build
```bash
npm run preview
```

### Lint
```bash
npm run lint
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
npm run deploy
```

Runs `predeploy` (build) then publishes `dist/` to the `gh-pages` branch. CI uses GitHub Actions (see `.github/workflows/`).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint check |
| `npm run deploy` | Build + publish to GitHub Pages |

## License

Personal project — all rights reserved unless otherwise noted.

## Contact

- **LinkedIn**: https://linkedin.com/in/mashhoor-ahdal
- **GitHub**: https://github.com/mashhoorahdal
- **Email**: mashhoorahdal2@gmail.com
