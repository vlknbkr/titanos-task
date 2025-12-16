import { expect } from '@playwright/test';
import { BasePage } from '../core/BasePage.js';


export class ChannelPage extends BasePage {
    constructor(page) {
        super(page);

        // Locators (defined centrally for maintainability)
        this.menuItem = page.locator('[role="menuitem"][aria-label="Channels"]');
        this.landedFocusElement = page.locator('[data-testid="channels-switcher"]');
        this.pageHeader = page.locator('text="My channels"');
        this.globalLoader = page.locator('[data-loading="true"]');
        this.channelListItems = page.locator('[role="listitem"]');
    }
    async open() {
        await this.goto('channels');
    }

    /**
     * Verifies the Channels page is fully loaded and ready for use.
     * Checks Navigation State -> System Stability -> Content Visibility.
     */
    async verifyChannelsPageIsAvailable() {
        await expect(this.menuItem).toBeVisible();
        await expect(this.menuItem).toHaveAttribute('aria-selected', 'true');

        await expect(this.pageHeader).toBeVisible();
        
        await this.expectFocused(this.landedFocusElement);
    }
}