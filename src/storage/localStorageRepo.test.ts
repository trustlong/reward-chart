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
