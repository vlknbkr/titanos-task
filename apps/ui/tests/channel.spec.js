import { test, expect } from '../fixtures/fixtures.js';

test.describe('Channels Feature', () => {
  test('Add current channel to favorites via sidebar menu', async ({ channelsPage }) => {
    await channelsPage.open();

    await channelsPage.testFavoriteFullCycle();
  });

  test('Verify channel content metadata', async ({ channelsPage }) => {
    await channelsPage.open();
    await channelsPage.switchChannel('down', 2);

    const info = await channelsPage.getCurrentChannelInfo();

    expect(info.id).toBeTruthy();
    expect(info.number).toBeTruthy();
    expect(info.title).toBeTruthy();
  });
});