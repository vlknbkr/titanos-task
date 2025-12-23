import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * HomePage:
 * - Page-level locators + interactions only
 * - No cross-test orchestration (that belongs to Flows)
 */
export class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Heuristic selectors (TV SPAs often change frequently)
    this.miniBanner = page.locator('[data-testid="mini-banner"], [data-testid="hero"], header').first();
    this.favoritesRow = page.locator('[data-testid*="favourite"], [data-testid*="favorite"], [aria-label*="Favour"], [aria-label*="Favor"]').first();

    // Generic tile pattern
    this.tiles = page.locator('[data-testid^="tile-"], [data-testid*="app-tile"], [data-testid*="tile"]');
  }

  async openHome() {
    await this.open('/');
    await this.waitForAppReady();
  }

  /**
   * Stabilize initial focus by nudging it into the banner area, then down to content.
   */
  async stabilizeInitialFocus() {
    // If banner exists, try to focus it
    if (await this.miniBanner.count()) {
      await this.page.focus('body');
      await this.remote.up(2);
      await this.page.waitForTimeout(200);
    }
    // move down into content
    await this.remote.down(2);
    await this.page.waitForTimeout(250);
  }

  /**
   * Return a locator for the current focused tile (global).
   */
  focusedGlobal() {
    return this.page.locator(this.focusedAttributeSelector()).first();
  }

  /**
   * Try to find a focused tile within favorites row.
   */
  focusedInFavorites() {
    return this.focusedWithin(this.favoritesRow).first();
  }

  /**
   * Attempt to open the Apps section from Home.
   * Because the UI structure can vary, we do best-effort navigation.
   */
  async goToApps() {
    // Usually Apps can be in the top nav or visible tiles
    const appsNav = this.page.locator('[data-testid*="nav-apps"], [aria-label="Apps"], [aria-label*="Apps"]').first();
    if (await appsNav.isVisible().catch(() => false)) {
      await appsNav.click({ timeout: 5_000 }).catch(() => {});
      await this.page.waitForTimeout(500);
      return;
    }

    // fallback: scan for tile labeled "Apps"
    await this.scanFocusUntil(
      this.page.locator('body'),
      async (focused) => {
        const label = await this.getElementLabel(focused);
        return label.toLowerCase().includes('apps');
      },
      { maxSteps: 30, direction: 'right' }
    );

    await this.remote.select();
    await this.page.waitForTimeout(800);
  }

  /**
   * Ensure focus is in favorites row and return focused tile.
   */
  async ensureFocusInFavorites() {
    await this.stabilizeInitialFocus();
    if (!(await this.favoritesRow.count())) {
      // In some layouts, favorites row may not be tagged.
      // We still try to locate a likely row by moving down and checking focus.
      await this.remote.down(2);
    } else {
      await this.ensureFocusIn(this.favoritesRow, 'Expected focus in favorites row');
    }
    return this.focusedInFavorites();
  }

  /**
   * Focus a favorites tile that matches a given app name (aria-label/text),
   * scanning horizontally.
   */
  async focusFavoriteByName(appName) {
    const name = appName.trim().toLowerCase();

    // If favorites row locator isn't reliable, use body as container.
    const container = (await this.favoritesRow.count()) ? this.favoritesRow : this.page.locator('body');

    await this.scanFocusUntil(
      container,
      async (focused) => {
        const label = (await this.getElementLabel(focused)).toLowerCase();
        return label.includes(name);
      },
      { maxSteps: 40, direction: 'right' }
    );

    return this.focusedWithin(container).first();
  }

  /**
   * Open details/options for the currently focused tile.
   */
  async openFocusedTile() {
    await expect(this.focusedGlobal()).toBeVisible();
    await this.remote.select();
    await this.page.waitForTimeout(800);
  }
}