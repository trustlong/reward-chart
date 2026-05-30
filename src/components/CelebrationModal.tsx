import { Celebration } from '../domain/milestones';

const CONFETTI_COLORS = ['#ffd43b', '#f06595', '#74c0fc', '#63e6be', '#ff922b', '#9775fa'];

type Props = { celebration: Celebration | null; onClose: () => void };

export function CelebrationModal({ celebration, onClose }: Props) {
  if (!celebration) return null;
  return (
    <div className="celebration active" role="dialog" aria-modal="true">
      <div className="celebration-box">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDuration: `${1.2 + Math.random() * 1.5}s`,
              animationDelay: `${Math.random() * 0.8}s`,
            }}
          />
        ))}
        <span className="celebration-emoji">{celebration.emoji}</span>
        <div className="celebration-title">{celebration.title}</div>
        <div className="celebration-sub">{celebration.sub}</div>
        <button className="btn btn-primary" type="button" onClick={onClose}>
          Keep Going! 🚀
        </button>
      </div>
    </div>
  );
}
