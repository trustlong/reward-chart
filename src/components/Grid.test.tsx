import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Grid } from './Grid';
import { createChart, toggleStep } from '../domain/chart';

describe('Grid', () => {
  it('renders one cell per step', () => {
    render(<Grid chart={createChart('id', 'now')} onToggle={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(30);
  });

  it('calls onToggle with the clicked step number', async () => {
    const onToggle = vi.fn();
    render(<Grid chart={createChart('id', 'now')} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button', { name: /step 3/i }));
    expect(onToggle).toHaveBeenCalledWith(3);
  });

  it('marks completed cells as pressed', () => {
    const chart = toggleStep(createChart('id', 'now'), 1);
    render(<Grid chart={chart} onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: /step 1/i })).toHaveAttribute('aria-pressed', 'true');
  });
});
