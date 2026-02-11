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

    await homePage.page.goto(app.url, { waitUntil: 'domcontentloaded' });
    await homePage.page.waitForTimeout(2000);
    const favButton = homePage.page.locator('[id="app-fav-button"]');
    await favButton.waitFor({ state: 'visible', timeout: 30000 });


    // 2- check the add to Favorites button
    const text = await favButton.textContent();
    console.log("fav button text context is: ", text);
    const isAdded = text?.toLowerCase().includes('remove'); // If it says "Remove", it is added.

    // 4- if instead of add to favorites button, remove from favorites button exist.
    if (isAdded) {
      await homePage.remote.select(favButton)
      // Allow UI to settle
      await homePage.page.waitForTimeout(1000);
      await expect(favButton).toHaveAttribute('data-loading', 'false', { timeout: 200000 });
      await expect(favButton).toHaveText("Add to Favourites");
    }

    await homePage.open();

    await use(app);
  },

  readyToDeleteState: async ({ homePage }, use) => {
    const app = APPS_DATA.ENTERTAINMENT_APP;

    await homePage.page.goto(app.url, { waitUntil: 'domcontentloaded' });

    const favButton = homePage.page.locator('[id="app-fav-button"]');
    const openButton = homePage.page.locator('[id="app-open-button"]');

    const focusValue = await openButton.getAttribute('data-focused');
    const isOpenButtonFocused = focusValue === 'true';

    if (isOpenButtonFocused) {
      await homePage.remote.left();
      const isFavButtonFocused = await favButton.getAttribute('data-focused');
      await expect(isFavButtonFocused).toBe("true");
    }

    const text = await favButton.textContent();
    const isReadyToAdd = text?.toLowerCase().includes('add');

    if (isReadyToAdd) {
      await homePage.remote.select(favButton);
      await homePage.page.waitForURL(process.env.BASE_URL, { timeout: 150000 });
      await homePage.isLoaded();
      await homePage.remote.select();
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