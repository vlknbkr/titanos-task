import { test, expect } from '../fixtures/fixtures.js';

test.describe('Channels Feature', () => {
  test('Add current channel to favorites via sidebar menu', async ({ channelsPage }) => {
    await channelsPage.open();

    await channelsPage.testFavoriteFullCycle();

    await channelsPage.switchChannel('down', 1);
  });

  test('Verify channel content metadata', async ({ channelsPage }) => {
    await channelsPage.open();
    await channelsPage.switchChannel('down', 1);

    const info = await channelsPage.getCurrentChannelInfo();

    expect(info.id).toBeTruthy();
    expect(info.number).toBeTruthy();
    expect(info.title).toBeTruthy();
  });
});