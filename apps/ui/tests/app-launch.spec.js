import { test, expect } from '../fixtures/fixtures.js';

test.describe('App Launch', () => {
    test('Verify app launch from Home', async ({ homePage, readyToDeleteState }) => {
        const appName = readyToDeleteState.name;

        await homePage.open();
        await homePage.launchApp(appName);

        await expect(homePage.page).toHaveURL(/.*\/details\/app\/.*/);
    });
});
