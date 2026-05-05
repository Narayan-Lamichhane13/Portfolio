# Narayan Lamichhane — Portfolio

A cinematic single-page portfolio built around a real-time WebGL space
scene. Visitors launch from a landing screen, fly an Apollo-style orbit
around a procedural moon, and dock at four sections in sequence:

1. **About Me** — bio, hobbies, and personal photos
2. **Experience** — Amazon, 3Sharp/Microsoft, SafeFit, UIUC research
3. **Projects** — Tile, Airify, ML & security tooling, SafeFit
4. **Contact me** — email, LinkedIn, GitHub, education and highlights

## Stack

- **React 18 + TypeScript + Vite**
- **Three.js** for the persistent space scene (procedural moon, earth,
  sun, stars, rocket, plume, and a smooth Catmull-Rom orbital camera)
- **Framer Motion** for panel transitions and HUD orchestration
- **Tailwind CSS** for the design system

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm run build      # type-check + production build into dist/
npm run preview    # preview the production build
```

## Navigation

The tour is keyboard-driven so it can't be fumbled with a stray scroll.

| Key                       | Action                         |
| ------------------------- | ------------------------------ |
| `Enter` / `→` / `Space`   | Launch the voyage (on landing) |
| `→` / `↓` / `PageDown`    | Next section                   |
| `←` / `↑` / `PageUp`      | Previous section               |
| `1` – `4`                 | Jump directly to a section     |
| `Home`                    | Return to the landing world    |
| `Esc`                     | Close the end-of-tour overlay  |

A persistent on-screen keycap also reminds visitors which key advances
the tour.

## Project layout

```
src/
  App.tsx                     phase machine: landing → cruising → docked → outro
  components/
    Landing.tsx               title screen overlay
    NavControls.tsx           top-bar + right-rail HUD
    SceneFrame.tsx            cockpit panel + Next CTA
    Traveler.tsx              cruising HUD overlay
    space/
      SpaceScene.tsx          Three.js scene (moon, earth, sun, rocket, stars)
      waypoints.ts            5 camera anchors along the orbit
    sections/
      AboutSection.tsx
      ExperienceSection.tsx
      ProjectsSection.tsx
      ContactSection.tsx
  data/portfolio.ts           all editable copy + image paths
  styles/index.css            design tokens, base layer, components
public/
  photos/                     portrait, hobby photos, project screenshots
  resume/                     resume PDF
scripts/
  build-hobby-photos.mjs      regenerate hobby/project JPEGs from HEIC sources
  optimize-portrait.mjs       face-aware crop + compression for the portrait
  convert-heic.mjs            generic HEIC → JPEG converter
```

## Editing copy

All text and image paths live in [`src/data/portfolio.ts`](src/data/portfolio.ts).
Update the `PROFILE`, `SECTIONS`, `EXPERIENCE`, `HOBBIES`, `PROJECTS`, or
`CONTACT_BLOCKS` arrays and the page re-renders automatically.

## Adding a new hobby / project photo

Drop the source HEIC into `About me Photos/` (gitignored), wire it into
`scripts/build-hobby-photos.mjs`, then run:

```bash
node scripts/build-hobby-photos.mjs
```

The script converts HEIC → JPEG, resizes to 1200 px on the long edge,
and writes a compressed JPEG into `public/photos/`.

## Deploy

The production build outputs to `dist/`. Vercel auto-detects Vite — no
config is needed beyond pointing the project at this repo.
