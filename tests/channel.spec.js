import { test, expect } from '../src/fixtures/fixtures.js';

test.describe('Channels Feature', () => {
  test('Add current channel to favorites via sidebar menu', async ({ channelsPage }) => {
    await channelsPage.open();

    // 1. Capture state before action
    const channelKey = await channelsPage.overlay.channelInfo.currentKey();
    
    // 2. Add to favorites
    await channelsPage.testFavoriteFullCycle();

    await channelsPage.switchChannel('down', 1);

  });
});