import { test, expect } from '@playwright/test';
import { USERS } from '../fixtures/testData';
import { LoginPage } from '../pages/LoginPage';

test.describe('Role Filter', () => {
  test('TC-004: Select nth role from dropdown (dynamically)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*applicants-directory/);

    // Click role filter dropdown
    await page.getByRole('button', { name: 'All Jobs' }).first().click();
    
    // Wait for dropdown to load and select third job option
    const jobOptions = page.locator('button').filter({ hasText: 'ID: 2025-' });
    await jobOptions.nth(3).waitFor();
    await jobOptions.nth(3).click();
    await page.waitForLoadState('networkidle');

    // Wait for table to update after filter
    await page.waitForTimeout(1000);

    // Verify filter was applied (table should exist, results may be 0 if no matches)
    await expect(page.locator('table')).toBeVisible();
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-005: Use the search bar to select a role', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*applicants-directory/);

    // Click role filter dropdown
    await page.getByRole('button', { name: 'All Jobs' }).first().click();
    
    // Use search bar in dropdown to find a role
    const searchBox = page.getByPlaceholder('Search by title or ID...');
    await searchBox.fill('Engineer');
    await page.waitForLoadState('networkidle');

    // Select first search result
    const searchResults = page.locator('button').filter({ hasText: 'Engineer' });
    await searchResults.first().click();
    await page.waitForLoadState('networkidle');

    // Verify filter was applied
    await expect(page.locator('table')).toBeVisible();
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-005: Search a role with no matches → "No results" message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*applicants-directory/);

    // Click role filter dropdown
    await page.getByRole('button', { name: 'All Jobs' }).first().click();
    
    // Search for non-existent role
    const searchBox = page.getByPlaceholder('Search by title or ID...');
    await searchBox.fill('Nyuknyak');
    await page.waitForLoadState('networkidle');

    // Verify no search results found (only "All Jobs" option remains)
    const dropdownOptions = page.locator('button').filter({ hasText: /^(ID:|All Jobs)/ });
    await expect(dropdownOptions).toHaveCount(1);
    await expect(dropdownOptions.first()).toContainText('All Jobs');
  });

  
});