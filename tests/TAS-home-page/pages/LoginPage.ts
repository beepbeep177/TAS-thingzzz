import { Page } from '@playwright/test';

async function secureInput(page: Page, selector: string, value: string) {
  await page.fill(selector, '•'.repeat(value.length));
  await page.evaluate(([sel, val]) => {
    (document.querySelector(sel) as HTMLInputElement).value = val;
  }, [selector, value]);
}

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://d2ihttmsv3nwol.cloudfront.net/');
  }

  async login(username: string, password: string) {
    await this.page.fill('input[name="email"]', username);
    await secureInput(this.page, 'input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  get elements() {
    return {
      errorMessage: () => this.page.locator('text=/error|invalid|incorrect|failed/i').first()
    };
  }
}