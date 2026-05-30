import { Chart } from '../domain/types';

const PRESETS = [30, 50, 100, 10];
const MILESTONE_DOTS = [
  { bg: '#ffd43b', border: '#e67700' },
  { bg: '#74c0fc', border: '#1971c2' },
  { bg: '#63e6be', border: '#0ca678' },
  { bg: '#ff6b6b', border: '#e03131' },
];

type SettingsProps = {
  chart: Chart;
  onScaleChange: (scale: number) => void;
  onMilestoneChange: (index: number, value: number | null) => void;
};

export function Settings({ chart, onScaleChange, onMilestoneChange }: SettingsProps) {
  return (
    <div className="settings-bar">
      <div className="settings-group">
        <div className="settings-label">📏 Scale (total steps)</div>
        <div className="settings-row">
          <input
            className="num-input"
            type="number"
            min={5}
            max={200}
            value={chart.scale}
            aria-label="Scale"
            onChange={(e) => onScaleChange(parseInt(e.target.value, 10))}
          />
          <div className="preset-btns">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className={`preset-btn${chart.scale === p ? ' active' : ''}`}
                onClick={() => onScaleChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="settings-group milestone-config">
        <div className="settings-label">🏁 Milestones (step numbers)</div>
        <div className="milestone-inputs">
          {[0, 1, 2, 3].map((i) => (
            <div className="milestone-chip" key={i}>
              <div
                className="milestone-dot"
                style={{ background: MILESTONE_DOTS[i].bg, border: `1.5px solid ${MILESTONE_DOTS[i].border}` }}
              />
              <input
                className="milestone-num"
                type="number"
                min={1}
                max={200}
                placeholder="–"
                aria-label={`Milestone ${i + 1} step`}
                defaultValue={chart.milestones[i] ?? ''}
                onChange={(e) => {
                  const v = e.target.value === '' ? null : parseInt(e.target.value, 10);
                  onMilestoneChange(i, Number.isNaN(v as number) ? null : v);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
