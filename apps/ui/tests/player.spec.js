import { test, expect } from '../fixtures/fixtures.js';

test.describe('Video Player Controls', () => {
    test.beforeEach(async ({ playerPage }) => {
        await playerPage.open();
    });

    test('Verify playback controls (Play, Pause, Seek)', async ({ playerPage }) => {
        // Initial state should be playing
        await expect.poll(async () => await playerPage.controls.isPlaying()).toBe(true);

        const initialTime = await playerPage.controls.getCurrentTime();

        // Pause
        await playerPage.togglePlayback();
        await expect.poll(async () => await playerPage.controls.isPlaying()).toBe(false);

        // Seek Forward
        await playerPage.seekForward(3); // 3 steps right
        // Verify time changed (roughly)
        await expect.poll(async () => await playerPage.controls.getCurrentTime()).toBeGreaterThan(initialTime);

        // Resume
        await playerPage.togglePlayback();
        await expect.poll(async () => await playerPage.controls.isPlaying()).toBe(true);
    });

    test('Verify exit strategy (Back Nav)', async ({ playerPage, homePage }) => {
        // Open player from a known state (Home)
        await homePage.open();
        // Simulate launching into player (mocked)
        await playerPage.open();

        // Play for a bit
        await expect.poll(async () => await playerPage.controls.isPlaying()).toBe(true);

        // Exit
        await playerPage.exit();

        // Verify return to previous context (Home)
        await expect(homePage.favAppList.list()).toBeVisible();
    });
});
