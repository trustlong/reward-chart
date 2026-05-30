import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => localStorage.clear());

describe('App', () => {
  it('creates the first chart and shows the grid', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /new chart/i }));
    expect(screen.getAllByRole('button', { name: /step \d+/i }).length).toBeGreaterThan(0);
  });
});
