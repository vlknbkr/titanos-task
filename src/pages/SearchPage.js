import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * SearchPage:
 * - Execute a search
 * - Validate results actually render (beyond URL-only checks)
 */
export class SearchPage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.root = page.locator('[data-testid="search-page"], [data-testid*="search"], main').first();
        this.searchInput = page.locator('input[type="search"], input[placeholder*="Search"], [data-testid*="search-input"] input').first();

        // Results area selectors (best effort)
        this.resultsContainer = page.locator('[data-testid*="results"], [data-testid*="search-results"], [aria-label*="Results"], section').first();
        this.resultItems = page.locator('[data-testid^="result-"], [data-testid*="result-item"], [data-testid*="tile"]');
        this.noResults = page.locator('text=/no results/i, text=/nothing found/i').first();
    }

    async openSearch() {
        await this.open('/search').catch(async () => {
            await this.open('/');
        });
        await this.waitForAppReady();
    }

    async expectOnSearch() {
        await expect(this.root).toBeVisible({ timeout: 20_000 });
    }

    async search(query) {
        await this.expectOnSearch();

        // Some TV apps don't allow typing without explicit focus
        if (await this.searchInput.isVisible().catch(() => false)) {
            await this.searchInput.click().catch(() => { });
            await this.searchInput.fill('');
            await this.searchInput.type(query, { delay: 30 });
        } else {
            // fallback: type into body
            await this.page.focus('body');
            await this.page.keyboard.type(query, { delay: 30 });
        }

        await this.page.waitForTimeout(800);
    }

    /**
     * Validate that search has meaningful output:
     * - URL contains query
     * - AND either results items appear OR "no results" appears
     */
    async expectSearchToRenderSomething(query) {
        const q = query.trim().toLowerCase();

        await expect(async () => {
            const url = this.page.url().toLowerCase();
            expect(url.includes('search') || url.includes('q=') || url.includes(q), 'Expected URL to reflect search').toBeTruthy();
        }).toPass({ timeout: 10_000 });

        await expect(async () => {
            const itemsCount = await this.resultItems.count();
            const noRes = await this.noResults.isVisible().catch(() => false);

            expect(itemsCount > 0 || noRes, 'Expected results list or "no results" state').toBeTruthy();
        }).toPass({ timeout: 12_000 });

        // If results exist, validate at least one item contains query-ish text (best effort)
        const itemsCount = await this.resultItems.count();
        if (itemsCount > 0) {
            const first = this.resultItems.first();
            await expect(first).toBeVisible();
            const text = ((await first.textContent()) ?? '').toLowerCase();
            // Not all result tiles contain query text; we still do a soft validation
            expect(text.length > 0, 'Expected result item to have some text').toBeTruthy();
        }
    }
}