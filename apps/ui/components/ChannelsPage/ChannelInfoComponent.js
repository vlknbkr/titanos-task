import { expect } from '@playwright/test';

export class ChannelInfoComponent {
  static SELECTORS = {
    container: '#channel-info[role="list"][aria-label="Channels"]',
    switcher: '[data-testid="channels-switcher"][role="listitem"]',
    meta: '[data-channel-id][data-channel-title][data-channel-number]'
  };

  constructor(root, page) {
    this.root = root;
    this.page = page;
  }

  panel() { return this.root.locator(ChannelInfoComponent.SELECTORS.container); }
  switcher() { return this.panel().locator(ChannelInfoComponent.SELECTORS.switcher); }
  meta() { return this.switcher().locator(ChannelInfoComponent.SELECTORS.meta); }

  async isContentReady() {
    return (await this.panel().getAttribute('data-content-ready')) === 'true';
  }

  async currentKey() {
    // Ensure we are reading the key of the FOCUSED channel.
    // Selector policy allows "true" or "focused".
    // We use CSS OR logic via comma separated selectors or just check for attribute presence if safe.
    // Ideally: [data-focused="true"], [data-focused="focused"]
    const focusedMeta = this.panel()
      .locator(`${ChannelInfoComponent.SELECTORS.switcher}[data-focused="true"] ${ChannelInfoComponent.SELECTORS.meta}, ${ChannelInfoComponent.SELECTORS.switcher}[data-focused="focused"] ${ChannelInfoComponent.SELECTORS.meta}`);

    const id = (await focusedMeta.getAttribute('data-channel-id'))?.trim() ?? '';
    const num = (await focusedMeta.getAttribute('data-channel-number'))?.trim() ?? '';
    const title = (await focusedMeta.getAttribute('data-channel-title'))?.trim() ?? '';
    const key = `${id}|${num}|${title}`;
    return key === '||' ? '' : key;
  }

  async waitForChannelChange(previousKey, { timeout = 15000 } = {}) {
    await expect
      .poll(async () => await this.currentKey(), { timeout })
      .not.toBe(previousKey);
  }
}