import { test, expect } from '@playwright/test';

test('progress survives a reload', async ({ page }) => {
  await page.goto('/reward-chart/');
  await page.getByRole('button', { name: /new chart/i }).click();
  await page.getByRole('button', { name: 'Step 1', exact: true }).click();
  await page.getByRole('button', { name: 'Step 2', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Step 1', exact: true })).toHaveAttribute('aria-pressed', 'true');

  await page.reload();
  await expect(page.getByRole('button', { name: 'Step 1', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Step 2', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('two charts keep separate state', async ({ page }) => {
  await page.goto('/reward-chart/');
  await page.getByRole('button', { name: /new chart/i }).click();
  await page.getByRole('button', { name: 'Step 1', exact: true }).click();
  await page.getByRole('button', { name: /new chart/i }).click();
  // second chart starts empty
  await expect(page.getByRole('button', { name: 'Step 1', exact: true })).toHaveAttribute('aria-pressed', 'false');
});
