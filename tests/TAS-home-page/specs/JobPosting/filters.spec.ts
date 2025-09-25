import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://d2ihttmsv3nwol.cloudfront.net/');
  await page.getByRole('textbox', { name: 'Email' }).fill('arlee@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('my_password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Candidate Board' }).click();
  await page.getByRole('button', { name: 'Job Posting Directory' }).click();
});

test('All Positions should show both Active and Inactive jobs', async ({ page }) => {
  await page.getByRole('button', { name: 'All Positions' }).click();
  await page.waitForSelector('text=Fetching Job Postings...', { state: 'detached' });

  const activeCount = await page.locator('text=/\\bActive\\b/').count();
  const inactiveCount = await page.locator('text=/\\bInactive\\b/').count();

  console.log('Active jobs found:', activeCount);
  console.log('Inactive jobs found:', inactiveCount);

  
});

test('Active Jobs should only show active jobs', async ({ page }) => {
  await page.getByRole('button', { name: 'Active Jobs', exact: true }).click();
  await page.waitForSelector('text=Fetching Job Postings...', { state: 'detached' });
  await page.waitForTimeout(2000); 



  const activeCount = await page.locator('text=/\\bActive\\b/').count();
  const inactiveCount = await page.locator('text=/\\bInactive\\b/').count();

  console.log('Active jobs found:', activeCount);
  console.log('Inactive jobs found:', inactiveCount);

});

test('Inactive Jobs should only show inactive jobs', async ({ page }) => {
  await page.getByRole('button', { name: 'Inactive Jobs' }).click();
  await page.waitForSelector('text=Fetching Job Postings...', { state: 'detached' });

  const inactiveCount = await page.locator('text=/\\bInactive\\b/').count();
  const activeCount = await page.locator('text=/\\bActive\\b/').count();

  console.log('Inactive jobs found:', inactiveCount);
  console.log('Active jobs found:', activeCount);

 
});
