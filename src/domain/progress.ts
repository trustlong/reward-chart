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
