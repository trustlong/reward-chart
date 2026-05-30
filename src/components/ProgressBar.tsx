import { Chart } from '../domain/types';
import { progressPercent, encouragementFor } from '../domain/progress';
import { activeMilestones } from '../domain/milestones';

const MARKER_COLORS = ['#e67700', '#1971c2', '#0ca678', '#e03131'];

function barGradient(pct: number): string {
  if (pct < 30) return 'linear-gradient(90deg, #69db7c, #40c057)';
  if (pct < 60) return 'linear-gradient(90deg, #4dabf7, #339af0)';
  if (pct < 90) return 'linear-gradient(90deg, #ffd43b, #f59f00)';
  return 'linear-gradient(90deg, #ffd43b, #ff922b, #f06595)';
}

export function ProgressBar({ chart }: { chart: Chart }) {
  const count = chart.completedSteps.length;
  const pct = progressPercent(chart);
  return (
    <div className="progress-card">
      <div className="progress-header">
        <div className="progress-title">🌱 Progress</div>
        <div className="progress-count">
          {count} <span>/ {chart.scale} done</span>
        </div>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${pct}%`, background: barGradient(pct) }} />
        <div className="milestone-markers">
          {activeMilestones(chart).map(({ index, step }) => (
            <div
              key={index}
              className="m-marker"
              data-label={`#${step}`}
              style={{ left: `${(step / chart.scale) * 100}%`, background: MARKER_COLORS[index - 1] }}
            />
          ))}
        </div>
      </div>
      <div style={{ height: 22 }} />
      <div className="encouragement">{encouragementFor(count, chart.scale)}</div>
    </div>
  );
}
