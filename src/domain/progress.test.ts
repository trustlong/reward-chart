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
