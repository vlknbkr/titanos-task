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
    await this.remote.select();

    // 1. Synchronize on the menu animation
    await this.overlay.menu.waitUntilOpen();

    // 2. FIX: Shift focus from background content to the sidebar
    // Based on your DOM (translateX(-100%)), the menu is on the left.
    await this.remote.left();
    await this.remote.up();

    // 3. Confirm focus handover was successful
    await this.remote.select(this.overlay.menu.backButton());
  }

  async testFavoriteFullCycle() {
    await this.openMenu();

    // 1. Navigate to the button (CH 5003 menu has 2 steps down to favorite)
    await this.remote.down(2);
    const toggleBtn = this.overlay.menu.favoriteToggleButton();

    // 2. Detect Initial State
    const initialState = await this.overlay.menu.getToggleAction();
    console.log(`Initial state is: ${initialState}`);

    // 3. First Interaction (e.g., if 'add', this adds it)
    await this.remote.select(toggleBtn);

    // 4. Verify state flipped (Polling is critical here as IDs swap via React/Vue)
    await expect.poll(async () => await this.overlay.menu.getToggleAction(), {
      timeout: 8000,
      message: "Button ID should have flipped after first selection"
    }).not.toBe(initialState);

    // 5. Second Interaction (e.g., if it was 'add', this now 'deletes' it)
    // We don't need to re-navigate; focus stays on this slot
    await this.remote.select(toggleBtn);

    // 6. Verify return to Initial State
    await expect.poll(async () => await this.overlay.menu.getToggleAction(), {
      timeout: 8000,
      message: "Button ID should have returned to initial state"
    }).toBe(initialState);

    await this.overlay.menu.waitUntilClosed();
  }


  async switchChannel(direction = 'down', steps = 2) {
    await this.remote.select();

    const beforeKey = await this.overlay.channelInfo.currentKey();
    if (direction === 'down') await this.remote.down(steps);
    else await this.remote.up(steps);
    await this.overlay.channelInfo.waitForChannelChange(beforeKey);
  }
}