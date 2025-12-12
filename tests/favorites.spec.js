import { test, expect } from "../src/fixtures/fixtures.js";

test.describe('Favorite app add and delete', () => {
    test('Adding a app tp the favorites', async ({ appsPage }) => {
        await appsPage.open();
        expect(appsPage.page.url()).toContain(process.env.BASE_URL);
    });

    test('Deleting a app from the favorites', async ({ appsPage }) => {
        await appsPage.open();
        console.log(getAppCoordinates('Featured Apps', 'BBC Sounds'));
        expect(appsPage.page.url()).toContain(process.env.BASE_URL);
    });
});
