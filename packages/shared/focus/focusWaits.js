import { assertFocused } from './focusAssertions.js';

/**
 * Waits for a Playwright Locator to be focused.
 * @param {import('@playwright/test').Locator} target 
 * @param {number} [timeout=5000] 
 */
export async function waitForFocused(target, timeout = 5000) {
    await assertFocused(target, timeout);
}
