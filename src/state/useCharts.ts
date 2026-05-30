import { useCallback, useMemo, useState } from 'react';
import { ChartRepository } from '../storage/chartRepository';
import { Chart, ChartStore } from '../domain/types';
import { createChart } from '../domain/chart';

function newId(): string {
  return crypto.randomUUID();
}

export function useCharts(repo: ChartRepository) {
  const [store, setStore] = useState<ChartStore>(() => repo.load());

  const persist = useCallback(
    (next: ChartStore) => {
      repo.save(next);
      setStore(next);
    },
    [repo]
  );

  const activeChart = useMemo(
    () => store.charts.find((c) => c.id === store.activeChartId) ?? null,
    [store]
  );

  const newChart = useCallback(() => {
    const now = new Date().toISOString();
    const chart = createChart(newId(), now);
    persist({ ...store, charts: [...store.charts, chart], activeChartId: chart.id });
  }, [store, persist]);

  const selectChart = useCallback(
    (id: string) => persist({ ...store, activeChartId: id }),
    [store, persist]
  );

  const deleteChart = useCallback(
    (id: string) => {
      const charts = store.charts.filter((c) => c.id !== id);
      const activeChartId =
        store.activeChartId === id ? charts[0]?.id ?? null : store.activeChartId;
      persist({ ...store, charts, activeChartId });
    },
    [store, persist]
  );

  const updateActiveChart = useCallback(
    (updater: (c: Chart) => Chart) => {
      if (!store.activeChartId) return;
      const now = new Date().toISOString();
      const charts = store.charts.map((c) =>
        c.id === store.activeChartId ? { ...updater(c), updatedAt: now } : c
      );
      persist({ ...store, charts });
    },
    [store, persist]
  );

  return { store, activeChart, newChart, selectChart, deleteChart, updateActiveChart };
}
