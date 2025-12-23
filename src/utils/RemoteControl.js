/**
 * RemoteControl helper:
 * A minimal abstraction for TV-style navigation.
 * We keep it intentionally simple and synchronous (await keypress).
 */
export class RemoteControl {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async up(times = 1) {
    for (let i = 0; i < times; i++) await this.page.keyboard.press('ArrowUp');
  }

  async down(times = 1) {
    for (let i = 0; i < times; i++) await this.page.keyboard.press('ArrowDown');
  }

  async left(times = 1) {
    for (let i = 0; i < times; i++) await this.page.keyboard.press('ArrowLeft');
  }

  async right(times = 1) {
    for (let i = 0; i < times; i++) await this.page.keyboard.press('ArrowRight');
  }

  async select(times = 1) {
    for (let i = 0; i < times; i++) await this.page.keyboard.press('Enter');
  }

  /**
   * "Long press" simulation for remote.
   * Many TV UIs react to holding Enter, but DOM behavior varies.
   */
  async longPressEnter(ms = 900) {
    await this.page.keyboard.down('Enter');
    await this.page.waitForTimeout(ms);
    await this.page.keyboard.up('Enter');
  }
}