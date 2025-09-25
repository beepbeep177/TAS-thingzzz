import { test, expect } from '@playwright/test';
import { USERS } from '../fixtures/testData';
import { LoginPage } from '../pages/LoginPage';

test.describe('Role Filter', () => {
  test('TC-001: Filter by specific role', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*applicants-directory/);

    // Click role filter dropdown
    const roleFilter = page.locator('select, .dropdown, [data-testid*="role"], [placeholder*="role" i]').first();
    await roleFilter.click();
    await page.waitForLoadState('networkidle');

    // Select first available role option
    const roleOptions = page.locator('option, .dropdown-item, [role="option"]');
    const firstRole = await roleOptions.nth(1).textContent(); // Skip "All" option
    await roleOptions.nth(1).click();
    await page.waitForLoadState('networkidle');

    // Verify filtered results
    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount({ min: 1 });
  });

  test('TC-002: Clear role filter', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*applicants-directory/);

    // Get initial count
    const initialRows = page.locator('table tbody tr');
    const initialCount = await initialRows.count();

    // Apply role filter
    const roleFilter = page.locator('select, .dropdown, [data-testid*="role"], [placeholder*="role" i]').first();
    await roleFilter.click();
    const roleOptions = page.locator('option, .dropdown-item, [role="option"]');
    await roleOptions.nth(1).click();
    await page.waitForLoadState('networkidle');

    // Clear filter (select "All" or first option)
    await roleFilter.click();
    await roleOptions.first().click();
    await page.waitForLoadState('networkidle');

    // Verify all results are back
    const finalRows = page.locator('table tbody tr');
    const finalCount = await finalRows.count();
    expect(finalCount).toBe(initialCount);
  });
});