import { expect } from '@playwright/test';
import { keymap } from './keymap.js';

export class RemoteControl {
  constructor(page, options = {}) {
    this.page = page;
    this.delay = options.delay ?? 200;
    this.longPressMs = options.longPressMs ?? 2000;
    this.timeout = options.timeout ?? 5000;
    this.log = options.log ?? true;
  }

  _log(message) {
    if (this.log) console.log(message);
  }

  async press(key, times = 1) {
    for (let i = 0; i < times; i++) {
      await this.page.keyboard.press(key, { delay: this.delay });
      this._log(`[Remote] ${key}`);
    }
  }

  async left(times = 1) {
    await this.press(keymap.LEFT, times);
  }

  async right(times = 1) {
    await this.press(keymap.RIGHT, times);
  }

  async up(times = 1) {
    await this.press(keymap.UP, times);
  }

  async down(times = 1) {
    await this.press(keymap.DOWN, times);
  }

  async back() {
    await this.press(keymap.BACK, 1);
  }

  async assertFocused(target) {
    if (!target) throw new Error('assertFocused(target) requires a Locator');

    await expect(target).toHaveAttribute('data-focused', /^(focused|true)$/i, {
      timeout: this.timeout,
    });
  }

  async select(target) {
    if (target) {
      await this.assertFocused(target);
    }
    await this.page.keyboard.press(keymap.OK, { delay: this.delay });
    this._log('[Remote] SELECT');

    await this.page.waitForTimeout(this.delay);
  }

  async longPressSelect(target) {
    if (target) {
      await this.assertFocused(target);
    }
    this._log(`[Remote] LONG SELECT (${this.longPressMs}ms)`);

    await this.page.keyboard.down(keymap.OK);
    await this.page.waitForTimeout(this.longPressMs);
    await this.page.keyboard.up(keymap.OK);

    await this.page.waitForTimeout(this.delay);
  }
}