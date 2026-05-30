import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';
import { createChart, toggleStep } from '../domain/chart';

describe('ProgressBar', () => {
  it('shows the completed count over scale', () => {
    const chart = toggleStep(createChart('id', 'now'), 1);
    render(<ProgressBar chart={chart} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('/ 30 done')).toBeInTheDocument();
  });

  it('shows the first-step prompt when empty', () => {
    render(<ProgressBar chart={createChart('id', 'now')} />);
    expect(screen.getByText(/first step/i)).toBeInTheDocument();
  });
});
