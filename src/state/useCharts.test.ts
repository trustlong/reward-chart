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
