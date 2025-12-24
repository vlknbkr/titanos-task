// src/pages/ChannelsPage.js
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { ChannelsOverlayComponent } from '../components/ChannelsOverlayComponent.js';

export class ChannelsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.overlay = new ChannelsOverlayComponent(page);
  }

  async open() {
    await this.page.goto('Channels');
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(
      this.overlay.root(),
      'Channels overlay should be visible'
    ).toBeVisible();
    await expect(
      this.overlay.channelInfo.root(),
      'Channel info container should be visible'
    ).toBeVisible();

    await expect
      .poll(async () => this.overlay.channelInfo.isContentReady(), { timeout: 15000 })
      .toBe(true);

    await expect(
      this.overlay.channelInfo.switcher(),
      'Channels switcher should be visible'
    ).toBeVisible();

    await expect
      .poll(async () => {
        const label = await this.overlay.channelInfo.currentLabel();
        return !!label && label.trim().length > 0;
      }, { timeout: 15000 })
      .toBe(true);
  }

  /**
   * Switches channel using remote up/down.
   * @param {'up'|'down'} direction
   * @param {number} steps
   */
  async switchChannel(direction = 'down', steps = 1) {
    if (!['up', 'down'].includes(direction)) {
      throw new Error(`switchChannel: direction must be "up" or "down", got "${direction}"`);
    }
    if (!Number.isInteger(steps) || steps < 1) {
      throw new Error(`switchChannel: steps must be a positive integer, got "${steps}"`);
    }

    await this.isLoaded();

    const before = await this.overlay.channelInfo.currentLabel();
    if (direction === 'down') await this.remote.down(steps);
    else await this.remote.up(steps);

    await this.assertChannelChanged(before);
  }

  async openMenu() {
    await this.isLoaded();

    await this.remote.longPressSelect();

    await expect(
      this.overlay.menu.root(),
      'Channels menu root should exist'
    ).toBeVisible();

    await expect(
      this.overlay.menu.backButton(),
      'Channels menu Back button should be visible after opening menu'
    ).toBeVisible({ timeout: 15000 });
  }

  async closeMenu() {
    if (await this.overlay.menu.backButton().count() === 0) return;

    await this.remote.back();
    await this.overlay.menu.waitUntilClosed();
  }

  /**
   * Asserts the current channel label changed from prevLabel.
   * @param {string|null} prevLabel
   */
  async assertChannelChanged(prevLabel) {
    await expect
      .poll(async () => {
        const now = await this.overlay.channelInfo.currentLabel();
        if (!now) return false;
        if (!prevLabel) return true;
        return now.trim() !== prevLabel.trim();
      }, { timeout: 15000 })
      .toBe(true);
  }
}