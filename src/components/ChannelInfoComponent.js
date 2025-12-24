// src/components/ChannelInfoComponent.js
import { expect } from '@playwright/test';

export class ChannelInfoComponent {
    /**
     * @param {import('@playwright/test').Locator} root  // overlay root
     * @param {import('@playwright/test').Page} page
     */
    constructor(root, page) {
        this._root = root;
        this.page = page;

        this.panel = this._root.locator('#channel-info[role="list"][aria-label="Channels"]');
        this._switcher = this.panel.locator('[data-testid="channels-switcher"][role="listitem"]');

        this.meta = this._switcher.locator('[data-channel-id][data-channel-title][data-channel-number]');
    }

    root() {
        return this.panel;
    }

    switcher() {
        return this._switcher;
    }

    async isContentReady() {
        const ready = await this.panel.getAttribute('data-content-ready');
        return ready === 'true';
    }

    async waitUntilReady() {
        await expect(this.panel, 'Channel info panel should be visible').toBeVisible();
        await expect(this.panel, 'Channel info should be content-ready')
            .toHaveAttribute('data-content-ready', 'true');

        await expect(this._switcher, 'Channels switcher should exist').toBeVisible();
    }

    async currentLabel() {
        return (await this._switcher.getAttribute('aria-label'))?.trim() ?? '';
    }

    async currentChannelId() {
        return (await this.meta.getAttribute('data-channel-id'))?.trim() ?? '';
    }

    async currentChannelNumber() {
        return (await this.meta.getAttribute('data-channel-number'))?.trim() ?? '';
    }

    async currentChannelTitle() {
        return (await this.meta.getAttribute('data-channel-title'))?.trim() ?? '';
    }

    async waitForChannelChange(previousLabel, { timeout = 15000 } = {}) {
        await this.waitUntilReady();

        await expect
            .poll(async () => await this.currentLabel(), { timeout })
            .not.toBe(previousLabel);
    }
}