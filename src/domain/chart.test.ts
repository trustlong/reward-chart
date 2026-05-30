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
