import { test as base, expect } from '@playwright/test';
import { AppsPage } from '../pages/AppsPage.js';
import { HomePage } from '../pages/HomePage.js';
import { ChannelsPage } from '../pages/ChannelsPage.js';
import { SearchPage } from '../pages/SearchPage.js';
import { PlayerPage } from '../pages/PlayerPage.js';
import { APPS_DATA } from '../test-data/test.data.js';

export const test = base.extend({
  cleanFavState: async ({ homePage }, use) => {
    const app = APPS_DATA.NEWS_APP;

    // 1- go to app.url
    await homePage.navigate(app.url);

    const favButton = homePage.page.locator('[id="app-fav-button"]');
    await favButton.waitFor({ state: 'visible', timeout: 30000 });

    // Check loading state
    await expect(favButton).toHaveAttribute('data-loading', 'false', { timeout: 30000 });

    // 2- check the add to Favorites button
    const text = await favButton.textContent();
    const isAdded = text?.toLowerCase().includes('remove'); // If it says "Remove", it is added.

    // 4- if instead of add to favorites button, remove from favorites button exist.
    if (isAdded) {
      // 4.1- click the button
      await homePage.remote.select(favButton);
      // Wait for button to disappear (page reload)
      await favButton.waitFor({ state: 'detached', timeout: 60000 });
      await expect(favButton).toHaveText(/add to/i, { timeout: 60000 });
    }

    // 3- return the homepage
    await homePage.open();

    await use(app);
  },

  readyToDeleteState: async ({ homePage }, use) => {
    const app = APPS_DATA.ENTERTAINMENT_APP;

    await homePage.navigate(app.url);

    const favButton = homePage.page.locator('[id="app-fav-button"]');
    await favButton.waitFor({ state: 'visible', timeout: 30000 });

    await expect(favButton).toHaveAttribute('data-loading', 'false', { timeout: 30000 });

    const text = await favButton.textContent();
    const isAdded = text?.toLowerCase().includes('remove');

    if (!isAdded) {
      // Click to add
      await homePage.remote.select(favButton);
      // Wait for button to disappear (page reload)
      await favButton.waitFor({ state: 'detached', timeout: 60000 });
      await homePage.page.waitForURL(process.env.BASE_URL, { timeout: 60000 });
      
    }
    if (homePage.page.url() == process.env.BASE_URL) {
      await homePage.isLoaded();
    } else {
      await homePage.open();
    }

    await use(app);
  },

  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  appsPage: async ({ page }, use) => { await use(new AppsPage(page)); },
  channelsPage: async ({ page }, use) => { await use(new ChannelsPage(page)); },
  searchPage: async ({ page }, use) => { await use(new SearchPage(page)); },
  playerPage: async ({ page }, use) => { await use(new PlayerPage(page)); }
});

export { expect };