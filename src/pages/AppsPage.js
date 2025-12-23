import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * AppsPage:
 * - Search and browse apps
 * - Add to favorites actions remain page-level
 * - Orchestration belongs in flows
 */
export class AppsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.root = page.locator('[data-testid="apps-page"], main').first();
    this.searchEntry = page.locator('[data-testid*="search"], [aria-label="Search"], [aria-label*="Search"]').first();

    this.listsContainer = page.locator('[data-testid*="list"], [data-testid*="row"], section').first();
    this.tiles = page.locator('[data-testid^="tile-"], [data-testid*="app-tile"], [data-testid*="tile"]');

    this.addToFavButton = page.locator(
      '[data-testid*="add-to-fav"], [data-testid*="favorite"], button:has-text("Add to Favourites"), button:has-text("Add to Favorites")'
    ).first();

    this.removeFromFavButton = page.locator(
      '[data-testid*="remove-from-fav"], button:has-text("Remove from Favourites"), button:has-text("Remove from Favorites")'
    ).first();

    this.backButton = page.locator('[data-testid*="back"], [aria-label="Back"], button:has-text("Back")').first();
  }

  async expectOnAppsPage() {
    await expect(this.root).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Focus a category row by its aria-label (or visible text) then focus an app tile inside it.
   * This is robust against changing item positions.
   */
  async focusAppInCategory(categoryName, appName) {
    const targetCategory = categoryName.trim().toLowerCase();
    const targetApp = appName.trim().toLowerCase();

    await this.expectOnAppsPage();

    // Many TV UIs label rows with aria-label
    const rows = this.page.locator('[data-testid^="list-item-"], [aria-label*="list"], [data-testid*="row"]');
    const rowCount = await rows.count();

    // Ensure we are on content area
    await this.page.focus('body');
    await this.remote.down(2);

    let foundRow = null;

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const label = (await row.getAttribute('aria-label'))?.trim().toLowerCase() ?? '';
      const text = (await row.textContent())?.trim().toLowerCase() ?? '';

      if (label.includes(targetCategory) || text.includes(targetCategory)) {
        foundRow = row;
        break;
      }
    }

    if (!foundRow) {
      // Fallback: scan down until row matches
      await this.scanFocusUntil(
        this.page.locator('body'),
        async (focused) => {
          const label = (await this.getElementLabel(focused)).toLowerCase();
          return label.includes(targetCategory);
        },
        { maxSteps: 20, direction: 'down' }
      );
    } else {
      await expect(foundRow).toBeVisible();
      // Move focus down until focus is inside that row
      await this.scanFocusUntil(
        foundRow,
        async (focused) => {
          // If focus enters row container, focused element should exist within row
          const within = this.focusedWithin(foundRow);
          return (await within.count()) > 0;
        },
        { maxSteps: 10, direction: 'down' }
      );
    }

    // Now scan horizontally inside current row to find the app
    const activeRow = foundRow ?? this.page.locator('body');
    await this.scanFocusUntil(
      activeRow,
      async (focused) => {
        const label = (await this.getElementLabel(focused)).toLowerCase();
        return label.includes(targetApp);
      },
      { maxSteps: 50, direction: 'right' }
    );

    return this.focusedWithin(activeRow).first();
  }

  /**
   * Click/select current focused app tile.
   */
  async openFocusedApp() {
    await expect(this.page.locator(this.focusedAttributeSelector()).first()).toBeVisible();
    await this.remote.select();
    await this.page.waitForTimeout(900);
  }

  /**
   * Add current app to favorites, asserting button presence and effect.
   */
  async addFocusedAppToFavorites() {
    // Many UIs show a details overlay with button
    await expect(async () => {
      const isVisible = await this.addToFavButton.isVisible().catch(() => false);
      const isAltVisible = await this.removeFromFavButton.isVisible().catch(() => false);
      expect(isVisible || isAltVisible, 'Expected Add/Remove favorites button to be visible').toBeTruthy();
    }).toPass({ timeout: 12_000 });

    const addVisible = await this.addToFavButton.isVisible().catch(() => false);

    if (addVisible) {
      await this.addToFavButton.click().catch(async () => {
        await this.remote.select();
      });
      await this.page.waitForTimeout(600);
      // After adding, "remove" should appear or add disappears
      await expect(async () => {
        const nowRemove = await this.removeFromFavButton.isVisible().catch(() => false);
        const nowAdd = await this.addToFavButton.isVisible().catch(() => false);
        expect(nowRemove || !nowAdd, 'Expected app to be added to favorites').toBeTruthy();
      }).toPass({ timeout: 10_000 });
    }
  }

  /**
   * Navigate back (if possible) to Home.
   */
  async goBackToHome() {
    if (await this.backButton.isVisible().catch(() => false)) {
      await this.backButton.click().catch(() => {});
      await this.page.waitForTimeout(800);
      return;
    }
    // fallback
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(800);
  }
}