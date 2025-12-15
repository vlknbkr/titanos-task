
import { BasePage } from '../core/BasePage.js';
import { expect } from '@playwright/test';
import { TITAN_OS_LOCATORS } from '../locators/locators.js';

export class SearchPage extends BasePage {
    constructor(page) {
        super(page);
        this.searchInput = page.locator(TITAN_OS_LOCATORS.SEARCH_INPUT);
        this.categoryList = page.locator(TITAN_OS_LOCATORS.CATEGORY_LIST);
        this.categoryCard = (name) => page.locator(TITAN_OS_LOCATORS.CATEGORY_CARD(name));
    }

    async open() {
        await this.goto('search');
    }


    async openCategory(categoryName) {

        await expect(this.searchInput).toBeVisible();
        await this.remote.down();
        const target = this.categoryCard(categoryName);
        await this.expectFocused(target);
        await this.remote.select();
    }

    async getCategoryList() {
        const lists = this.categoryList.locator('[role="listitem"]');
        return await lists.evaluateAll(elements => elements.map(el => el.getAttribute('aria-label')));
    }
}
