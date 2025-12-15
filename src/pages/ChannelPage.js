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
        // 1. Critical Element Visible: Verify menu item exists
        await expect(this.menuItem).toBeVisible();

        // 2. Correct Page State: Verify "Channels" is the active page
        // This ensures the SPA routing actually updated the active state
        await expect(this.menuItem).toHaveAttribute('aria-selected', 'true');


        // 4. Page Content Ready: Verify the specific page text is rendered
        await expect(this.pageHeader).toBeVisible();

        // 5. INTERACTION SAFETY (The "TV" Requirement)
        // We must prove the focus is NOT lost. 
        // The app uses "Virtual Focus" (data-focused attribute), not native browser focus.
        await this.expectFocused(this.landedFocusElement);
    }
}