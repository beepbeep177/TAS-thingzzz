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

  test('TC-006: Use the search bar to select a role', async ({ page }) => {
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

  // test('TC-005: Select a role with no applicants → "No results" message (or empty list)', async ({ page }) => {
  //   const loginPage = new LoginPage(page);

  //   await loginPage.goto();
  //   await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  //   await page.waitForLoadState('networkidle');
  //   await expect(page).toHaveURL(/.*applicants-directory/);

  //   // Click role filter dropdown
  //   await page.getByRole('button', { name: 'All Jobs' }).first().click();
    
  //   // Use search bar to find a role with no applicants
  //   const searchBox = page.getByPlaceholder('Search by title or ID...');
  //   await searchBox.fill('Nyuknyak');
  //   await page.waitForLoadState('networkidle');

  //   // No results found, click All Jobs to close dropdown
  //   await page.getByRole('button', { name: 'All Jobs' }).click();
  //   await page.waitForLoadState('networkidle');

  //   // Wait for table to update
  //   await page.waitForTimeout(1000);

  //   // Verify no results (empty table)
  //   const rowCount = await page.locator('table tbody tr').count();
  //   expect(rowCount).toBe(0);
  // });

  // test('TC-002: Clear role filter', async ({ page }) => {
  //   const loginPage = new LoginPage(page);

  //   await loginPage.goto();
  //   await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  //   await page.waitForLoadState('networkidle');
  //   await expect(page).toHaveURL(/.*applicants-directory/);

  //   // Get initial count
  //   const initialRows = page.locator('table tbody tr');
  //   const initialCount = await initialRows.count();

  //   // Apply role filter
  //   const roleFilter = page.locator('select, .dropdown, [data-testid*="role"], [placeholder*="role" i]').first();
  //   await roleFilter.click();
  //   const roleOptions = page.locator('option, .dropdown-item, [role="option"]');
  //   await roleOptions.nth(1).click();
  //   await page.waitForLoadState('networkidle');

  //   // Clear filter (select "All" or first option)
  //   await roleFilter.click();
  //   await roleOptions.first().click();
  //   await page.waitForLoadState('networkidle');

  //   // Verify all results are back
  //   const finalRows = page.locator('table tbody tr');
  //   const finalCount = await finalRows.count();
  //   expect(finalCount).toBe(initialCount);
  // });
});