import { BasePage } from '../core/BasePage.js';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';
import { expect } from "@playwright/test";


/**
 * expectAppExistInFavList()
 * expectAppNotExistInFavList()
 * ensureAppExistInFavLİst()
 * ensureAppNotExistInFavList
 */

export class HomePage extends BasePage {
    constructor(page) {
        super(page);
        this.favoriteList = this.page.locator(TITAN_OS_LOCATORS.FAVOURITE_APPS_CONTAINER);
        this.favApp = (appName) => page.locator(TITAN_OS_LOCATORS.FAVORITE_APP(appName));
    }

    async open() {
        await this.goto();
        await this.waitUntilHomeReady();
    }

    async goToApp(appName) {
        const index = await this.getFavoriteAppIndex(appName);
        if (index < 0) {
            throw new Error(`Favorite app not found: ${appName}`);
        }
        await this.remote.right(index);
    }

    async deleteApp(appName) {
        await this.goToApp(appName);
        console.log(`App ${appName} is in favorites, deleting...`);
        await this.remote.longPressSelect();
        await this.remote.down();
        await this.remote.select();
    }

    async getFavoriteAppIndex(appName) {
        const lists = this.favoriteList.locator('[role="listitem"]');
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

    async ensureAppNotInFavorites(appName) {
        const app = this.favApp(appName);
        if (await app.isVisible()) {
            console.log("deleting function called")
            await this.deleteApp(appName);
        }
        await this.expectAppNotInFavorites(appName);
    }

    async ensureAppInFavorites(appName, featureName, appsPage) {
        const app = this.favApp(appName);
        if (!await app.isVisible()) {
            await appsPage.addAppToFavorites(featureName, appName);
        }
        await this.expectAppInFavorites(appName);
    }

    async expectAppInFavorites(appName) {
        const app = this.favApp(appName);
        //await this.waitUntilHomeReady();

        await expect(async () => {
            const visible = await app.isVisible();
            if (!visible) {
                throw new Error(`"${appName}" is not visible in favorites yet`);
            }
        }).toPass({
            intervals: [500, 1000, 2000],
            timeout: 10000,
        });
        console.log(`Success: "${appName}" is visible in favorites.`);
    }

    async expectAppNotInFavorites(appName) {
        const app = this.favApp(appName);
        await this.page.reload();
        await this.waitUntilHomeReady();

        await expect(async () => {
            const visible = await app.isVisible();
            if (visible) {
                throw new Error(`"${appName}" is still visible in favorites`);
            }
        }).toPass({
            intervals: [500, 1000, 2000],
            timeout: 10000,
        });
        console.log(`Success: "${appName}" is no longer visible in favorites.`);
    }

    async waitUntilHomeReady() {
        await this.page.waitForTimeout(2000);
        await expect(async () => {
            const containerCount = await this.favoritesContainer.count();
            if (containerCount === 0) {
                throw new Error('Favorites container not rendered yet');
            }

            const itemsCount = await this.favoritesContainer
                .locator('[role="listitem"]')
                .count();

            if (itemsCount === 0) {
                throw new Error('Favorites content not resolved yet');
            }

        }).toPass({
            intervals: [1000, 2000, 5000],
            timeout: 20000,
        });
    }
}
