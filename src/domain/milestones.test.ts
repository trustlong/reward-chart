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
