import { selectorPolicy } from '../config/selectorPolicy.js';

export function isTruthyFocusValue(value) {
    if (value === null || value === undefined) return false;
    const v = String(value).trim().toLowerCase();
    return selectorPolicy.focusTruthyValues.includes(v);
}

export async function isFocused(target) {
    const v = await target.getAttribute(selectorPolicy.focusAttribute);
    return isTruthyFocusValue(v);
}

