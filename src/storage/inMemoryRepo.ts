import { ChartRepository, emptyStore } from './chartRepository';
import { ChartStore } from '../domain/types';

export function createInMemoryRepo(initial?: ChartStore): ChartRepository {
  let store: ChartStore = initial ?? emptyStore();
  return {
    load: () => store,
    save: (next: ChartStore) => {
      store = next;
    },
  };
}
