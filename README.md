# Reward Chart

A printable kids' reward chart — track daily progress toward a goal with custom rules, milestones, and celebrations.

Live: https://trustlong.github.io/reward-chart/

## Features
- Handwritable child name, start date, goal, and rules
- Adjustable scale (presets 10/30/50/100, custom 5–200)
- Up to 4 milestones with celebration animations
- Multiple charts (siblings or different goals), saved in your browser
- Print-friendly layout

## Develop
```bash
npm install
npm run dev        # local dev server
npm run test       # unit + component tests (Vitest)
npm run e2e        # end-to-end tests (Playwright)
npm run build      # production build
```

## Architecture
Pure TypeScript domain logic in `src/domain/`, persistence behind a repository
in `src/storage/`, thin React components in `src/components/`. State is held in
the browser via localStorage. See `docs/superpowers/specs/` for the design.
