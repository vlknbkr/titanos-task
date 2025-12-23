import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * ChannelPage:
 * - Navigate channels
 * - Validate selected channel changes (meaningful state validation)
 */
export class ChannelPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.root = page.locator('[data-testid="channels-page"], [data-testid*="channel"], main').first();
    this.channelsList = page.locator('[data-testid*="channel-list"], [data-testid*="channels"], [aria-label*="Channel"]').first();

    this.channelTiles = page.locator('[data-testid^="channel-"], [data-testid*="channel-tile"], [data-testid*="channel-item"]');
    this.channelInfo = page.locator('[data-testid*="channel-info"], [data-testid*="program-info"], [aria-label*="Now playing"]').first();
  }

  async openChannels() {
    // Many apps have /channels route, but be safe with open base and then navigate
    // If the app supports direct route, this will work.
    await this.open('/channels').catch(async () => {
      await this.open('/');
    });

    await this.waitForAppReady();
  }

  async expectOnChannels() {
    await expect(this.root).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Get selected channel label
   */
  async getSelectedChannelLabel() {
    // Prefer "focused" as selection state in TV UIs
    const focused = this.page.locator(this.focusedAttributeSelector()).first();
    if (await focused.isVisible().catch(() => false)) {
      return (await this.getElementLabel(focused)).trim();
    }

    // fallback: aria-selected channel
    const selected = this.page.locator('[aria-selected="true"]').first();
    if (await selected.isVisible().catch(() => false)) {
      return (await this.getElementLabel(selected)).trim();
    }
    return '';
  }

  async getChannelInfoText() {
    if (await this.channelInfo.isVisible().catch(() => false)) {
      return (await this.channelInfo.textContent())?.trim() ?? '';
    }
    return '';
  }

  /**
   * Move selection and assert it really changed.
   */
  async moveToNextChannelAndAssertChange(direction = 'down') {
    await this.expectOnChannels();

    const beforeLabel = await this.getSelectedChannelLabel();
    const beforeInfo = await this.getChannelInfoText();

    if (direction === 'down') await this.remote.down();
    if (direction === 'up') await this.remote.up();

    // Assert selection label changes or channel info updates
    await expect(async () => {
      const afterLabel = await this.getSelectedChannelLabel();
      const afterInfo = await this.getChannelInfoText();

      const changedLabel = afterLabel && afterLabel !== beforeLabel;
      const changedInfo = afterInfo && afterInfo !== beforeInfo;

      expect(changedLabel || changedInfo, `Expected channel selection/info to change after moving ${direction}`).toBeTruthy();
    }).toPass({ timeout: 12_000 });
  }
}