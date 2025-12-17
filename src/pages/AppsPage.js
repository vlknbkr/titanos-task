import { BasePage } from '../core/BasePage.js';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';
import { expect } from '@playwright/test';

export class AppsPage extends BasePage {
    constructor(page) {
        super(page);
        this.listSelector = this.page.locator(TITAN_OS_LOCATORS.LIST_SELECTOR);
        this.addToFavBtnLocator = this.page.locator(
            TITAN_OS_LOCATORS.ADD_TO_FAVORITES_BUTTON
        );
    }

    async open() {
        await this.goto('page/499');
        await this.waitUntilAppsReady();
    }

    /**
     * Navigate to a specific app using remote navigation.
     * Cursor initially starts on the header, so we offset rows accordingly.
     */
    async navigateToApp(featureName, itemName) {
        const coordinates = await this.getAppCoordinates(
            this.listSelector,
            featureName,
            itemName
        );
        const headerOfset = 2;

        if (!coordinates) {
            throw new Error(`App not found: ${featureName} - ${itemName}`);
        }

        const { rowIndex, colIndex } = coordinates;

        await this.remote.down(rowIndex + headerOfset);
        await this.remote.right(colIndex);
    }

    /**
     * Selects the "Add to Favourites" button if applicable.
     * Does NOT handle navigation after the action.
     */
    async addToFavoritesButton() {
        const button = this.addToFavBtnLocator;

        await expect(button, "Add to Favorites button is not visible.").toBeVisible();
        await expect(button, "Add to Favorites button does not focused.").toHaveAttribute('data-focused', 'true');

        const text = (await button.textContent())?.trim();

        if (text === 'Add to Favourites') {
            console.log("button text : ", text);
            await this.remote.select();
        }
        await this.page.waitForURL(process.env.BASE_URL, { timeout: 10000 });
    }

    /**
     * Full flow to add an app to favorites from the Apps page.
     */
    async addAppToFavList(featureName, appName) {
        await this.open();
        await this.navigateToApp(featureName, appName);

        // Open app details
        await this.remote.select();

        // Add to favorites if needed
        await this.addToFavoritesButton();
    }

    /**
     * Finds the coordinates (row and column index) of an app within a category.
     * Case-insensitive match for both category and app name.
     */
    async getAppCoordinates(listContainer, categoryName, appName) {
        const lists = listContainer.locator(
            TITAN_OS_LOCATORS.LIST_ITEM_TESTID_PREFIX
        );

        const listsCount = await lists.count();
        const targetCategory = categoryName.trim().toLowerCase();
        const targetApp = appName.trim().toLowerCase();

        for (let rIndex = 0; rIndex < listsCount; rIndex++) {
            const list = lists.nth(rIndex);
            const label = await list.getAttribute('aria-label');

            if (label?.trim().toLowerCase() === targetCategory) {
                const items = list.locator(
                    TITAN_OS_LOCATORS.LIST_ITEM_ROLE
                );
                const itemsCount = await items.count();

                for (let cIndex = 0; cIndex < itemsCount; cIndex++) {
                    const testId = await items
                        .nth(cIndex)
                        .getAttribute('data-testid');

                    if (testId?.trim().toLowerCase() === targetApp) {
                        return { rowIndex: rIndex, colIndex: cIndex };
                    }
                }
            }
        }

        return null;
    }

    /**
     * Ensures the Apps page is fully loaded and usable.
     * Readiness is defined by the mini banner being rendered
     * with an active slide.
     */
    async waitUntilAppsReady() {
        await this.page.waitForTimeout(2000);
        const miniBanner = this.page.locator(
            TITAN_OS_LOCATORS.MINI_BANNER
        );

        await expect(async () => {
            const banners = miniBanner.locator('[role="listitem"]');
            const bannerCount = await banners.count();

            if (bannerCount === 0) {
                throw new Error('Mini banner items not rendered yet');
            }

            const activeFound = await banners.evaluateAll(items =>
                items.some(el =>
                    el.style.transform?.includes('translateX(0%)')
                )
            );

            if (!activeFound) {
                throw new Error('Mini banner active slide not ready yet');
            }
        }).toPass({
            intervals: [1000, 2000, 5000],
            timeout: 20000,
        });
    }
}