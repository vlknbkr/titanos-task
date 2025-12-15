import { test, expect } from "../src/fixtures/fixtures.js";

const appData = { featureName: 'Entertainment', appName: 'tabii' };

test.describe.serial('Favorites Workflow', () => {

    test(`Add ${appData.appName} to favorites`, async ({ appsPage, homePage }) => {
        await homePage.open();

        const appLocator = homePage.getAppLocator(appData.appName);
        if (await appLocator.isVisible()) {
            await homePage.deleteApp(appData.appName);
        }

        await appsPage.addAppToFavorites(appData.featureName, appData.appName);

        await expect(async () => {
            await expect(appLocator).toBeVisible()
        }).toPass({
            intervals: [1000, 2000, 5000],
            timeout: 10000
        });
    });

    test(`Remove ${appData.appName} from favorites`, async ({ homePage, appsPage }) => {
        await homePage.open();

        const appLocator = homePage.getAppLocator(appData.appName);
        if (!await appLocator.isVisible()) {
            await appsPage.addAppToFavorites(appData.featureName, appData.appName);
            await homePage.open();
        }

        await homePage.deleteApp(appData.appName);

        await expect(async () => {
            await expect(appLocator).not.toBeVisible()
        }).toPass({
            intervals: [1000, 2000, 5000],
            timeout: 10000
        });
    });
});
