import { ChartStore } from '../domain/types';

export interface ChartRepository {
  load(): ChartStore;
  save(store: ChartStore): void;
}

export function emptyStore(): ChartStore {
  return { schemaVersion: 1, charts: [], activeChartId: null };
}
