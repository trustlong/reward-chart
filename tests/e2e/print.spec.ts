import { test, expect } from '@playwright/test';

test('print view hides controls and keeps the full grid at scale 100', async ({ page }) => {
  await page.goto('/reward-chart/');
  await page.getByRole('button', { name: /new chart/i }).click();
  await page.getByRole('button', { name: '100', exact: true }).click();

  await page.emulateMedia({ media: 'print' });

  // Interactive-only chrome is hidden in print
  await expect(page.locator('.settings-bar')).toBeHidden();
  await expect(page.locator('.actions')).toBeHidden();
  await expect(page.locator('.legend-card')).toBeHidden();

  // All 100 step cells are present and the last one is visible (not clipped)
  const cells = page.getByRole('button', { name: /^Step \d+$/ });
  await expect(cells).toHaveCount(100);
  await expect(page.getByRole('button', { name: 'Step 100', exact: true })).toBeVisible();
});
