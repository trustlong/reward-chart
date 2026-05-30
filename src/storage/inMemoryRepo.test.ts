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
