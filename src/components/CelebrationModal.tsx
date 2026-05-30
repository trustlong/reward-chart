import { useMemo } from 'react';
import { Celebration } from '../domain/milestones';

const CONFETTI_COLORS = ['#ffd43b', '#f06595', '#74c0fc', '#63e6be', '#ff922b', '#9775fa'];

type Props = { celebration: Celebration | null; onClose: () => void };

export function CelebrationModal({ celebration, onClose }: Props) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        animationDuration: `${1.2 + Math.random() * 1.5}s`,
        animationDelay: `${Math.random() * 0.8}s`,
      })),
    [celebration?.title]
  );
  if (!celebration) return null;
  return (
    <div className="celebration active" role="dialog" aria-modal="true">
      <div className="celebration-box">
        {confetti.map((style, i) => (
          <div key={i} className="confetti-piece" style={style} />
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
