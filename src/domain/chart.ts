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
