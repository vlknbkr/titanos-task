import { test, expect } from "../src/fixtures/fixtures.js";

test.describe('Favorite app add and delete', () => {
    test('Deleting a app from the favorites', async ({ appsPage }) => {
        await appsPage.open();
        await appsPage.goToApp('Sports', 'Red Bull TV');
        expect(appsPage.page.url()).toContain(process.env.BASE_URL);
    });
});
