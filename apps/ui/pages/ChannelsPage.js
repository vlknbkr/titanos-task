import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { ChannelsOverlayComponent } from '../components/ChannelsPage/ChannelsOverlayComponent.js';
import { assertFocused } from '../../../packages/shared/focus/index.js';

export class ChannelsPage extends BasePage {
  constructor(page) {
    super(page);
    this.overlay = new ChannelsOverlayComponent(page);
  }

  async open() {
    await this.navigate('channels');
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.overlay.rootLocator()).toBeVisible();
    await expect.poll(() => this.overlay.channelInfo.isContentReady(), { timeout: 15000 }).toBe(true);
  }

  async openMenu() {
    await this.isLoaded();
    await this.remote.select();

    await this.overlay.menu.waitUntilOpen();

    await this.remote.left();
    await this.remote.up();

    await this.remote.select(this.overlay.menu.backButton());
  }

  async testFavoriteFullCycle() {
    await this.openMenu();

    await this.remote.down(2);
    const toggleBtn = this.overlay.menu.favoriteToggleButton();

    const initialState = await this.overlay.menu.getToggleAction();

    // Fix: Ensure the button is focused before action.
    // Although remote.select() checks focus, the navigation (remote.down) is blind.
    // We must wait for the focus to land on the button.
    await assertFocused(toggleBtn);

    await this.remote.select(toggleBtn);

    await expect.poll(async () => await this.overlay.menu.getToggleAction(), {
      timeout: 8000,
      message: "Button ID should have flipped after first selection"
    }).not.toBe(initialState);

    await this.remote.select(toggleBtn);

    await expect.poll(async () => await this.overlay.menu.getToggleAction(), {
      timeout: 8000,
      message: "Button ID should have returned to initial state"
    }).toBe(initialState);

    await this.overlay.menu.waitUntilClosed();
  }


  async switchChannel(direction = 'down', steps = 2) {
    if (!await this.overlay.rootLocator().isVisible()) {
      await this.remote.select();
    }

    const beforeKey = await this.overlay.channelInfo.currentKey();

    // Fix: Ensure we have focus on the switcher before navigating
    // This prevents "lost keystrokes" if the menu close animation isn't fully settled
    // or if focus was not correctly restored.
    await assertFocused(this.overlay.channelInfo.switcher());

    // assertFocused on L75 already guarantees the switcher is focused and ready.

    if (direction === 'down') await this.remote.down(steps);
    else await this.remote.up(steps);
    await this.overlay.channelInfo.waitForChannelChange(beforeKey);
  }

  async getCurrentChannelInfo() {
    if (!await this.overlay.rootLocator().isVisible()) {
      await this.remote.select();
    }
    const key = await this.overlay.channelInfo.currentKey();
    const parts = key.split('|');
    return { id: parts[0], number: parts[1], title: parts[2] };
  }
}