import { expect } from '@playwright/test';
import { RemoteControl } from '../utils/RemoteControl.js';

/**
 * BasePage centralizes:
 * - navigation helpers (open/goto)
 * - focus logic (single source of truth)
 * - small convenience assertions for TV focus systems
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.remote = new RemoteControl(page);
  }

  /**
   * Many Titan-like TV apps use either:
   * - data-focused="focused"
   * - data-focused="true"
   * - aria-selected="true" etc.
   *
   * We keep a flexible "focused variant selector" but still treat this as a single place to change.
   */
  focusedAttributeSelector() {
    return '[data-focused="focused"],[data-focused="true"],[aria-selected="true"]';
  }

  /**
   * Scoped focus selector (within a container).
   * @param {import('@playwright/test').Locator} container
   */
  focusedWithin(container) {
    return container.locator(this.focusedAttributeSelector());
  }

  /**
   * Generic "open" (go to baseURL) with stable readiness checks.
   */
  async open(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Some pages may want to ensure the app is ready.
   * Provide a lightweight helper.
   */
  async waitForAppReady() {
    // Heuristic: wait until there is at least one focusable item on screen
    const focusable = this.page.locator('[data-testid],[role="button"],a,button');
    await expect(focusable.first()).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Assert exactly one focused element exists within a container.
   * Helpful to avoid flaky states where multiple things are marked focused.
   * @param {import('@playwright/test').Locator} container
   * @param {string} reason
   */
  async expectSingleFocusIn(container, reason = 'Expected exactly one focused item in container') {
    const focused = this.focusedWithin(container);
    await expect(async () => {
      const count = await focused.count();
      expect(count, reason).toBe(1);
    }).toPass({ timeout: 10_000 });
  }

  /**
   * Ensure focus is inside a container (at least one focused element).
   * @param {import('@playwright/test').Locator} container
   * @param {string} reason
   */
  async ensureFocusIn(container, reason = 'Expected focus to be inside container') {
    const focused = this.focusedWithin(container);
    await expect(async () => {
      const count = await focused.count();
      expect(count, reason).toBeGreaterThan(0);
    }).toPass({ timeout: 10_000 });
  }

  /**
   * Find and focus an item by scanning with remote moves until a predicate matches the focused element.
   * This is a stability tool for TV grids where initial focus is not deterministic.
   *
   * @param {import('@playwright/test').Locator} container
   * @param {(focusedEl: import('@playwright/test').Locator) => Promise<boolean>} matcher
   * @param {{ maxSteps?: number, direction?: 'right'|'left'|'down'|'up' }} opts
   */
  async scanFocusUntil(container, matcher, opts = {}) {
    const maxSteps = opts.maxSteps ?? 25;
    const direction = opts.direction ?? 'right';

    await this.ensureFocusIn(container);

    for (let i = 0; i < maxSteps; i++) {
      const focused = this.focusedWithin(container).first();
      if (await matcher(focused)) return;

      // move
      if (direction === 'right') await this.remote.right();
      if (direction === 'left') await this.remote.left();
      if (direction === 'down') await this.remote.down();
      if (direction === 'up') await this.remote.up();
      await this.page.waitForTimeout(150);
    }

    throw new Error(`scanFocusUntil: did not find a matching focused element after ${maxSteps} steps`);
  }

  /**
   * Get a robust label (aria-label/text/testid) from an element.
   * @param {import('@playwright/test').Locator} el
   */
  async getElementLabel(el) {
    const aria = await el.getAttribute('aria-label');
    if (aria && aria.trim()) return aria.trim();

    const testid = await el.getAttribute('data-testid');
    if (testid && testid.trim()) return testid.trim();

    const text = (await el.textContent())?.trim();
    return text ?? '';
  }
}