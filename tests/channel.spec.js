import { test, expect } from "../src/fixtures/fixtures.js"; // Adjust path to your fixtures

test.describe('Channels Page Verification', () => {

    test('should verify channels page is available to use', async ({ channelPage }) => {
        // 1. Navigate
        await channelPage.open();

        // 2. Verify Availability
        // This single line executes the 4-step strict health check defined in the POM.
        // It covers: Menu State, Stability (no loaders), and Content Visibility.
        await channelPage.verifyChannelsPageIsAvailable();
    });
});