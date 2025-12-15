import { BasePage } from '../core/BasePage.js';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';


export class HomePage extends BasePage {
    constructor(page) {
        super(page);
        this.favoriteList = this.page.locator(TITAN_OS_LOCATORS.FAVOURITE_APPS_CONTAINER);
    }

    async open() {
        await this.goto();
    }

    async goToApp(appName) {
        const index = await this.getFavoriteAppIndex(appName);
        if (index === false) {
            // If we can't find it via index, maybe we can't navigate to it. 
            // But deleteApp relies on this. If it returns false, we can't go to it.
            throw new Error(`App not found: ${appName}`);
        }
        let colIndex = index;
        await this.remote.right(colIndex);
    }

    getAppLocator(appName) {
        return this.page.locator(TITAN_OS_LOCATORS.FAVOURITE_APPS_CONTAINER)
            .locator('[role="listitem"]')
            .filter({ hasText: new RegExp(`^${appName}$`, 'i') });
    }

    async deleteApp(appName) {
        // 1. Focus the app
        await this.goToApp(appName);

        // 2. Open Menu
        await this.remote.longPressSelect();

        // 3. Navigate to Delete
        await this.remote.down();

        // 4. Confirm Delete
        await this.remote.select();
        await this.page.waitForTimeout(1000); // Wait for action
        await this.page.reload();
    }

    async getFavoriteAppIndex(appName) {
        const lists = favoriteList.locator('[role="listitem"]');
        const count = await lists.count();

        // Note: This relies on iteration which is okay for finding index for navigation
        for (let colIndex = 0; colIndex < count; colIndex++) {
            const element = lists.nth(colIndex);
            const label = await element.getAttribute('aria-label');
            if (label && label.trim().toLowerCase() === appName.trim().toLowerCase()) {
                return colIndex;
            }
        }
        return false;
    }
}
