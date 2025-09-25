import { test, expect } from '@playwright/test';
import { USERS } from '../fixtures/testData';
import { LoginPage } from '../pages/LoginPage';

test.describe('Search Filter', () => {
  test('TC-001: Enter valid name (e.g., "Batulay")', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await page.waitForLoadState('networkidle');
    
    // Navigate to applicants directory if not redirected
    if (!page.url().includes('applicants-directory')) {
      await page.goto('https://d2ihttmsv3nwol.cloudfront.net/applicants-directory');
      await page.waitForLoadState('networkidle');
    }
    await expect(page).toHaveURL(/.*applicants-directory/);

    const searchBox = page.getByPlaceholder('Type in a keyword or name ...');
    await searchBox.fill('Batulay');
    
    // Wait a bit for real-time search
    await page.waitForTimeout(2000);

    // Just check that "Batulay" appears somewhere in the results
    await expect(page.locator('table')).toContainText('Batulay');
  });

test('TC-002: Enter invalid keyword that has no matches', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  await page.waitForLoadState('networkidle');
  
  // Navigate to applicants directory if not redirected
  if (!page.url().includes('applicants-directory')) {
    await page.goto('https://d2ihttmsv3nwol.cloudfront.net/applicants-directory');
    await page.waitForLoadState('networkidle');
  }
  await expect(page).toHaveURL(/.*applicants-directory/);

  const searchBox = page.getByPlaceholder('Type in a keyword or name ...');
  await searchBox.fill('Nyuknyak');

  // Wait a bit for real-time search
  await page.waitForTimeout(2000);

  // Check that the table is empty
  const rows = page.locator('table tbody tr');
  await expect (rows).toHaveCount(0);
  });

  test('TC-003: Clear search and return to all results', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await page.waitForLoadState('networkidle');
    
    // Navigate using navigation button instead of direct URL
    await page.getByRole('button', { name: 'Applicants Directory' }).click();
    await page.waitForLoadState('networkidle');
    
    // Wait for search box to be available
    await page.getByPlaceholder('Type in a keyword or name ...').waitFor();

    // Get initial count of all results
    const initialRows = page.locator('table tbody tr');
    const initialCount = await initialRows.count();

    // Search for something specific
    const searchBox = page.getByPlaceholder('Type in a keyword or name ...');
    await searchBox.fill('Bea');
    await page.waitForLoadState('networkidle');

    // Clear the search
    await searchBox.clear();
    await page.waitForLoadState('networkidle');

    // Check that all results are back
    const finalRows = page.locator('table tbody tr');
    const finalCount = await finalRows.count();
    expect(finalCount).toBe(initialCount);
  });

});
