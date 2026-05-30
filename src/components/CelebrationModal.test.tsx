import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CelebrationModal } from './CelebrationModal';

describe('CelebrationModal', () => {
  it('renders nothing when celebration is null', () => {
    const { container } = render(<CelebrationModal celebration={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the celebration title and closes on button click', async () => {
    const onClose = vi.fn();
    render(
      <CelebrationModal
        celebration={{ emoji: '🏅', title: 'First Milestone!', sub: 'Woohoo!', final: false }}
        onClose={onClose}
      />
    );
    expect(screen.getByText('First Milestone!')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /keep going/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
