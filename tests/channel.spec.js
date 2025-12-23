import { test, expect } from '../src/fixtures/fixtures.js';

test('channels: changing selection updates selected channel or info', async ({ channelPage }) => {
  await channelPage.openChannels();
  await channelPage.expectOnChannels();

  await channelPage.moveToNextChannelAndAssertChange('down');
  await channelPage.moveToNextChannelAndAssertChange('down');
  await channelPage.moveToNextChannelAndAssertChange('up');

  // sanity: root stays visible
  await expect(channelPage.root).toBeVisible();
});