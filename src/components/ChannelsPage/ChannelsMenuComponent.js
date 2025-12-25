import { expect } from '@playwright/test';

export class ChannelsMenuComponent {
  static SELECTORS = {
    container: '#channels-menu[role="menu"]',
    group: '[role="group"][aria-label="Channels menu"]',
    backBtn: '[data-testid="channels-back-button"]',
    myChannelsBtn: '[data-testid="channels-open-my-channels-button"]',
    addRemoveBtn: '[data-testid="channels-delete-from-my-channels-button"]',
    epgBtn: '[data-testid="channels-open-epg-button"]'
  };

  constructor(root, page) {
    this.root = root; // Consistent annotation
    this.page = page;
  }

  // Lazy locators
  menu() { return this.root.locator(ChannelsMenuComponent.SELECTORS.container); }
  group() { return this.menu().locator(ChannelsMenuComponent.SELECTORS.group); }
  
  backButton() { return this.menu().locator(ChannelsMenuComponent.SELECTORS.backBtn); }
  myChannelsButton() { return this.menu().locator(ChannelsMenuComponent.SELECTORS.myChannelsBtn); }
  addRemoveButton() { return this.menu().locator(ChannelsMenuComponent.SELECTORS.addRemoveBtn); }
  allChannelsButton() { return this.menu().locator(ChannelsMenuComponent.SELECTORS.epgBtn); }

  async waitUntilReady() {
    await expect(this.menu(), 'Channels menu container should exist').toBeAttached();
    await expect(this.group(), 'Channels menu group should exist').toBeAttached();
    await expect(this.menu(), 'Channels menu content-ready should be true')
      .toHaveAttribute('data-content-ready', 'true');
  }

  async isClosed() {
    const transform = await this.group().evaluate(el => el.style.transform || '');
    return transform.includes('translateX(-100%)'); // Matches DOM style
  }

  async waitUntilOpen() {
    await this.waitUntilReady();
    await expect
      .poll(() => this.isClosed(), { timeout: 15000, message: 'Channels menu did not open' })
      .toBe(false);
  }

  async waitUntilClosed() {
    await this.waitUntilReady();
    await expect
      .poll(() => this.isClosed(), { timeout: 15000, message: 'Channels menu did not close' })
      .toBe(true);
  }
}