import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { AppsPage } from '../pages/AppsPage.js';

/**
 * FavoritesFlow:
 * Cross-page orchestration for add/remove favorites.
 * Prevents duplication and reduces test flakiness.
 */
export class FavoritesFlow {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.home = new HomePage(page);
    this.apps = new AppsPage(page);
  }

  async openHome() {
    await this.home.openHome();
    await this.home.stabilizeInitialFocus();
  }

  /**
   * Add an app to favorites from Apps page.
   * @param {string} category
   * @param {string} appName
   */
  async addAppToFavorites(category, appName) {
    await this.openHome();
    await this.home.goToApps();
    await this.apps.expectOnAppsPage();

    await this.apps.focusAppInCategory(category, appName);
    await this.apps.openFocusedApp();
    await this.apps.addFocusedAppToFavorites();
    await this.apps.goBackToHome();

    // Validate app appears in favorites by focusing it
    await this.home.openHome();
    await this.home.focusFavoriteByName(appName);
    const focused = this.home.focusedGlobal();
    const label = (await this.home.getElementLabel(focused)).toLowerCase();
    expect(label.includes(appName.toLowerCase()), `Expected "${appName}" to be focusable in favorites after adding`).toBeTruthy();
  }

  /**
   * Remove an app from favorites from Home favorites row.
   * To avoid false positives, we:
   * - focus exact app by name
   * - verify focused label matches before long-press delete
   * - validate it disappears (polling)
   *
   * @param {string} appName
   */
  async removeAppFromFavorites(appName) {
    await this.openHome();

    const focusedBefore = await this.home.focusFavoriteByName(appName);
    const labelBefore = (await this.home.getElementLabel(focusedBefore)).toLowerCase();

    expect(labelBefore.includes(appName.toLowerCase()), `Safety check: focused tile must be "${appName}" before delete`).toBeTruthy();

    // Long press to open options
    await this.home.remote.longPressEnter(950);

    // Try to find delete/remove option
    const deleteOption = this.page.locator(
      '[data-testid*="delete"], [aria-label*="Delete"], text=/delete/i, text=/remove/i'
    ).first();

    await expect(deleteOption, 'Expected delete/remove option after long press').toBeVisible({ timeout: 8_000 });

    await deleteOption.click().catch(async () => {
      // If not clickable, use remote select
      await this.home.remote.select();
    });

    // Validate disappearance: appName no longer focusable in favorites
    await expect(async () => {
      await this.home.openHome();
      // Try to scan; if scan fails, that's good (means it disappeared)
      try {
        await this.home.focusFavoriteByName(appName);
        // if we can still focus it, fail
        throw new Error('App still present');
      } catch (e) {
        // If scanFocusUntil throws, it likely disappeared. Confirm by checking no tile contains label.
        const any = this.page.locator(`xpath=//*[contains(translate(@aria-label,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"), "${appName.toLowerCase()}")]`);
        const count = await any.count().catch(() => 0);
        expect(count, `Expected "${appName}" to be removed from favorites`).toBe(0);
      }
    }).toPass({ timeout: 20_000 });
  }

  /**
   * Verify a protected app cannot be deleted (e.g., Watch TV).
   * @param {string} appName
   */
  async expectAppNotDeletable(appName) {
    await this.openHome();
    const focused = await this.home.focusFavoriteByName(appName);
    const label = (await this.home.getElementLabel(focused)).toLowerCase();
    expect(label.includes(appName.toLowerCase()), `Expected "${appName}" to be focusable`).toBeTruthy();

    await this.home.remote.longPressEnter(950);

    const deleteOption = this.page.locator(
      '[data-testid*="delete"], [aria-label*="Delete"], text=/delete/i, text=/remove/i'
    ).first();

    // We expect NOT visible OR disabled OR absent
    const visible = await deleteOption.isVisible().catch(() => false);
    if (visible) {
      const disabled = await deleteOption.isDisabled().catch(() => false);
      expect(disabled, `Expected delete option to be disabled for protected app "${appName}"`).toBeTruthy();
    } else {
      expect(visible, `Expected delete option to NOT be visible for protected app "${appName}"`).toBeFalsy();
    }
  }
}