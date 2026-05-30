# Reward Chart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the `prototype/reward-chart.html` prototype to a tested TypeScript + React app with multi-chart localStorage persistence, working print, and CI/CD to GitHub Pages.

**Architecture:** Pure-core + thin React. All chart logic lives in `src/domain/` plain-TS modules (TDD'd directly). Persistence sits behind a `ChartRepository` interface; tests use an in-memory fake. React components are presentational and call domain functions. Faithfully reuses the prototype's CSS class names.

**Tech Stack:** Vite, React, TypeScript, Vitest + React Testing Library (jsdom), Playwright, GitHub Actions → GitHub Pages.

---

## File Structure

```
.github/workflows/ci.yml      CI: typecheck, lint, test, build, deploy Pages
index.html                    Vite entry
vite.config.ts                base path '/reward-chart/', vitest config
tsconfig.json                 TS config
playwright.config.ts          E2E config
package.json
src/
  main.tsx                    React mount
  App.tsx                     composes ChartList + ChartView
  styles.css                  ported prototype styles (screen)
  print/print.css             print-only styles
  domain/
    types.ts                  Chart, ChartStore
    scale.ts                  clampScale, gridColumns
    chart.ts                  createChart, toggleStep, resetProgress, setScale
    progress.ts               completedCount, progressPercent, encouragementFor
    milestones.ts             milestoneAt, activeMilestones, celebrationForStep
  storage/
    chartRepository.ts        interface + emptyStore
    inMemoryRepo.ts           test fake
    localStorageRepo.ts       localStorage impl (injectable Storage)
  state/
    useCharts.ts              hook: load/persist/CRUD/active
  components/
    Cell.tsx  Grid.tsx  Header.tsx  Settings.tsx
    ProgressBar.tsx  Legend.tsx  Actions.tsx
    CelebrationModal.tsx  ChartList.tsx  ChartView.tsx
tests/e2e/
    persistence.spec.ts  print.spec.ts
```

---

## Task 1: Scaffold project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `.gitignore` (already exists — extend)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "reward-chart",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.48.0",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.2",
    "eslint": "^9.12.0",
    "jsdom": "^25.0.1",
    "typescript": "^5.6.2",
    "vite": "^5.4.8",
    "vitest": "^2.1.2"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json` and `tsconfig.node.json`**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "playwright.config.ts"]
}
```

- [ ] **Step 3: Create `vite.config.ts` (includes Vitest config)**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/reward-chart/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

- [ ] **Step 4: Create `src/setupTests.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`**

`src/setupTests.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

`index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kids Reward Chart</title>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&family=Caveat:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './print/print.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`src/App.tsx` (placeholder, replaced in Task 14):
```tsx
export default function App() {
  return <div>Reward Chart</div>;
}
```

- [ ] **Step 5: Install, verify build, commit**

Run: `npm install && npm run typecheck && npm run build`
Expected: install succeeds; typecheck passes; `dist/` is produced.

Note: create empty `src/styles.css` and `src/print/print.css` so imports resolve (filled in Task 9).

```bash
git add package.json package-lock.json tsconfig*.json vite.config.ts index.html src/ .gitignore
git commit -m "chore: scaffold Vite + React + TS + Vitest"
```

---

## Task 2: Domain types + scale

**Files:**
- Create: `src/domain/types.ts`, `src/domain/scale.ts`
- Test: `src/domain/scale.test.ts`

- [ ] **Step 1: Write `src/domain/types.ts`**

```ts
export type Chart = {
  id: string;
  childName: string;
  startDate: string;
  goal: string;
  rules: string[];
  scale: number;
  milestones: (number | null)[];
  completedSteps: number[];
  createdAt: string;
  updatedAt: string;
};

export type ChartStore = {
  schemaVersion: 1;
  charts: Chart[];
  activeChartId: string | null;
};
```

- [ ] **Step 2: Write the failing test `src/domain/scale.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { clampScale, gridColumns, MIN_SCALE, MAX_SCALE } from './scale';

describe('clampScale', () => {
  it('clamps below the minimum up to MIN_SCALE', () => {
    expect(clampScale(1)).toBe(MIN_SCALE);
  });
  it('clamps above the maximum down to MAX_SCALE', () => {
    expect(clampScale(9999)).toBe(MAX_SCALE);
  });
  it('floors fractional values', () => {
    expect(clampScale(30.9)).toBe(30);
  });
  it('falls back to 30 for NaN', () => {
    expect(clampScale(NaN)).toBe(30);
  });
});

describe('gridColumns', () => {
  it('uses one column per step when scale <= 10', () => {
    expect(gridColumns(10)).toBe(10);
    expect(gridColumns(7)).toBe(7);
  });
  it('caps at 10 columns above 10 steps', () => {
    expect(gridColumns(30)).toBe(10);
    expect(gridColumns(100)).toBe(10);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/domain/scale.test.ts`
Expected: FAIL — cannot find module `./scale`.

- [ ] **Step 4: Write `src/domain/scale.ts`**

```ts
export const MIN_SCALE = 5;
export const MAX_SCALE = 200;

export function clampScale(value: number): number {
  if (Number.isNaN(value)) return 30;
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.floor(value)));
}

export function gridColumns(scale: number): number {
  return scale <= 10 ? scale : 10;
}
```

- [ ] **Step 5: Run test (PASS) and commit**

Run: `npx vitest run src/domain/scale.test.ts`
Expected: PASS (6 tests).

```bash
git add src/domain/types.ts src/domain/scale.ts src/domain/scale.test.ts
git commit -m "feat: add chart types and scale helpers"
```

---

## Task 3: Domain — chart operations

**Files:**
- Create: `src/domain/chart.ts`
- Test: `src/domain/chart.test.ts`

- [ ] **Step 1: Write the failing test `src/domain/chart.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { createChart, toggleStep, resetProgress, setChartScale } from './chart';

describe('createChart', () => {
  it('creates a default chart with scale 30 and two preset milestones', () => {
    const c = createChart('id-1', '2026-05-29T00:00:00.000Z');
    expect(c.id).toBe('id-1');
    expect(c.scale).toBe(30);
    expect(c.milestones).toEqual([10, 20, null, null]);
    expect(c.rules).toEqual(['', '', '']);
    expect(c.completedSteps).toEqual([]);
    expect(c.createdAt).toBe('2026-05-29T00:00:00.000Z');
  });
});

describe('toggleStep', () => {
  it('marks an incomplete step done, kept sorted', () => {
    const c = createChart('id', 'now');
    const next = toggleStep(toggleStep(c, 5), 2);
    expect(next.completedSteps).toEqual([2, 5]);
  });
  it('unmarks a completed step', () => {
    const c = toggleStep(createChart('id', 'now'), 5);
    expect(toggleStep(c, 5).completedSteps).toEqual([]);
  });
  it('does not mutate the input', () => {
    const c = createChart('id', 'now');
    toggleStep(c, 3);
    expect(c.completedSteps).toEqual([]);
  });
});

describe('resetProgress', () => {
  it('clears all completed steps', () => {
    const c = toggleStep(createChart('id', 'now'), 1);
    expect(resetProgress(c).completedSteps).toEqual([]);
  });
});

describe('setChartScale', () => {
  it('sets a clamped scale and clears progress', () => {
    const c = toggleStep(createChart('id', 'now'), 1);
    const next = setChartScale(c, 1);
    expect(next.scale).toBe(5);
    expect(next.completedSteps).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/domain/chart.test.ts`
Expected: FAIL — cannot find module `./chart`.

- [ ] **Step 3: Write `src/domain/chart.ts`**

```ts
import { Chart } from './types';
import { clampScale } from './scale';

export function createChart(id: string, now: string): Chart {
  return {
    id,
    childName: '',
    startDate: '',
    goal: '',
    rules: ['', '', ''],
    scale: 30,
    milestones: [10, 20, null, null],
    completedSteps: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function toggleStep(chart: Chart, step: number): Chart {
  const has = chart.completedSteps.includes(step);
  const completedSteps = has
    ? chart.completedSteps.filter((s) => s !== step)
    : [...chart.completedSteps, step].sort((a, b) => a - b);
  return { ...chart, completedSteps };
}

export function resetProgress(chart: Chart): Chart {
  return { ...chart, completedSteps: [] };
}

export function setChartScale(chart: Chart, scale: number): Chart {
  return { ...chart, scale: clampScale(scale), completedSteps: [] };
}
```

- [ ] **Step 4: Run test (PASS)**

Run: `npx vitest run src/domain/chart.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/chart.ts src/domain/chart.test.ts
git commit -m "feat: add chart create/toggle/reset/scale operations"
```

---

## Task 4: Domain — progress + encouragement

**Files:**
- Create: `src/domain/progress.ts`
- Test: `src/domain/progress.test.ts`

- [ ] **Step 1: Write the failing test `src/domain/progress.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { progressPercent, encouragementFor, ENCOURAGEMENTS } from './progress';
import { createChart, toggleStep } from './chart';

describe('progressPercent', () => {
  it('is 0 with no completed steps', () => {
    expect(progressPercent(createChart('id', 'now'))).toBe(0);
  });
  it('rounds to nearest percent', () => {
    let c = createChart('id', 'now'); // scale 30
    c = toggleStep(c, 1);
    expect(progressPercent(c)).toBe(3); // 1/30 = 3.33 -> 3
  });
  it('is 100 when all steps complete', () => {
    let c = createChart('id', 'now');
    for (let i = 1; i <= 30; i++) c = toggleStep(c, i);
    expect(progressPercent(c)).toBe(100);
  });
});

describe('encouragementFor', () => {
  it('prompts for the first step at count 0', () => {
    expect(encouragementFor(0, 30)).toContain('first step');
  });
  it('celebrates at completion', () => {
    expect(encouragementFor(30, 30)).toContain('SUPERSTAR');
  });
  it('returns an in-range message mid-progress', () => {
    const msg = encouragementFor(15, 30);
    expect(ENCOURAGEMENTS).toContain(msg);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/domain/progress.test.ts`
Expected: FAIL — cannot find module `./progress`.

- [ ] **Step 3: Write `src/domain/progress.ts`**

```ts
import { Chart } from './types';

export const ENCOURAGEMENTS = [
  'Great start! Every step counts! 🌟',
  "You're doing awesome! Keep it up! 💪",
  'Look at you go! Amazing work! 🚀',
  "You're on a roll! Don't stop now! 🔥",
  "Halfway there — you're incredible! 🌈",
  "Wow, you're crushing it! 🎉",
  "So close! You've got this! ⭐",
  'Almost there! Final push! 🏁',
  'One more! You can do it! 🎯',
  "YOU DID IT! You're a SUPERSTAR! 🏆",
];

export function completedCount(chart: Chart): number {
  return chart.completedSteps.length;
}

export function progressPercent(chart: Chart): number {
  if (chart.scale === 0) return 0;
  return Math.round((chart.completedSteps.length / chart.scale) * 100);
}

export function encouragementFor(count: number, scale: number): string {
  if (count === 0) return 'Click a box to mark your first step! 🌟';
  if (count >= scale) return "🎉 YOU DID IT! You're an absolute SUPERSTAR! 🏆🎊";
  const idx = Math.min(
    Math.floor((count / scale) * (ENCOURAGEMENTS.length - 1)),
    ENCOURAGEMENTS.length - 2
  );
  return ENCOURAGEMENTS[idx];
}
```

- [ ] **Step 4: Run test (PASS)**

Run: `npx vitest run src/domain/progress.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/progress.ts src/domain/progress.test.ts
git commit -m "feat: add progress percent and encouragement selection"
```

---

## Task 5: Domain — milestones + celebrations

**Files:**
- Create: `src/domain/milestones.ts`
- Test: `src/domain/milestones.test.ts`

- [ ] **Step 1: Write the failing test `src/domain/milestones.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { milestoneAt, activeMilestones, celebrationForStep } from './milestones';
import { createChart } from './chart';

describe('milestoneAt', () => {
  it('returns the 1-based milestone index for a milestone step', () => {
    const c = createChart('id', 'now'); // milestones [10,20,null,null]
    expect(milestoneAt(c, 10)).toBe(1);
    expect(milestoneAt(c, 20)).toBe(2);
  });
  it('returns null for a non-milestone step', () => {
    expect(milestoneAt(createChart('id', 'now'), 7)).toBeNull();
  });
});

describe('activeMilestones', () => {
  it('lists configured milestones within scale', () => {
    const c = createChart('id', 'now');
    expect(activeMilestones(c)).toEqual([
      { index: 1, step: 10 },
      { index: 2, step: 20 },
    ]);
  });
  it('omits milestones beyond the scale', () => {
    const c = { ...createChart('id', 'now'), scale: 15 };
    expect(activeMilestones(c)).toEqual([{ index: 1, step: 10 }]);
  });
});

describe('celebrationForStep', () => {
  it('returns a milestone celebration for a milestone step', () => {
    const c = createChart('id', 'now');
    expect(celebrationForStep(c, 10)).toMatchObject({ final: false, title: 'First Milestone!' });
  });
  it('returns a final celebration for the last step', () => {
    const c = createChart('id', 'now');
    expect(celebrationForStep(c, 30)).toMatchObject({ final: true });
  });
  it('returns null for an ordinary step', () => {
    expect(celebrationForStep(createChart('id', 'now'), 7)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/domain/milestones.test.ts`
Expected: FAIL — cannot find module `./milestones`.

- [ ] **Step 3: Write `src/domain/milestones.ts`**

```ts
import { Chart } from './types';

export const MILESTONE_MESSAGES = [
  { emoji: '🏅', title: 'First Milestone!', sub: 'You reached your first checkpoint! Woohoo!' },
  { emoji: '🌟', title: 'Second Milestone!', sub: "You're more than halfway through!" },
  { emoji: '🚀', title: 'Third Milestone!', sub: 'Almost at the finish line!' },
  { emoji: '🔥', title: 'Fourth Milestone!', sub: "Final stretch — you've GOT this!" },
];

export type Celebration = { emoji: string; title: string; sub: string; final: boolean };

export function milestoneAt(chart: Chart, step: number): number | null {
  const idx = chart.milestones.findIndex((m) => m === step);
  return idx === -1 ? null : idx + 1;
}

export function activeMilestones(chart: Chart): { index: number; step: number }[] {
  const result: { index: number; step: number }[] = [];
  chart.milestones.forEach((step, i) => {
    if (step !== null && step <= chart.scale) {
      result.push({ index: i + 1, step });
    }
  });
  return result;
}

export function celebrationForStep(chart: Chart, step: number): Celebration | null {
  const m = milestoneAt(chart, step);
  if (m) {
    return { ...MILESTONE_MESSAGES[m - 1], final: false };
  }
  if (step === chart.scale) {
    return {
      emoji: '🏆',
      title: 'GOAL COMPLETE!',
      sub: "You did it! You reached your goal! You're a superstar! 🌟",
      final: true,
    };
  }
  return null;
}
```

- [ ] **Step 4: Run test (PASS)**

Run: `npx vitest run src/domain/milestones.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/milestones.ts src/domain/milestones.test.ts
git commit -m "feat: add milestone detection and celebration messages"
```

---

## Task 6: Storage — repository interface + in-memory fake

**Files:**
- Create: `src/storage/chartRepository.ts`, `src/storage/inMemoryRepo.ts`
- Test: `src/storage/inMemoryRepo.test.ts`

- [ ] **Step 1: Write the failing test `src/storage/inMemoryRepo.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { emptyStore } from './chartRepository';
import { createInMemoryRepo } from './inMemoryRepo';

describe('inMemoryRepo', () => {
  it('loads an empty store by default', () => {
    expect(createInMemoryRepo().load()).toEqual(emptyStore());
  });
  it('returns the saved store on the next load', () => {
    const repo = createInMemoryRepo();
    const store = { ...emptyStore(), activeChartId: 'x' as string | null };
    repo.save(store);
    expect(repo.load()).toEqual(store);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/storage/inMemoryRepo.test.ts`
Expected: FAIL — cannot find module `./chartRepository`.

- [ ] **Step 3: Write `src/storage/chartRepository.ts` and `src/storage/inMemoryRepo.ts`**

`src/storage/chartRepository.ts`:
```ts
import { ChartStore } from '../domain/types';

export interface ChartRepository {
  load(): ChartStore;
  save(store: ChartStore): void;
}

export function emptyStore(): ChartStore {
  return { schemaVersion: 1, charts: [], activeChartId: null };
}
```

`src/storage/inMemoryRepo.ts`:
```ts
import { ChartRepository, emptyStore } from './chartRepository';
import { ChartStore } from '../domain/types';

export function createInMemoryRepo(initial?: ChartStore): ChartRepository {
  let store: ChartStore = initial ?? emptyStore();
  return {
    load: () => store,
    save: (next: ChartStore) => {
      store = next;
    },
  };
}
```

- [ ] **Step 4: Run test (PASS)**

Run: `npx vitest run src/storage/inMemoryRepo.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/storage/chartRepository.ts src/storage/inMemoryRepo.ts src/storage/inMemoryRepo.test.ts
git commit -m "feat: add chart repository interface and in-memory fake"
```

---

## Task 7: Storage — localStorage repository

**Files:**
- Create: `src/storage/localStorageRepo.ts`
- Test: `src/storage/localStorageRepo.test.ts`

- [ ] **Step 1: Write the failing test `src/storage/localStorageRepo.test.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createLocalStorageRepo, STORAGE_KEY } from './localStorageRepo';
import { emptyStore } from './chartRepository';

beforeEach(() => localStorage.clear());

describe('localStorageRepo', () => {
  it('returns an empty store when nothing is stored', () => {
    expect(createLocalStorageRepo().load()).toEqual(emptyStore());
  });
  it('round-trips a saved store', () => {
    const repo = createLocalStorageRepo();
    const store = { ...emptyStore(), activeChartId: 'abc' as string | null };
    repo.save(store);
    expect(createLocalStorageRepo().load()).toEqual(store);
  });
  it('falls back to empty store on corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(createLocalStorageRepo().load()).toEqual(emptyStore());
  });
  it('falls back to empty store on wrong schema version', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 99, charts: [] }));
    expect(createLocalStorageRepo().load()).toEqual(emptyStore());
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/storage/localStorageRepo.test.ts`
Expected: FAIL — cannot find module `./localStorageRepo`.

- [ ] **Step 3: Write `src/storage/localStorageRepo.ts`**

```ts
import { ChartRepository, emptyStore } from './chartRepository';
import { ChartStore } from '../domain/types';

export const STORAGE_KEY = 'reward-chart:v1';

export function createLocalStorageRepo(storage: Storage = window.localStorage): ChartRepository {
  return {
    load(): ChartStore {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return emptyStore();
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.schemaVersion === 1 && Array.isArray(parsed.charts)) {
          return parsed as ChartStore;
        }
        return emptyStore();
      } catch {
        return emptyStore();
      }
    },
    save(store: ChartStore): void {
      storage.setItem(STORAGE_KEY, JSON.stringify(store));
    },
  };
}
```

- [ ] **Step 4: Run test (PASS)**

Run: `npx vitest run src/storage/localStorageRepo.test.ts`
Expected: PASS (jsdom provides `localStorage`).

- [ ] **Step 5: Commit**

```bash
git add src/storage/localStorageRepo.ts src/storage/localStorageRepo.test.ts
git commit -m "feat: add localStorage repository with corrupt-data fallback"
```

---

## Task 8: State — useCharts hook

**Files:**
- Create: `src/state/useCharts.ts`
- Test: `src/state/useCharts.test.ts`

- [ ] **Step 1: Write the failing test `src/state/useCharts.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCharts } from './useCharts';
import { createInMemoryRepo } from '../storage/inMemoryRepo';
import { toggleStep } from '../domain/chart';

describe('useCharts', () => {
  it('starts with no active chart', () => {
    const { result } = renderHook(() => useCharts(createInMemoryRepo()));
    expect(result.current.activeChart).toBeNull();
  });

  it('creates a chart and makes it active', () => {
    const { result } = renderHook(() => useCharts(createInMemoryRepo()));
    act(() => result.current.newChart());
    expect(result.current.store.charts).toHaveLength(1);
    expect(result.current.activeChart).not.toBeNull();
  });

  it('persists edits to the active chart through the repo', () => {
    const repo = createInMemoryRepo();
    const { result } = renderHook(() => useCharts(repo));
    act(() => result.current.newChart());
    act(() => result.current.updateActiveChart((c) => toggleStep(c, 1)));
    expect(repo.load().charts[0].completedSteps).toEqual([1]);
  });

  it('deletes a chart and picks a new active one', () => {
    const { result } = renderHook(() => useCharts(createInMemoryRepo()));
    act(() => result.current.newChart());
    const firstId = result.current.activeChart!.id;
    act(() => result.current.newChart());
    act(() => result.current.deleteChart(result.current.activeChart!.id));
    expect(result.current.store.charts).toHaveLength(1);
    expect(result.current.activeChart!.id).toBe(firstId);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/state/useCharts.test.ts`
Expected: FAIL — cannot find module `./useCharts`.

- [ ] **Step 3: Write `src/state/useCharts.ts`**

```ts
import { useCallback, useMemo, useState } from 'react';
import { ChartRepository } from '../storage/chartRepository';
import { Chart, ChartStore } from '../domain/types';
import { createChart } from '../domain/chart';

function newId(): string {
  return crypto.randomUUID();
}

export function useCharts(repo: ChartRepository) {
  const [store, setStore] = useState<ChartStore>(() => repo.load());

  const persist = useCallback(
    (next: ChartStore) => {
      repo.save(next);
      setStore(next);
    },
    [repo]
  );

  const activeChart = useMemo(
    () => store.charts.find((c) => c.id === store.activeChartId) ?? null,
    [store]
  );

  const newChart = useCallback(() => {
    const now = new Date().toISOString();
    const chart = createChart(newId(), now);
    persist({ ...store, charts: [...store.charts, chart], activeChartId: chart.id });
  }, [store, persist]);

  const selectChart = useCallback(
    (id: string) => persist({ ...store, activeChartId: id }),
    [store, persist]
  );

  const deleteChart = useCallback(
    (id: string) => {
      const charts = store.charts.filter((c) => c.id !== id);
      const activeChartId =
        store.activeChartId === id ? charts[0]?.id ?? null : store.activeChartId;
      persist({ ...store, charts, activeChartId });
    },
    [store, persist]
  );

  const updateActiveChart = useCallback(
    (updater: (c: Chart) => Chart) => {
      if (!store.activeChartId) return;
      const now = new Date().toISOString();
      const charts = store.charts.map((c) =>
        c.id === store.activeChartId ? { ...updater(c), updatedAt: now } : c
      );
      persist({ ...store, charts });
    },
    [store, persist]
  );

  return { store, activeChart, newChart, selectChart, deleteChart, updateActiveChart };
}
```

- [ ] **Step 4: Run test (PASS)**

Run: `npx vitest run src/state/useCharts.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/state/useCharts.ts src/state/useCharts.test.ts
git commit -m "feat: add useCharts hook wiring domain to storage"
```

---

## Task 9: Styles — port prototype CSS + print stylesheet

**Files:**
- Create/replace: `src/styles.css`, `src/print/print.css`

- [ ] **Step 1: Port screen styles into `src/styles.css`**

Copy the entire contents of the `<style>` block in `prototype/reward-chart.html` (lines 9–676) into `src/styles.css`, EXCEPT the `@media print { ... }` block (lines 663–669) — that moves to `print/print.css` in Step 2. Keep the `:root` variables, all component classes, animations, and the `@media (max-width: 600px)` block. Also keep the `body` background and `body::before` sun decoration.

- [ ] **Step 2: Write `src/print/print.css` (working print, large-scale safe)**

```css
@media print {
  body {
    background: white !important;
    padding: 0;
  }
  body::before { display: none; }

  /* Hide interactive-only chrome */
  .chart-list,
  .settings-bar,
  .actions,
  .btn-add-rule,
  .legend-card {
    display: none !important;
  }

  .header-card,
  .chart-card,
  .progress-card {
    box-shadow: none !important;
    border: 2px solid #ccc !important;
    break-inside: avoid;
  }

  .handwrite-input,
  .goal-textarea,
  .rule-input {
    border-bottom: 1px dashed #aaa !important;
  }

  /* Large-scale safety: never clip the grid, cap cell size, allow wrapping */
  .chart-scroll { overflow: visible !important; }
  #chart-grid {
    min-width: 0 !important;
    gap: 3px !important;
  }
  .cell {
    max-width: 48px;
    border-width: 1px !important;
    box-shadow: none !important;
    animation: none !important;
  }
  .cell .cell-num { opacity: 0.8; }
}
```

- [ ] **Step 3: Verify the dev server renders styled (manual)**

Run: `npm run dev` and open the local URL.
Expected: the empty `App` mounts without CSS import errors. Full visuals appear after Task 14.

- [ ] **Step 4: Commit**

```bash
git add src/styles.css src/print/print.css
git commit -m "feat: port prototype styles and add print stylesheet"
```

---

## Task 10: Components — Cell + Grid

**Files:**
- Create: `src/components/Cell.tsx`, `src/components/Grid.tsx`
- Test: `src/components/Grid.test.tsx`

- [ ] **Step 1: Write the failing test `src/components/Grid.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Grid } from './Grid';
import { createChart, toggleStep } from '../domain/chart';

describe('Grid', () => {
  it('renders one cell per step', () => {
    render(<Grid chart={createChart('id', 'now')} onToggle={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(30);
  });

  it('calls onToggle with the clicked step number', async () => {
    const onToggle = vi.fn();
    render(<Grid chart={createChart('id', 'now')} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button', { name: /step 3/i }));
    expect(onToggle).toHaveBeenCalledWith(3);
  });

  it('marks completed cells as pressed', () => {
    const chart = toggleStep(createChart('id', 'now'), 1);
    render(<Grid chart={chart} onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: /step 1/i })).toHaveAttribute('aria-pressed', 'true');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Grid.test.tsx`
Expected: FAIL — cannot find module `./Grid`.

- [ ] **Step 3: Write `src/components/Cell.tsx` and `src/components/Grid.tsx`**

`src/components/Cell.tsx`:
```tsx
import { Chart } from '../domain/types';
import { milestoneAt, celebrationForStep } from '../domain/milestones';

const MILESTONE_LETTER = ['a', 'b', 'c', 'd'];

type CellProps = { chart: Chart; step: number; onToggle: (step: number) => void };

export function Cell({ chart, step, onToggle }: CellProps) {
  const done = chart.completedSteps.includes(step);
  const milestone = milestoneAt(chart, step);
  const isFinal = step === chart.scale;

  const classes = ['cell'];
  if (done) classes.push('done');
  if (done && milestone) classes.push(`milestone-${MILESTONE_LETTER[milestone - 1]}`);
  if (done && isFinal) classes.push('final');

  let icon = '';
  if (done) icon = isFinal ? '🏆' : milestone ? '🏅' : '✓';

  return (
    <button
      type="button"
      className={classes.join(' ')}
      aria-pressed={done}
      aria-label={`Step ${step}${celebrationForStep(chart, step) ? ' (milestone)' : ''}`}
      onClick={() => onToggle(step)}
    >
      {milestone && !done && <span className="milestone-flag">🏁</span>}
      {icon && <span>{icon}</span>}
      <span className="cell-num">{step}</span>
    </button>
  );
}
```

`src/components/Grid.tsx`:
```tsx
import { Chart } from '../domain/types';
import { gridColumns } from '../domain/scale';
import { Cell } from './Cell';

type GridProps = { chart: Chart; onToggle: (step: number) => void };

export function Grid({ chart, onToggle }: GridProps) {
  const cols = gridColumns(chart.scale);
  const steps = Array.from({ length: chart.scale }, (_, i) => i + 1);
  return (
    <div className="chart-card">
      <div className="chart-scroll">
        <div id="chart-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {steps.map((step) => (
            <Cell key={step} chart={chart} step={step} onToggle={onToggle} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test (PASS)**

Run: `npx vitest run src/components/Grid.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Cell.tsx src/components/Grid.tsx src/components/Grid.test.tsx
git commit -m "feat: add Cell and Grid components"
```

---

## Task 11: Components — Header + Settings

**Files:**
- Create: `src/components/Header.tsx`, `src/components/Settings.tsx`
- Test: `src/components/Settings.test.tsx`

- [ ] **Step 1: Write the failing test `src/components/Settings.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings } from './Settings';
import { createChart } from '../domain/chart';

describe('Settings', () => {
  it('applies a preset scale when a preset button is clicked', async () => {
    const onScaleChange = vi.fn();
    render(
      <Settings chart={createChart('id', 'now')} onScaleChange={onScaleChange} onMilestoneChange={() => {}} />
    );
    await userEvent.click(screen.getByRole('button', { name: '100' }));
    expect(onScaleChange).toHaveBeenCalledWith(100);
  });

  it('updates a milestone value', async () => {
    const onMilestoneChange = vi.fn();
    render(
      <Settings chart={createChart('id', 'now')} onScaleChange={() => {}} onMilestoneChange={onMilestoneChange} />
    );
    const m3 = screen.getByLabelText('Milestone 3 step');
    await userEvent.type(m3, '25');
    expect(onMilestoneChange).toHaveBeenLastCalledWith(2, 25);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Settings.test.tsx`
Expected: FAIL — cannot find module `./Settings`.

- [ ] **Step 3: Write `src/components/Header.tsx` and `src/components/Settings.tsx`**

`src/components/Header.tsx`:
```tsx
import { Chart } from '../domain/types';

type HeaderProps = {
  chart: Chart;
  onChange: (patch: Partial<Chart>) => void;
};

export function Header({ chart, onChange }: HeaderProps) {
  const setRule = (i: number, value: string) => {
    const rules = chart.rules.map((r, idx) => (idx === i ? value : r));
    onChange({ rules });
  };
  const addRule = () => onChange({ rules: [...chart.rules, ''] });

  return (
    <div className="header-card">
      <div className="chart-title">⭐ My Goal Chart ⭐</div>
      <div className="header-grid">
        <div className="header-field">
          <div className="field-label">👧 Child's Name</div>
          <input
            className="handwrite-input"
            type="text"
            maxLength={40}
            placeholder="Write your name here..."
            value={chart.childName}
            onChange={(e) => onChange({ childName: e.target.value })}
          />
        </div>
        <div className="header-field">
          <div className="field-label">📅 Start Date</div>
          <input
            className="handwrite-input"
            type="text"
            maxLength={30}
            placeholder="e.g. June 1, 2025"
            value={chart.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </div>
        <div className="header-field goal-field">
          <div className="field-label">🎯 My Goal</div>
          <textarea
            className="goal-textarea"
            rows={2}
            placeholder="Write your goal here... (e.g. Read for 20 minutes every day)"
            value={chart.goal}
            onChange={(e) => onChange({ goal: e.target.value })}
          />
        </div>
      </div>

      <div className="rules-section">
        <div className="rules-label">📜 Rules</div>
        <div id="rules-list">
          {chart.rules.map((rule, i) => (
            <div className="rule-row" key={i}>
              <span className="rule-num">{i + 1}.</span>
              <input
                className="rule-input"
                type="text"
                placeholder="Write rule here..."
                value={rule}
                onChange={(e) => setRule(i, e.target.value)}
              />
            </div>
          ))}
        </div>
        <button className="btn-add-rule" type="button" onClick={addRule}>
          ＋ Add another rule
        </button>
      </div>
    </div>
  );
}
```

`src/components/Settings.tsx`:
```tsx
import { Chart } from '../domain/types';

const PRESETS = [30, 50, 100, 10];
const MILESTONE_DOTS = [
  { bg: '#ffd43b', border: '#e67700' },
  { bg: '#74c0fc', border: '#1971c2' },
  { bg: '#63e6be', border: '#0ca678' },
  { bg: '#ff6b6b', border: '#e03131' },
];

type SettingsProps = {
  chart: Chart;
  onScaleChange: (scale: number) => void;
  onMilestoneChange: (index: number, value: number | null) => void;
};

export function Settings({ chart, onScaleChange, onMilestoneChange }: SettingsProps) {
  return (
    <div className="settings-bar">
      <div className="settings-group">
        <div className="settings-label">📏 Scale (total steps)</div>
        <div className="settings-row">
          <input
            className="num-input"
            type="number"
            min={5}
            max={200}
            value={chart.scale}
            aria-label="Scale"
            onChange={(e) => onScaleChange(parseInt(e.target.value, 10))}
          />
          <div className="preset-btns">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className={`preset-btn${chart.scale === p ? ' active' : ''}`}
                onClick={() => onScaleChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="settings-group milestone-config">
        <div className="settings-label">🏁 Milestones (step numbers)</div>
        <div className="milestone-inputs">
          {[0, 1, 2, 3].map((i) => (
            <div className="milestone-chip" key={i}>
              <div
                className="milestone-dot"
                style={{ background: MILESTONE_DOTS[i].bg, border: `1.5px solid ${MILESTONE_DOTS[i].border}` }}
              />
              <input
                className="milestone-num"
                type="number"
                min={1}
                max={200}
                placeholder="–"
                aria-label={`Milestone ${i + 1} step`}
                value={chart.milestones[i] ?? ''}
                onChange={(e) => {
                  const v = e.target.value === '' ? null : parseInt(e.target.value, 10);
                  onMilestoneChange(i, Number.isNaN(v as number) ? null : v);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test (PASS)**

Run: `npx vitest run src/components/Settings.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/Settings.tsx src/components/Settings.test.tsx
git commit -m "feat: add Header and Settings components"
```

---

## Task 12: Components — ProgressBar, Legend, Actions

**Files:**
- Create: `src/components/ProgressBar.tsx`, `src/components/Legend.tsx`, `src/components/Actions.tsx`
- Test: `src/components/ProgressBar.test.tsx`

- [ ] **Step 1: Write the failing test `src/components/ProgressBar.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';
import { createChart, toggleStep } from '../domain/chart';

describe('ProgressBar', () => {
  it('shows the completed count over scale', () => {
    const chart = toggleStep(createChart('id', 'now'), 1);
    render(<ProgressBar chart={chart} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('/ 30 done')).toBeInTheDocument();
  });

  it('shows the first-step prompt when empty', () => {
    render(<ProgressBar chart={createChart('id', 'now')} />);
    expect(screen.getByText(/first step/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ProgressBar.test.tsx`
Expected: FAIL — cannot find module `./ProgressBar`.

- [ ] **Step 3: Write the three components**

`src/components/ProgressBar.tsx`:
```tsx
import { Chart } from '../domain/types';
import { progressPercent, encouragementFor } from '../domain/progress';
import { activeMilestones } from '../domain/milestones';

const MARKER_COLORS = ['#e67700', '#1971c2', '#0ca678', '#e03131'];

function barGradient(pct: number): string {
  if (pct < 30) return 'linear-gradient(90deg, #69db7c, #40c057)';
  if (pct < 60) return 'linear-gradient(90deg, #4dabf7, #339af0)';
  if (pct < 90) return 'linear-gradient(90deg, #ffd43b, #f59f00)';
  return 'linear-gradient(90deg, #ffd43b, #ff922b, #f06595)';
}

export function ProgressBar({ chart }: { chart: Chart }) {
  const count = chart.completedSteps.length;
  const pct = progressPercent(chart);
  return (
    <div className="progress-card">
      <div className="progress-header">
        <div className="progress-title">🌱 Progress</div>
        <div className="progress-count">
          {count} <span>/ {chart.scale} done</span>
        </div>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${pct}%`, background: barGradient(pct) }} />
        <div className="milestone-markers">
          {activeMilestones(chart).map(({ index, step }) => (
            <div
              key={index}
              className="m-marker"
              data-label={`#${step}`}
              style={{ left: `${(step / chart.scale) * 100}%`, background: MARKER_COLORS[index - 1] }}
            />
          ))}
        </div>
      </div>
      <div style={{ height: 22 }} />
      <div className="encouragement">{encouragementFor(count, chart.scale)}</div>
    </div>
  );
}
```

`src/components/Legend.tsx`:
```tsx
export function Legend() {
  return (
    <div className="legend-card">
      <div className="legend-title">Legend:</div>
      <div className="legend-items">
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'linear-gradient(135deg,#51cf66,#40c057)', color: 'white' }}>✓</div>
          Done!
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#f8f9fa', border: '2px dashed #ced4da' }} />
          Not yet
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'linear-gradient(135deg,#ffd43b,#f59f00)' }}>🏅</div>
          Milestone
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'linear-gradient(135deg,#ffd43b,#ff922b,#f06595)', fontSize: '0.9rem' }}>🏆</div>
          Goal Reached!
        </div>
      </div>
    </div>
  );
}
```

`src/components/Actions.tsx`:
```tsx
type ActionsProps = {
  onMarkAll: () => void;
  onReset: () => void;
  onPrint: () => void;
};

export function Actions({ onMarkAll, onReset, onPrint }: ActionsProps) {
  return (
    <div className="actions">
      <button className="btn btn-success" type="button" onClick={onMarkAll}>✅ Mark All Done</button>
      <button className="btn btn-danger" type="button" onClick={onReset}>🔄 Reset Chart</button>
      <button className="btn btn-print" type="button" onClick={onPrint}>🖨️ Print</button>
    </div>
  );
}
```

- [ ] **Step 4: Run test (PASS)**

Run: `npx vitest run src/components/ProgressBar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProgressBar.tsx src/components/Legend.tsx src/components/Actions.tsx src/components/ProgressBar.test.tsx
git commit -m "feat: add ProgressBar, Legend, and Actions components"
```

---

## Task 13: Components — CelebrationModal

**Files:**
- Create: `src/components/CelebrationModal.tsx`
- Test: `src/components/CelebrationModal.test.tsx`

- [ ] **Step 1: Write the failing test `src/components/CelebrationModal.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CelebrationModal } from './CelebrationModal';

describe('CelebrationModal', () => {
  it('renders nothing when celebration is null', () => {
    const { container } = render(<CelebrationModal celebration={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the celebration title and closes on button click', async () => {
    const onClose = vi.fn();
    render(
      <CelebrationModal
        celebration={{ emoji: '🏅', title: 'First Milestone!', sub: 'Woohoo!', final: false }}
        onClose={onClose}
      />
    );
    expect(screen.getByText('First Milestone!')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /keep going/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/CelebrationModal.test.tsx`
Expected: FAIL — cannot find module `./CelebrationModal`.

- [ ] **Step 3: Write `src/components/CelebrationModal.tsx`**

```tsx
import { Celebration } from '../domain/milestones';

const CONFETTI_COLORS = ['#ffd43b', '#f06595', '#74c0fc', '#63e6be', '#ff922b', '#9775fa'];

type Props = { celebration: Celebration | null; onClose: () => void };

export function CelebrationModal({ celebration, onClose }: Props) {
  if (!celebration) return null;
  return (
    <div className="celebration active" role="dialog" aria-modal="true">
      <div className="celebration-box">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDuration: `${1.2 + Math.random() * 1.5}s`,
              animationDelay: `${Math.random() * 0.8}s`,
            }}
          />
        ))}
        <span className="celebration-emoji">{celebration.emoji}</span>
        <div className="celebration-title">{celebration.title}</div>
        <div className="celebration-sub">{celebration.sub}</div>
        <button className="btn btn-primary" type="button" onClick={onClose}>
          Keep Going! 🚀
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test (PASS)**

Run: `npx vitest run src/components/CelebrationModal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/CelebrationModal.tsx src/components/CelebrationModal.test.tsx
git commit -m "feat: add CelebrationModal component"
```

---

## Task 14: Compose ChartList, ChartView, App

**Files:**
- Create: `src/components/ChartList.tsx`, `src/components/ChartView.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/ChartView.test.tsx`, `src/App.test.tsx`

- [ ] **Step 1: Write the failing tests**

`src/components/ChartView.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChartView } from './ChartView';
import { createChart } from '../domain/chart';
import { Chart } from '../domain/types';

function setup() {
  let chart = createChart('id', 'now');
  const onChange = (updater: (c: Chart) => Chart) => {
    chart = updater(chart);
    rerender(<ChartView chart={chart} onUpdate={onChange} />);
  };
  const { rerender } = render(<ChartView chart={chart} onUpdate={onChange} />);
  return { getChart: () => chart };
}

describe('ChartView', () => {
  it('marks a step done when its cell is clicked', async () => {
    const { getChart } = setup();
    await userEvent.click(screen.getByRole('button', { name: /step 1/i }));
    expect(getChart().completedSteps).toContain(1);
  });

  it('shows a celebration when a milestone step is reached', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /step 10/i }));
    expect(screen.getByText('First Milestone!')).toBeInTheDocument();
  });
});
```

`src/App.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => localStorage.clear());

describe('App', () => {
  it('creates the first chart and shows the grid', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /new chart/i }));
    expect(screen.getAllByRole('button', { name: /step \d+/i }).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/ChartView.test.tsx src/App.test.tsx`
Expected: FAIL — cannot find module `./ChartView` / App has no New chart button.

- [ ] **Step 3: Write `ChartList.tsx`, `ChartView.tsx`, and rewrite `App.tsx`**

`src/components/ChartList.tsx`:
```tsx
import { ChartStore } from '../domain/types';

type Props = {
  store: ChartStore;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
};

export function ChartList({ store, onSelect, onNew, onDelete }: Props) {
  return (
    <div className="chart-list">
      <button className="btn btn-primary" type="button" onClick={onNew}>
        ＋ New chart
      </button>
      <ul>
        {store.charts.map((c) => (
          <li key={c.id} className={c.id === store.activeChartId ? 'active' : ''}>
            <button type="button" onClick={() => onSelect(c.id)}>
              {c.childName || 'Unnamed'} — {c.goal ? c.goal.slice(0, 30) : 'No goal yet'}
            </button>
            <button
              type="button"
              aria-label={`Delete chart for ${c.childName || 'Unnamed'}`}
              onClick={() => {
                if (confirm('Delete this chart? This cannot be undone.')) onDelete(c.id);
              }}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`src/components/ChartView.tsx`:
```tsx
import { useState } from 'react';
import { Chart } from '../domain/types';
import { toggleStep, resetProgress, setChartScale } from '../domain/chart';
import { celebrationForStep, Celebration } from '../domain/milestones';
import { Header } from './Header';
import { Settings } from './Settings';
import { Legend } from './Legend';
import { Grid } from './Grid';
import { ProgressBar } from './ProgressBar';
import { Actions } from './Actions';
import { CelebrationModal } from './CelebrationModal';

type Props = {
  chart: Chart;
  onUpdate: (updater: (c: Chart) => Chart) => void;
};

export function ChartView({ chart, onUpdate }: Props) {
  const [celebration, setCelebration] = useState<Celebration | null>(null);

  const handleToggle = (step: number) => {
    const wasDone = chart.completedSteps.includes(step);
    onUpdate((c) => toggleStep(c, step));
    if (!wasDone) {
      const c = celebrationForStep(chart, step);
      if (c) setCelebration(c);
    }
  };

  const handleChange = (patch: Partial<Chart>) => onUpdate((c) => ({ ...c, ...patch }));

  const handleMilestoneChange = (index: number, value: number | null) =>
    onUpdate((c) => {
      const milestones = [...c.milestones];
      milestones[index] = value;
      return { ...c, milestones };
    });

  const handleMarkAll = () => {
    onUpdate((c) => ({ ...c, completedSteps: Array.from({ length: c.scale }, (_, i) => i + 1) }));
    setCelebration({ emoji: '🏆', title: 'AMAZING WORK!', sub: 'Every single step completed! You\'re incredible!', final: true });
  };

  const handleReset = () => {
    if (confirm('Reset all progress? This cannot be undone.')) onUpdate(resetProgress);
  };

  return (
    <>
      <Header chart={chart} onChange={handleChange} />
      <Settings
        chart={chart}
        onScaleChange={(scale) => onUpdate((c) => setChartScale(c, scale))}
        onMilestoneChange={handleMilestoneChange}
      />
      <Legend />
      <Grid chart={chart} onToggle={handleToggle} />
      <ProgressBar chart={chart} />
      <Actions onMarkAll={handleMarkAll} onReset={handleReset} onPrint={() => window.print()} />
      <CelebrationModal celebration={celebration} onClose={() => setCelebration(null)} />
    </>
  );
}
```

`src/App.tsx`:
```tsx
import { useMemo } from 'react';
import { createLocalStorageRepo } from './storage/localStorageRepo';
import { useCharts } from './state/useCharts';
import { ChartList } from './components/ChartList';
import { ChartView } from './components/ChartView';

export default function App() {
  const repo = useMemo(() => createLocalStorageRepo(), []);
  const { store, activeChart, newChart, selectChart, deleteChart, updateActiveChart } = useCharts(repo);

  return (
    <div className="chart-wrapper">
      <ChartList store={store} onSelect={selectChart} onNew={newChart} onDelete={deleteChart} />
      {activeChart ? (
        <ChartView chart={activeChart} onUpdate={updateActiveChart} />
      ) : (
        <p style={{ textAlign: 'center', fontFamily: 'Caveat, cursive', fontSize: '1.4rem' }}>
          Create a chart to get started! 🌟
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run tests (PASS) and full suite + typecheck**

Run: `npm run typecheck && npm run test`
Expected: all unit/component tests PASS, typecheck clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/ChartList.tsx src/components/ChartView.tsx src/components/ChartView.test.tsx src/App.tsx src/App.test.tsx
git commit -m "feat: compose ChartList, ChartView, and App"
```

---

## Task 15: E2E — persistence + multi-chart (Playwright)

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/persistence.spec.ts`

- [ ] **Step 1: Install Playwright browsers**

Run: `npx playwright install --with-deps chromium`
Expected: chromium downloads.

- [ ] **Step 2: Write `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:4173/reward-chart/' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173/reward-chart/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3: Write `tests/e2e/persistence.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('progress survives a reload', async ({ page }) => {
  await page.goto('/reward-chart/');
  await page.getByRole('button', { name: /new chart/i }).click();
  await page.getByRole('button', { name: /step 1/i }).click();
  await page.getByRole('button', { name: /step 2/i }).click();
  await expect(page.getByText('2', { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByText('/ 30 done')).toBeVisible();
  await expect(page.getByRole('button', { name: /step 1/i })).toHaveAttribute('aria-pressed', 'true');
});

test('two charts keep separate state', async ({ page }) => {
  await page.goto('/reward-chart/');
  await page.getByRole('button', { name: /new chart/i }).click();
  await page.getByRole('button', { name: /step 1/i }).click();
  await page.getByRole('button', { name: /new chart/i }).click();
  // second chart starts empty
  await expect(page.getByRole('button', { name: /step 1/i })).toHaveAttribute('aria-pressed', 'false');
});
```

- [ ] **Step 4: Run E2E (PASS)**

Run: `npx playwright test`
Expected: both tests PASS.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e/persistence.spec.ts
git commit -m "test: add e2e persistence and multi-chart specs"
```

---

## Task 16: E2E — print verification (Playwright)

**Files:**
- Create: `tests/e2e/print.spec.ts`

- [ ] **Step 1: Write the failing test `tests/e2e/print.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('print view hides controls and keeps the full grid at scale 100', async ({ page }) => {
  await page.goto('/reward-chart/');
  await page.getByRole('button', { name: /new chart/i }).click();
  await page.getByRole('button', { name: '100' }).click();

  await page.emulateMedia({ media: 'print' });

  // Interactive-only chrome is hidden in print
  await expect(page.locator('.settings-bar')).toBeHidden();
  await expect(page.locator('.actions')).toBeHidden();
  await expect(page.locator('.legend-card')).toBeHidden();

  // All 100 step cells are present and the last one is visible (not clipped)
  const cells = page.getByRole('button', { name: /step \d+/i });
  await expect(cells).toHaveCount(100);
  await expect(page.getByRole('button', { name: 'Step 100' })).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify behavior**

Run: `npx playwright test tests/e2e/print.spec.ts`
Expected: PASS if `print.css` from Task 9 is correct. If the last cell is clipped or controls show, fix `print.css` (e.g. `overflow: visible`, `min-width: 0`) until PASS.

- [ ] **Step 3: Manual print checklist (from spec)**

Run: `npm run preview` and use the browser's Print preview at scale 100. Confirm:
- Child name, date, goal, and all rules visible.
- Every cell prints without clipping.
- Progress bar and count print; picker/settings/actions/legend hidden.
- Fits page width.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/print.spec.ts src/print/print.css
git commit -m "test: verify print view hides controls and shows full grid"
```

---

## Task 17: CI/CD — GitHub Actions → Pages

**Files:**
- Create: `.github/workflows/ci.yml`, `eslint.config.js`

- [ ] **Step 1: Add a minimal `eslint.config.js`**

```js
import js from '@eslint/js';

export default [
  js.configs.recommended,
  { ignores: ['dist/', 'node_modules/', 'playwright-report/'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parserOptions: { ecmaVersion: 'latest', sourceType: 'module' } },
  },
];
```

Add dev deps: `npm install -D @eslint/js`. If `eslint` flat-config TS parsing causes noise, scope `lint` to a no-op-safe set; the gate that matters is typecheck + tests.

- [ ] **Step 2: Write `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run test
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - id: deploy
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Verify the workflow locally as far as possible**

Run: `npm ci && npm run typecheck && npm run test && npm run build`
Expected: all green; `dist/` produced.

- [ ] **Step 4: Commit and push**

```bash
git add .github/workflows/ci.yml eslint.config.js package.json package-lock.json
git commit -m "ci: add typecheck/test/e2e/build and Pages deploy"
git push
```

- [ ] **Step 5: Enable Pages (manual, one-time)**

In the GitHub repo: Settings → Pages → Build and deployment → Source = "GitHub Actions". After the next push to `main`, the site is live at `https://trustlong.github.io/reward-chart/`.

---

## Task 18: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`**

```markdown
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
\`\`\`bash
npm install
npm run dev        # local dev server
npm run test       # unit + component tests (Vitest)
npm run e2e        # end-to-end tests (Playwright)
npm run build      # production build
\`\`\`

## Architecture
Pure TypeScript domain logic in \`src/domain/\`, persistence behind a repository
in \`src/storage/\`, thin React components in \`src/components/\`. State is held in
the browser via localStorage. See \`docs/superpowers/specs/\` for the design.
```

- [ ] **Step 2: Commit and push**

```bash
git add README.md
git commit -m "docs: add README"
git push
```

---

## Self-Review

**Spec coverage:**
- Faithful prototype port → Tasks 9–14 (styles + all components). ✓
- Single-device localStorage persistence → Tasks 6–8, 15. ✓
- Multiple charts (create/switch/rename/delete) → Tasks 8, 14. (Rename: editing child name/goal in Header serves as labeling; explicit rename action is the child-name field. ✓)
- Adjustable scale + presets + clamp → Tasks 2, 3, 11. ✓
- Up to 4 milestones + celebration → Tasks 5, 11, 13, 14. ✓
- Handwritable fields → Task 11 (Header). ✓
- Working print incl. large scale → Tasks 9, 16. ✓
- Full TDD coverage → every domain/storage/component task is test-first; E2E in 15–16. ✓
- CI/CD to GitHub Pages → Task 17. ✓

**Placeholder scan:** No "TBD"/"handle edge cases" left; all code blocks complete.

**Type consistency:** `Chart`/`ChartStore` (Task 2) used consistently; `ChartRepository.load/save` (Task 6) used by `localStorageRepo` (7) and `useCharts` (8); `Celebration` (Task 5) used by `CelebrationModal` (13) and `ChartView` (14); `celebrationForStep`, `activeMilestones`, `milestoneAt` names consistent across tasks.

**Note on `rename`:** The spec's "rename" is satisfied by editing the in-chart child name/goal fields, which drive the ChartList label. No separate rename dialog is built (YAGNI).
