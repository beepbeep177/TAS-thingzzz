import { test, expect } from '@playwright/test';

test.describe('Job Posting Directory - Filters', () => {
  test.beforeEach(async ({ page }) => {
    // palitan mo yung URL base sa app mo
    await page.goto('https://d2ihttmsv3nwol.cloudfront.net/job-posting-directory'); 
  });

  test('All Positions should show both Active and Inactive jobs', async ({ page }) => {
    await page.getByRole('button', { name: 'All Positions' }).click();

    // dapat may Active job visible
    const activeCount = await page.getByText('Active').count();
    expect(activeCount).toBeGreaterThan(0);

    // dapat may Inactive job visible
    const inactiveCount = await page.getByText('Inactive').count();
    expect(inactiveCount).toBeGreaterThan(0);
  });

  test('Active Jobs should only show active jobs', async ({ page }) => {
    await page.getByRole('button', { name: 'Active Jobs' }).click();

    // dapat may nakikitang Active
    const activeCount = await page.getByText('Active').count();
    expect(activeCount).toBeGreaterThan(0);

    // dapat wala nang Inactive
    await expect(page.getByText('Inactive')).toHaveCount(0);
  });

  test('Inactive Jobs should only show inactive jobs', async ({ page }) => {
    await page.getByRole('button', { name: 'Inactive Jobs' }).click();

    // dapat may nakikitang Inactive
    const inactiveCount = await page.getByText('Inactive').count();
    expect(inactiveCount).toBeGreaterThan(0);

    // dapat wala nang Active
    await expect(page.getByText('Active')).toHaveCount(0);
  });
});
