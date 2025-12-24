// src/components/ChannelsMenuComponent.js
import { expect } from '@playwright/test';

export class ChannelsMenuComponent {
    /**
     * @param {import('@playwright/test').Locator} root  // overlay root
     * @param {import('@playwright/test').Page} page
     */
    constructor(root, page) {
        this._root = root;
        this.page = page;

        this.menu = this._root.locator('#channels-menu[role="menu"]');
        this.group = this.menu.locator('[role="group"][aria-label="Channels menu"]');

        this._backButton = this.menu.locator('[data-testid="channels-back-button"][role="menuitem"]');
        this._myChannelsButton = this.menu.locator('[data-testid="channels-open-my-channels-button"][role="menuitem"]');
        this._addToMyChannelsButton = this.menu.locator('[data-testid="channels-delete-from-my-channels-button"][role="menuitem"]');
        this._allChannelsButton = this.menu.locator('[data-testid="channels-open-epg-button"][role="menuitem"]');
    }

    root() {
        return this.menu;
    }

    backButton() {
        return this._backButton;
    }

    myChannelsButton() {
        return this._myChannelsButton;
    }

    addToMyChannelsButton() {
        return this._addToMyChannelsButton;
    }

    allChannelsButton() {
        return this._allChannelsButton;
    }

    async waitUntilReady() {
        await expect(this.menu, 'Channels menu container should exist').toBeAttached();
        await expect(this.menu, 'Channels menu should be visible').toBeVisible();
        await expect(this.menu, 'Channels menu content-ready should be true')
            .toHaveAttribute('data-content-ready', 'true');
    }

    async isOpen() {
        await expect(this.group).toBeAttached();
        const transform = await this.group.evaluate((el) => getComputedStyle(el).transform);
        return transform !== 'none'; 
    }

    async waitUntilOpen() {
        await this.waitUntilReady();
        await expect
            .poll(async () => {
                const style = (await this.group.getAttribute('style')) || '';
                return !style.includes('translateX(-100%');
            }, { timeout: 15000, message: 'Channels menu did not open' })
            .toBe(true);
    }

    async waitUntilClosed() {
        await expect(this.group).toBeAttached();
        await expect
            .poll(async () => {
                const style = (await this.group.getAttribute('style')) || '';
                return style.includes('translateX(-100%');
            }, { timeout: 15000, message: 'Channels menu did not close' })
            .toBe(true);
    }
}