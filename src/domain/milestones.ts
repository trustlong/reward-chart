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
