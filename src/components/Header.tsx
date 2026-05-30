import { Chart } from '../domain/types';

type HeaderProps = {
  chart: Chart;
  onChange: (patch: Partial<Chart>) => void;
};

export function Header({ chart, onChange }: HeaderProps) {
  const setRule = (i: number, value: string) => {
    const rules = chart.rules.map((r, idx) => (idx === i ? value : r));
    onChange({ rules });
  };
  const addRule = () => onChange({ rules: [...chart.rules, ''] });

  return (
    <div className="header-card">
      <div className="chart-title">⭐ My Goal Chart ⭐</div>
      <div className="header-grid">
        <div className="header-field">
          <div className="field-label">👧 Child's Name</div>
          <input
            className="handwrite-input"
            type="text"
            maxLength={40}
            placeholder="Write your name here..."
            value={chart.childName}
            onChange={(e) => onChange({ childName: e.target.value })}
          />
        </div>
        <div className="header-field">
          <div className="field-label">📅 Start Date</div>
          <input
            className="handwrite-input"
            type="text"
            maxLength={30}
            placeholder="e.g. June 1, 2025"
            value={chart.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </div>
        <div className="header-field goal-field">
          <div className="field-label">🎯 My Goal</div>
          <textarea
            className="goal-textarea"
            rows={2}
            placeholder="Write your goal here... (e.g. Read for 20 minutes every day)"
            value={chart.goal}
            onChange={(e) => onChange({ goal: e.target.value })}
          />
        </div>
      </div>

      <div className="rules-section">
        <div className="rules-label">📜 Rules</div>
        <div id="rules-list">
          {chart.rules.map((rule, i) => (
            <div className="rule-row" key={i}>
              <span className="rule-num">{i + 1}.</span>
              <input
                className="rule-input"
                type="text"
                placeholder="Write rule here..."
                value={rule}
                onChange={(e) => setRule(i, e.target.value)}
              />
            </div>
          ))}
        </div>
        <button className="btn-add-rule" type="button" onClick={addRule}>
          ＋ Add another rule
        </button>
      </div>
    </div>
  );
}
