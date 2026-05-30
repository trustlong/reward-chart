# Reward Chart — Design Spec

**Date:** 2026-05-29
**Status:** Approved for planning

## Summary

A kids' reward chart web app: track day-by-day commitment toward a goal with
custom rules, an adjustable scale, handwritable fields, milestones, encouragement,
and celebration. Built as a TypeScript + React static site, published on GitHub
Pages, with single-device localStorage persistence and a TDD test suite. Print
must produce a clean, usable physical chart.

The existing single-file prototype lives at `prototype/reward-chart.html` and
defines the visual design and feature set. This project ports it to a structured,
tested, deployable app.

## Goals

- Faithfully reproduce the prototype's look and behavior.
- Persist progress on one device so nothing is lost on refresh.
- Support **multiple charts** (siblings, or different goals over time): create,
  switch, rename, delete.
- Adjustable scale (presets 10/30/50/100 + custom, clamped 5–200).
- Up to 4 configurable milestones with celebration.
- Handwritable child name, start date, goal, and rules.
- **Print actually works** — a clean printed chart, including large scales.
- Full TDD coverage; tests gate deployment.

## Non-Goals

- No cross-device sync, accounts, or backend (single-device localStorage only).
- No cloud database. The app stays 100% static and free on GitHub Pages.
- No history/archive beyond the multi-chart list (charts persist until deleted).

## Approach

Approach A — **pure-core + thin React**. All chart business logic lives in plain
TypeScript modules with zero React, making them directly unit-testable. React
components are thin and presentational; they call domain functions and never
compute logic themselves. Persistence sits behind a repository interface so tests
use an in-memory fake.

Rejected alternatives:
- **Next.js static export** — adds routing/SSR machinery unused by a
  localStorage-only static app.
- **Direct HTML→JSX with `useState` everywhere** — tangles logic into components,
  fighting the TDD requirement.

## Architecture

```
src/
  domain/         ← pure TypeScript, no React, fully TDD'd
    chart.ts          create/rename/reset chart, toggle a step
    progress.ts       completed count, percent, encouragement selection
    milestones.ts     milestone detection, "which milestone is step N"
    scale.ts          grid column layout, scale clamping (5–200)
  storage/        ← persistence behind an interface
    chartRepository.ts    interface: load/save/list/delete, versioned schema
    localStorageRepo.ts   localStorage implementation
  state/
    useCharts.ts      hook wiring domain + storage to React
  components/     ← thin, presentational
    ChartList, ChartView, Header, Settings, Grid, Cell,
    ProgressBar, Legend, Actions, CelebrationModal
  print/
    print.css         dedicated print stylesheet
```

**Invariant:** components never compute business logic — they delegate to
`domain/`. This is what makes the TDD spec meaningful.

## Data Model

```ts
type Chart = {
  id: string;
  childName: string;
  startDate: string;
  goal: string;
  rules: string[];
  scale: number;                 // total steps
  milestones: (number | null)[]; // up to 4 step numbers
  completedSteps: number[];      // which steps are done
  createdAt: string;
  updatedAt: string;
};

type ChartStore = {
  schemaVersion: 1;              // versioned so future changes migrate safely
  charts: Chart[];
  activeChartId: string | null;
};
```

### Storage

- Single localStorage key `reward-chart:v1`, JSON-serialized `ChartStore`.
- `chartRepository.ts` defines the interface; `localStorageRepo.ts` implements it.
  Tests inject an in-memory fake and never touch real localStorage.
- Every mutation flows through the repository; saves are automatic on change.
- On load, validate and migrate by `schemaVersion`; corrupt/unparseable data
  falls back to an empty store rather than throwing.

## UI Flow

- **Chart picker** (top): list of saved charts showing child name + goal preview.
  Actions: New chart, switch active, rename, delete (with confirm).
- **Active chart** reproduces the prototype:
  - Header: handwritable child name, start date, goal, rules (add/remove rule).
  - Settings: scale presets (10/30/50/100) + custom numeric input; 4 milestone
    step inputs.
  - Grid: clickable cells; done cells show ✓, milestone cells show 🏅, final cell
    shows 🏆; un-reached milestone cells show a 🏁 flag.
  - Progress: animated bar (color shifts by %), `X / N done` count, milestone
    markers on the bar, rotating encouragement message.
  - Legend.
  - Actions: Mark All Done, Reset Chart (confirm), Print.
  - Celebration: confetti modal on each milestone (once each) and on completion.
- All edits autosave. Reload restores the active chart and full list.

## Print

- `print.css` via `@media print`: hide picker, settings, actions, legend; keep
  child name, date, goal, rules, the full grid, and progress.
- **Large-scale safety:** grids up to 100+ cells must not clip. Print layout caps
  cell size and lets the grid flow/paginate so every step is visible on paper.
- Verified by a Playwright print-media test (emulate print, snapshot) plus a
  manual print checklist below.

### Manual print checklist

- [ ] Child name, start date, goal, and all rules are visible.
- [ ] Every grid cell (at scale 100) prints without clipping.
- [ ] Progress bar and count print.
- [ ] Interactive-only controls (picker, settings, actions, legend) are hidden.
- [ ] Layout fits page width; no horizontal cut-off.

## Testing Strategy (TDD)

Tests are written **before** implementation for each unit.

- **Unit (Vitest):** every `domain/` function:
  - toggling a step adds/removes it; reset clears completion.
  - progress count and percent, including 0 and full.
  - milestone detection at boundaries; "which milestone is step N".
  - scale clamping (5–200) and grid column layout per scale.
  - encouragement selection thresholds.
- **Storage (Vitest):** repository load/save/list/delete against in-memory fake;
  round-trip integrity; schema migration; corrupt-data fallback.
- **Component (React Testing Library):**
  - clicking a cell marks it done and updates progress.
  - changing scale rebuilds the grid and resets completion.
  - milestone celebration fires exactly once per milestone.
  - edits autosave (repository called with expected payload).
- **E2E (Playwright):**
  - create chart → mark steps → reload → progress restored.
  - multi-chart: create two, switch, each retains its own state.
  - print-media render passes the print checklist assertions.
- CI enforces a coverage gate.

## Deployment

- **Vite** build with `base` set for the GitHub Pages project site path.
- **GitHub Actions** on push to `main`: install → typecheck → lint → test →
  build → deploy to GitHub Pages. Failing tests block deploy.
- README documents local dev (`dev`, `test`, `build`) and contributing.

## Open Questions

None outstanding. Tech stack confirmed: Vite + React + TypeScript, Vitest +
React Testing Library, Playwright, GitHub Actions → GitHub Pages.
