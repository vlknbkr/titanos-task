

export class RemoteControl {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {{ delay?: number, log?: boolean }} [options]
     */
    constructor(page, options = {}) {
        this.page = page;
        this.delay = options.delay ?? 200;
        this.log = options.log ?? true;
        this.focusedSelector = '[data-focused="focused"], [data-focused="true"]';
    }

    _log(message) {
        if (this.log) console.log(message);
    }

    async press(key, times = 1) {
        for (let i = 0; i < times; i++) {
            await this.page.keyboard.press(key, { delay: this.delay });
            this._log(`[Remote] ${key}`);
        }
    }

    async left(times = 1) {
        await this.press('ArrowLeft', times);
    }

    async right(times = 1) {
        await this.press('ArrowRight', times);
    }

    async up(times = 1) {
        await this.press('ArrowUp', times);
    }

    async down(times = 1) {
        await this.press('ArrowDown', times);
    }

    async select() {
        await this.press('Enter', 1);
        this._log('[Remote] SELECT');
    }

    async back() {
        await this.press('Backspace', 1);
        this._log('[Remote] BACK');
    }

    async longPressSelect(duration = 2000) {
        this._log(`[Remote] LONG SELECT (${duration}ms)`);
        await this.page.keyboard.down('Enter');
        await this.page.waitForTimeout(duration);
        await this.page.keyboard.up('Enter');
    }
}
