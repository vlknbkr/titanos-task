import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';
import { PlayerControlsComponent } from '../components/PlayerPage/PlayerControlsComponent.js';

export class PlayerPage extends BasePage {
    constructor(page) {
        super(page);
        this.controls = new PlayerControlsComponent(
            this.page.locator('[data-testid="player-ui"]'),
            this.page
        );
    }

    async isLoaded() {
        await this.controls.waitForVisible();
    }

    async open(assetId = '1745') {
        // Navigate via Details Page because direct player deep link is flaky
        await this.navigate(`details/app/${assetId}`);

        // Find and click Play/Watch button
        // Assuming the primary action on details is Play or there is a specific button
        const playButton = this.page.locator('button:has-text("Watch"), button:has-text("Play")').first();
        await expect(playButton).toBeVisible();

        await this.remote.select(playButton);
        await this.isLoaded();
    }

    async togglePlayback() {
        await this.remote.select(this.controls.playPauseButton);
    }

    async seekForward(steps = 1) {
        await this.remote.right(steps);
    }

    async seekBackward(steps = 1) {
        await this.remote.left(steps);
    }

    async exit() {
        await this.remote.back();
        await expect(this.controls.root).toBeDetached();
    }
}
