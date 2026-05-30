import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings } from './Settings';
import { createChart } from '../domain/chart';

describe('Settings', () => {
  it('applies a preset scale when a preset button is clicked', async () => {
    const onScaleChange = vi.fn();
    render(
      <Settings chart={createChart('id', 'now')} onScaleChange={onScaleChange} onMilestoneChange={() => {}} />
    );
    await userEvent.click(screen.getByRole('button', { name: '100' }));
    expect(onScaleChange).toHaveBeenCalledWith(100);
  });

  it('updates a milestone value', async () => {
    const onMilestoneChange = vi.fn();
    render(
      <Settings chart={createChart('id', 'now')} onScaleChange={() => {}} onMilestoneChange={onMilestoneChange} />
    );
    const m3 = screen.getByLabelText('Milestone 3 step');
    await userEvent.type(m3, '25');
    expect(onMilestoneChange).toHaveBeenLastCalledWith(2, 25);
  });
});
