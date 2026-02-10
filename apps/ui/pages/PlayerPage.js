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

    async open(assetId = '123') {
        // Direct navigation if supported, otherwise via UI
        await this.navigate(`player/${assetId}`);
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
