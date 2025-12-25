import { test as base, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage.js';
import { AppsPage } from '../pages/AppsPage.js';
import { ChannelsPage } from '../pages/ChannelsPage.js';
import { SearchPage } from '../pages/SearchPage.js';

export const test = base.extend({

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  appsPage: async ({ page }, use) => {
    await use(new AppsPage(page));
  },

  channelsPage: async ({ page }, use) => {
    await use(new ChannelsPage(page));
  },

  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
});

export { expect };