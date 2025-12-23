import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { AppsPage } from '../pages/AppsPage.js';
import { ChannelPage } from '../pages/ChannelPage.js';
import { SearchPage } from '../pages/SearchPage.js';
import { FavoritesFlow } from '../flows/FavoritesFlow.js';

/**
 * Fixtures are kept explicit and minimal:
 * - Provide ready-to-use page objects
 * - Provide a shared flow for Favorites
 * - Do NOT hide navigation or implicit side effects
 */
export const test = base.extend({
    homePage: async ({ page }, use) => {
        const home = new HomePage(page);
        await use(home);
    },

    appsPage: async ({ page }, use) => {
        const apps = new AppsPage(page);
        await use(apps);
    },

    channelPage: async ({ page }, use) => {
        const channel = new ChannelPage(page);
        await use(channel);
    },

    searchPage: async ({ page }, use) => {
        const search = new SearchPage(page);
        await use(search);
    },

    favoritesFlow: async ({ page }, use) => {
        const flow = new FavoritesFlow(page);
        await use(flow);
    },
});

export { expect };