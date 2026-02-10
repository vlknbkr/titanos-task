import { test, expect } from '../fixtures/fixtures.js';

test.describe('Error Handling', () => {
    test('Verify offline state on Apps page', async ({ page, appsPage }) => {
        // Simulate offline mode
        await page.context().setOffline(true);

        // Attempt navigation
        await appsPage.navigate('apps');

        // Check for error UI
        const errorContainer = page.locator('[data-testid="error-container"]');
        const retryButton = page.locator('[data-testid="retry-button"]');

        await expect(errorContainer).toBeVisible({ timeout: 10000 });
        await expect(retryButton).toBeVisible();
        await expect(retryButton).toHaveAttribute('data-focused', 'focused');
    });
});
