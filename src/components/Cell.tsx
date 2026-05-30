import { Chart } from '../domain/types';
import { milestoneAt } from '../domain/milestones';

const MILESTONE_LETTER = ['a', 'b', 'c', 'd'];

type CellProps = { chart: Chart; step: number; onToggle: (step: number) => void };

export function Cell({ chart, step, onToggle }: CellProps) {
  const done = chart.completedSteps.includes(step);
  const milestone = milestoneAt(chart, step);
  const isFinal = step === chart.scale;

  const classes = ['cell'];
  if (done) classes.push('done');
  if (done && milestone) classes.push(`milestone-${MILESTONE_LETTER[milestone - 1]}`);
  if (done && isFinal) classes.push('final');

  let icon = '';
  if (done) icon = isFinal ? '🏆' : milestone ? '🏅' : '✓';

  return (
    <button
      type="button"
      className={classes.join(' ')}
      aria-pressed={done}
      aria-label={`Step ${step}${milestoneAt(chart, step) ? ' (milestone)' : ''}`}
      onClick={() => onToggle(step)}
    >
      {milestone && !done && <span className="milestone-flag">🏁</span>}
      {icon && <span>{icon}</span>}
      <span className="cell-num">{step}</span>
    </button>
  );
}
