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
