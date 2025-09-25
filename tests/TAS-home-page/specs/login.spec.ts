import { test, expect } from '@playwright/test';
import { USERS } from '../fixtures/testData';
import { LoginPage } from '../pages/LoginPage';

test.describe('Trajector', () => {
  test('Login Test', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://d2ihttmsv3nwol.cloudfront.net/recruiter/applicants-directory');
  });
});