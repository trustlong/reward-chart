import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChartView } from './ChartView';
import { createChart } from '../domain/chart';
import { Chart } from '../domain/types';

function setup() {
  let chart = createChart('id', 'now');
  const onChange = (updater: (c: Chart) => Chart) => {
    chart = updater(chart);
    rerender(<ChartView chart={chart} onUpdate={onChange} />);
  };
  const { rerender } = render(<ChartView chart={chart} onUpdate={onChange} />);
  return { getChart: () => chart };
}

describe('ChartView', () => {
  it('marks a step done when its cell is clicked', async () => {
    const { getChart } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Step 1' }));
    expect(getChart().completedSteps).toContain(1);
  });

  it('shows a celebration when a milestone step is reached', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Step 10' }));
    expect(screen.getByText('First Milestone!')).toBeInTheDocument();
  });
});
