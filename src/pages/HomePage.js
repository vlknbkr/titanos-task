import { BasePage } from '../core/BasePage.js';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';
import { expect } from '@playwright/test';

export class HomePage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {import('../core/BasePage.js').BasePage} [options]
     */
    constructor(page, options = {}) {
        super(page, options);

        this.menuItem = page.locator(TITAN_OS_LOCATORS.MENU_ITEM('Home'));
        this.favList = page.locator(TITAN_OS_LOCATORS.FAVOURITE_APPS_CONTAINER);
        this.favApp = (appName) => page.locator(TITAN_OS_LOCATORS.FAVORITE_APP(appName));
    }

    async open() {
        await this.goto('');
        await this.waitForHomeReady();
    }

    async waitForHomeReady() {
        await this.waitForSpaReady();
        await expect(this.menuItem).toHaveAttribute('aria-selected', 'true');
        await expect(this.favList, 'Favorites container is not visible').toBeVisible();

        await expect
            .poll(async () => await this.favList.count(), { timeout: 20000 })
            .toBeGreaterThan(0);

        console.log('Home Page is ready');
    }

    async getFavoriteAppIndex(appName) {
        const lists = this.favList.locator('[role="listitem"]');
        const count = await lists.count();

        for (let colIndex = 0; colIndex < count; colIndex++) {
            const element = lists.nth(colIndex);
            const label = await element.getAttribute('aria-label');
            if (label && label.trim().toLowerCase() === appName.trim().toLowerCase()) {
                return colIndex;
            }
        }
        return -1;
    }

    async isFavoritePresent(appName) {
        await this.waitUntilFavListLoad();
        return (await this.getFavoriteAppIndex(appName)) >= 0;
    }

    async navigateToAppInFavList(appName) {
        const index = await this.getFavoriteAppIndex(appName);
        if (index < 0) {
            throw new Error(`Favorite app not found: ${appName}`);
        }
        await this.remote.right(index);
    }


    async removeFavorite(appName) {
        await this.waitForHomeReady();
        await this.navigateToAppInFavList(appName);

        console.log(`Removing favorite: ${appName}`);
        await this.remote.longPressSelect();

        await this.remote.down();
        await this.remote.select();

        await this.waitForSpaReady();
    }

    async deleteAppFromFavlist(appName) {
        await this.removeFavorite(appName);
    }

    async ensureAppNotExistInFavList(appName) {
        await this.waitForHomeReady();
        await this.waitUntilFavListLoad();

        if (await this.isFavoritePresent(appName)) {
            await this.removeFavorite(appName);
        }
        await this.expectAppNotExistInFavList(appName);
    }

    async waitUntilFavListLoad() {
        await this.waitForHomeReady();
        await expect(this.favApp("Watch TV"), 'Favorites container is not visible')
            .toBeVisible();
    }

    async expectAppExistInFavList(appName) {
        await this.waitForHomeReady();

        await expect
            .poll(async () => await this.getFavoriteAppIndex(appName), { timeout: 20000 })
            .toBeGreaterThanOrEqual(1);

        console.log(`Favorite exists: ${appName}`);
    }

    async expectAppNotExistInFavList(appName) {
        await this.open();

        await expect
            .poll(async () => await this.getFavoriteAppIndex(appName), { timeout: 20000 })
            .toBe(-1);

        console.log(`Favorite absent: ${appName}`);
    }
}
