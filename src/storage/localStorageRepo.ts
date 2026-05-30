import { ChartRepository, emptyStore } from './chartRepository';
import { ChartStore } from '../domain/types';

export const STORAGE_KEY = 'reward-chart:v1';

export function createLocalStorageRepo(storage: Storage = window.localStorage): ChartRepository {
  return {
    load(): ChartStore {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return emptyStore();
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.schemaVersion === 1 && Array.isArray(parsed.charts)) {
          return parsed as ChartStore;
        }
        return emptyStore();
      } catch {
        return emptyStore();
      }
    },
    save(store: ChartStore): void {
      storage.setItem(STORAGE_KEY, JSON.stringify(store));
    },
  };
}
