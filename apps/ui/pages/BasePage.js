import { RemoteControl } from '../../../packages/shared/remote/RemoteControl.js';

export class BasePage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    if (this.constructor === BasePage) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
    this.page = page;
    this.remote = new RemoteControl(page);
  }

  /**
   * @deprecated Use safeNavigate instead. Networkidle is flaky.
   */
  async navigate(path) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigates to the given path and waits for a specific selector to be visible.
   * This is more stable than networkidle.
   * @param {string} path
   * @param {string} selector
   */
  async safeNavigate(path, selector) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    if (selector) {
      await this.page.locator(selector).waitFor({ state: 'visible' });
    }
  }

  async isLoaded() {
    throw new Error('Method \'isLoaded()\' must be implemented.');
  }
}

