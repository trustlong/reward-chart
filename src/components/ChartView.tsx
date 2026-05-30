import { useState } from 'react';
import { Chart } from '../domain/types';
import { toggleStep, resetProgress, setChartScale } from '../domain/chart';
import { celebrationForStep, Celebration } from '../domain/milestones';
import { Header } from './Header';
import { Settings } from './Settings';
import { Legend } from './Legend';
import { Grid } from './Grid';
import { ProgressBar } from './ProgressBar';
import { Actions } from './Actions';
import { CelebrationModal } from './CelebrationModal';

type Props = {
  chart: Chart;
  onUpdate: (updater: (c: Chart) => Chart) => void;
};

export function ChartView({ chart, onUpdate }: Props) {
  const [celebration, setCelebration] = useState<Celebration | null>(null);

  const handleToggle = (step: number) => {
    const wasDone = chart.completedSteps.includes(step);
    onUpdate((c) => toggleStep(c, step));
    if (!wasDone) {
      const c = celebrationForStep(chart, step);
      if (c) setCelebration(c);
    }
  };

  const handleChange = (patch: Partial<Chart>) => onUpdate((c) => ({ ...c, ...patch }));

  const handleMilestoneChange = (index: number, value: number | null) =>
    onUpdate((c) => {
      const milestones = [...c.milestones];
      milestones[index] = value;
      return { ...c, milestones };
    });

  const handleMarkAll = () => {
    onUpdate((c) => ({ ...c, completedSteps: Array.from({ length: c.scale }, (_, i) => i + 1) }));
    setCelebration({ emoji: '🏆', title: 'AMAZING WORK!', sub: 'Every single step completed! You\'re incredible!', final: true });
  };

  const handleReset = () => {
    if (confirm('Reset all progress? This cannot be undone.')) onUpdate(resetProgress);
  };

  return (
    <>
      <Header chart={chart} onChange={handleChange} />
      <Settings
        chart={chart}
        onScaleChange={(scale) => onUpdate((c) => setChartScale(c, scale))}
        onMilestoneChange={handleMilestoneChange}
      />
      <Legend />
      <Grid chart={chart} onToggle={handleToggle} />
      <ProgressBar chart={chart} />
      <Actions onMarkAll={handleMarkAll} onReset={handleReset} onPrint={() => window.print()} />
      <CelebrationModal celebration={celebration} onClose={() => setCelebration(null)} />
    </>
  );
}
