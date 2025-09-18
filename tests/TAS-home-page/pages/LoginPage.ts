import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://d2ihttmsv3nwol.cloudfront.net/');
  }

  async login(username: string, password: string) {
    await this.page.fill('input[name="email"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  get elements() {
    return {
      errorMessage: () => this.page.locator('text=/error|invalid|incorrect|failed/i').first()
    };
  }
}