import { expect } from '@playwright/test';
import { selectorPolicy } from '../config/selectorPolicy.js';
import { isTruthyFocusValue } from './focusReader.js';

export async function assertFocused(target, timeout = 5000) {
    await expect
        .poll(
            async () => {
                const v = await target.getAttribute(selectorPolicy.focusAttribute);
                return isTruthyFocusValue(v);
            },
            { timeout, message: "Expected target to be focused (data-focused truthy)" }
        )
        .toBe(true);
}
