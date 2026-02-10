export class PlayerControlsComponent {
    constructor(root, page) {
        this.root = root;
        this.page = page;

        this.playPauseButton = this.root.locator('[data-testid="player-controls-play-pause"]');
        this.timeline = this.root.locator('[data-testid="player-controls-timeline"]');
        this.currentTime = this.root.locator('[data-testid="player-time-current"]');
    }

    async waitForVisible() {
        await this.root.waitFor({ state: 'visible', timeout: 10000 });
    }

    async isPlaying() {
        return await this.root.getAttribute('data-state') === 'playing';
    }

    async getCurrentTime() {
        const timeText = await this.currentTime.textContent();
        // buffer check: if empty return 0
        if (!timeText) return 0;
        return this.parseTime(timeText);
    }

    parseTime(timeStr) {
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return 0;
    }
}
