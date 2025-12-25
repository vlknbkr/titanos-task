import { test, expect } from '../src/fixtures/fixtures.js';

// 1. Define test data as an Array of Objects
const testDatasets = [
    { categoryName: "News", appName: "CGTN" },
    { categoryName: "Games", appName: "Blacknut" },
    { categoryName: "Music", appName: "Deezer" },
    { categoryName: "News", appName: "DW" },
    { categoryName: "Entertainment", appName: "tabii" },
    { categoryName: "Sports", appName: "Red Bull TV" }
];

test.describe('Favorites Management', () => {
    for (const data of testDatasets) {
        test(`Remove ${data.appName} from Favorites`, async ({ homePage, appsPage }) => {
            
            await appsPage.open();
            await appsPage.focusApp(data.categoryName, data.appName);
            await appsPage.addFocusedAppToFavApps(data.categoryName, data.appName);

            await homePage.remote.select(); 
            await homePage.isLoaded();

            await expect
                .poll(async () => await homePage.favAppList.exists(data.appName), { 
                    timeout: 15000,
                    message: `App ${data.appName} should have appeared in Favorites`
                })
                .toBe(true);

            await homePage.focusFavApp(data.appName);
            
            await homePage.removeFocusedFavApp(data.appName);

            await expect
                .poll(async () => await homePage.favAppList.appLocator(data.appName).count(), { 
                    timeout: 15000,
                    message: `App ${data.appName} should have been removed`
                })
                .toBe(0);
        });
    }
});