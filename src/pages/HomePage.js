import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { FavAppListComponent } from '../components/HomePage/FavAppListComponent.js';

export class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.favAppList = new FavAppListComponent(
      this.page.locator('[data-testid="user-apps"]'),
      this.page
    );
  }

  async open() {
    await this.page.goto("");
    await this.isLoaded();
  }

  async isLoaded() {
    // 1. Wait for the list container to exist
    await expect(this.favAppList.list()).toBeAttached();

    // 2. Wait for data-content-ready="true" and aria-hidden="false"
    await this.favAppList.waitForReady();

    // 3. Confirm target app is visible (Watch TV is a good smoke test)
    await expect(this.favAppList.appLocator('Watch TV')).toBeVisible();
  }

  async focusFavApp(appName) {
    // 3. The logic remains similar, but we use the component's cleaner methods
    const count = await this.favAppList.count();
    if (count === 0) throw new Error('Favourite Apps row is empty.');

    const current = await this.favAppList.focusedIndex();
    if (current < 0) throw new Error('No focused item found in Favourite Apps row.');

    const target = await this.favAppList.appIndex(appName);
    if (target < 0) throw new Error(`Fav app "${appName}" not found in Favourite Apps row.`);

    if (current === target) return;

    const steps = Math.abs(target - current);
    const move = target > current ? () => this.remote.right() : () => this.remote.left();

    for (let s = 0; s < steps; s++) {
      await move();
    }

    // Use the component's nth item helper
    await expect(this.favAppList.items().nth(target)).toHaveAttribute('data-focused', 'focused');
  }

  async openEditModeOnFavApp(appName) {
    await this.focusFavApp(appName);

    const appItem = this.favAppList.item(appName);

    // We pass the locator of the item to the remote longpress
    await this.remote.longPressSelect(appItem.root);

    // Verify remove button via the component
    await expect(appItem.removeButton()).toBeVisible();
  }

  async removeFocusedFavApp() {
    // 4. Determine which app is currently focused
    const focusedIdx = await this.favAppList.focusedIndex();
    const items = await this.favAppList.items().all();
    const focusedItemRoot = items[focusedIdx];

    // Wrap it in the Item Component to get access to its logic
    const appItem = new FavAppItemComponent(focusedItemRoot, this.page);
    const removeBtn = appItem.removeButton();

    await expect(removeBtn).toBeVisible();
    await this.remote.down();

    // 5. Use the logic we built in the item component
    if (await appItem.isRemoveDisabled()) {
      const label = await focusedItemRoot.getAttribute('aria-label');
      throw new Error(`Remove is disabled for "${label}" (Watch TV).`);
    }

    await this.remote.select(removeBtn);
    await this.page.waitForTimeout(3000); // Wait for animation
  }
}