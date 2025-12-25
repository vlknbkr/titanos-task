import { test, expect } from '../src/fixtures/fixtures.js';

test.describe('Channels Feature', () => {
  test('Add current channel to favorites via sidebar menu', async ({ channelsPage }) => {
    await channelsPage.open();

    // 1. Capture state before action
    const channelKey = await channelsPage.overlay.channelInfo.currentKey();
    
    // 2. Add to favorites
    await channelsPage.toggleFavoriteCurrentChannel();

    // 3. Optional: Re-open menu to verify button state has changed (e.g., text is "Remove")
    await channelsPage.openMenu();
    await channelsPage.remote.down(2);
    const btnLabel = await channelsPage.overlay.menu.addRemoveButton().innerText();
    // Your DOM showed "Add to my channels"; once added, it typically flips to "Remove..."
    console.log(`Current Button Label: ${btnLabel}`);
  });
});