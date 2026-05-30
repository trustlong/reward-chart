import { useMemo } from 'react';
import { createLocalStorageRepo } from './storage/localStorageRepo';
import { useCharts } from './state/useCharts';
import { ChartList } from './components/ChartList';
import { ChartView } from './components/ChartView';

export default function App() {
  const repo = useMemo(() => createLocalStorageRepo(), []);
  const { store, activeChart, newChart, selectChart, deleteChart, updateActiveChart } = useCharts(repo);

  return (
    <div className="chart-wrapper">
      <ChartList store={store} onSelect={selectChart} onNew={newChart} onDelete={deleteChart} />
      {activeChart ? (
        <ChartView chart={activeChart} onUpdate={updateActiveChart} />
      ) : (
        <p style={{ textAlign: 'center', fontFamily: 'Caveat, cursive', fontSize: '1.4rem' }}>
          Create a chart to get started! 🌟
        </p>
      )}
    </div>
  );
}
