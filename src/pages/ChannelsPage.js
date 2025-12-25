import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { ChannelsOverlayComponent } from '../components/ChannelsPage/ChannelsOverlayComponent.js';

export class ChannelsPage extends BasePage {
  constructor(page) {
    super(page);
    this.overlay = new ChannelsOverlayComponent(page);
  }

  async open() {
    await this.page.goto('channels'); //
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.overlay.rootLocator()).toBeVisible();
    await expect.poll(() => this.overlay.channelInfo.isContentReady(), { timeout: 15000 }).toBe(true);
  }

  async openMenu() {
    await this.isLoaded();
    await this.remote.longPressSelect();

    // 1. Wait for the menu to physically open (animation)
    await this.overlay.menu.waitUntilOpen();

    // 2. FIX: Explicitly wait for focus to move from the background to the menu.
    // Usually, the first item ("Back") receives focus automatically.
    await this.remote.assertFocused(this.overlay.menu.backButton());
  }

  async toggleFavoriteCurrentChannel() {
    // This now ensures focus is inside the menu
    await this.openMenu();

    // 3. Navigate to "Add to my channels"
    // Since we verified focus is on "Back", these 2 steps are now reliable.
    await this.remote.down(2);

    const addBtn = this.overlay.menu.addRemoveButton();

    // 4. Perform the selection (this internally calls assertFocused)
    await this.remote.select(addBtn);

    await this.remote.back();
    await this.overlay.menu.waitUntilClosed();
  }

  async switchChannel(direction = 'down', steps = 1) {
    const beforeKey = await this.overlay.channelInfo.currentKey();
    if (direction === 'down') await this.remote.down(steps);
    else await this.remote.up(steps);
    await this.overlay.channelInfo.waitForChannelChange(beforeKey);
  }
}