import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage.js";
import { AppsPage } from "../pages/AppsPage.js";
import { SearchPage } from "../pages/SearchPage.js";
import { ChannelPage } from "../pages/ChannelPage.js";

// Extend base test with your page objects
export const test = base.extend({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    appsPage: async ({ page }, use) => {
        await use(new AppsPage(page));
    },
    searchPage: async ({ page }, use) => {
        await use(new SearchPage(page));
    },
    channelPage: async ({ page }, use) => {
        await use(new ChannelPage(page));
    },
});

export { expect } from "@playwright/test";