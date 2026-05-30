import { Chart } from '../domain/types';
import { gridColumns } from '../domain/scale';
import { Cell } from './Cell';

type GridProps = { chart: Chart; onToggle: (step: number) => void };

export function Grid({ chart, onToggle }: GridProps) {
  const cols = gridColumns(chart.scale);
  const steps = Array.from({ length: chart.scale }, (_, i) => i + 1);
  return (
    <div className="chart-card">
      <div className="chart-scroll">
        <div id="chart-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {steps.map((step) => (
            <Cell key={step} chart={chart} step={step} onToggle={onToggle} />
          ))}
        </div>
      </div>
    </div>
  );
}
