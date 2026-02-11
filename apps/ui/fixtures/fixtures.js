import { test as base, expect } from '@playwright/test';
import { AppsPage } from '../pages/AppsPage.js';
import { HomePage } from '../pages/HomePage.js';
import { ChannelsPage } from '../pages/ChannelsPage.js';
import { SearchPage } from '../pages/SearchPage.js';
import { PlayerPage } from '../pages/PlayerPage.js';
import { APPS_DATA } from '../test-data/test.data.js';
import { isTruthyFocusValue } from '../../../packages/shared/focus/focusReader.js';

export const test = base.extend({
  cleanFavState: async ({ homePage }, use) => {
    const app = APPS_DATA.NEWS_APP;

    await homePage.page.goto(app.url, { waitUntil: 'domcontentloaded' });
    await homePage.page.waitForTimeout(1000);

    const favButton = homePage.page.locator('[id="app-fav-button"]');
    const openButton = homePage.page.locator('[id="app-open-button"]');

    const focusValue = await openButton.getAttribute('data-focused');
    const isOpenButtonFocused = isTruthyFocusValue(focusValue);

    if (isOpenButtonFocused) {
      await homePage.remote.left();
      const isFavButtonFocused = await favButton.getAttribute('data-focused');
      expect(isTruthyFocusValue(isFavButtonFocused)).toBe(true);
    }

    const text = await favButton.textContent();
    const isReadyToRemove = text?.trim() === 'Remove from Favourites';

    if (isReadyToRemove) {
      await homePage.remote.select(favButton);
      await expect(favButton).toHaveAttribute('data-loading', 'false', { timeout: 50000 });
      await expect(favButton).toHaveText("Add to Favourites");
    } else {
      console.log("else içerisinde, fav button text context is: ", text);

      await homePage.open();
    }

    await use(app);
  },

  readyToDeleteState: async ({ homePage }, use) => {
    const app = APPS_DATA.ENTERTAINMENT_APP;

    await homePage.page.goto(app.url, { waitUntil: 'domcontentloaded' });
    await homePage.page.waitForTimeout(1000);

    const favButton = homePage.page.locator('[id="app-fav-button"]');
    const openButton = homePage.page.locator('[id="app-open-button"]');

    const focusValue = await openButton.getAttribute('data-focused');
    const isOpenButtonFocused = isTruthyFocusValue(focusValue);

    if (isOpenButtonFocused) {
      await homePage.remote.left();
      const isFavButtonFocused = await favButton.getAttribute('data-focused');
      expect(isTruthyFocusValue(isFavButtonFocused)).toBe(true);
    }

    const text = await favButton.textContent();
    const isReadyToAdd = text?.trim() === 'Add to Favourites';

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