import { ChartStore } from '../domain/types';

type Props = {
  store: ChartStore;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
};

export function ChartList({ store, onSelect, onNew, onDelete }: Props) {
  return (
    <div className="chart-list">
      <button className="btn btn-primary" type="button" onClick={onNew}>
        ＋ New chart
      </button>
      <ul>
        {store.charts.map((c) => (
          <li key={c.id} className={c.id === store.activeChartId ? 'active' : ''}>
            <button type="button" onClick={() => onSelect(c.id)}>
              {c.childName || 'Unnamed'} — {c.goal ? c.goal.slice(0, 30) : 'No goal yet'}
            </button>
            <button
              type="button"
              aria-label={`Delete chart for ${c.childName || 'Unnamed'}`}
              onClick={() => {
                if (confirm('Delete this chart? This cannot be undone.')) onDelete(c.id);
              }}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
