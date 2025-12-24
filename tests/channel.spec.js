// tests/channels.spec.js
import { test, expect } from '../src/fixtures/fixtures.js';

test.describe('Channels', () => {
    test('Verify channels page is available to us', async ({ channelsPage }) => {
        await channelsPage.open();

        const beforeLabel = await channelsPage.overlay.channelInfo.currentLabel();
        expect(beforeLabel, 'Initial channel label should be readable').toBeTruthy();

        await channelsPage.switchChannel('down', 1);
        await channelsPage.overlay.channelInfo.waitForChannelChange(beforeLabel);

        const afterLabel = await channelsPage.overlay.channelInfo.currentLabel();
        expect(afterLabel, 'Channel label should change after switching').not.toBe(beforeLabel);

        await channelsPage.openMenu();

        await expect(
            channelsPage.page.locator('#channels-menu[role="menu"]'),
            'Channels menu should be visible after opening'
        ).toBeVisible();

        await channelsPage.closeMenu();
        await channelsPage.overlay.menu.waitUntilClosed();
    });
});