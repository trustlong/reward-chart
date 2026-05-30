export function Legend() {
  return (
    <div className="legend-card">
      <div className="legend-title">Legend:</div>
      <div className="legend-items">
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'linear-gradient(135deg,#51cf66,#40c057)', color: 'white' }}>✓</div>
          Done!
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#f8f9fa', border: '2px dashed #ced4da' }} />
          Not yet
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'linear-gradient(135deg,#ffd43b,#f59f00)' }}>🏅</div>
          Milestone
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'linear-gradient(135deg,#ffd43b,#ff922b,#f06595)', fontSize: '0.9rem' }}>🏆</div>
          Goal Reached!
        </div>
      </div>
    </div>
  );
}
