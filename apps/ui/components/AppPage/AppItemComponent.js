import { BaseComponent } from '../BasePage/BaseComponent';

export class AppItemComponent extends BaseComponent {
    static SELECTORS = {
        focusedAttr: 'data-focused'
    };

    async getName() {
        const aria = await this.root.getAttribute('aria-label');
        return (aria ?? '').trim();
    }

    async isFocused() {
        const v = (await this.root.getAttribute(AppItemComponent.SELECTORS.focusedAttr) || '').toLowerCase();
        return v === 'true' || v === 'focused';
    }

    locator() {
        return this.root;
    }
}