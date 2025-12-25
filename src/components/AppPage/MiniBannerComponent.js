// src/components/AppPage/MiniBannerComponent.js
import { BaseComponent } from '../BasePage/BaseComponent.js';

export class MiniBannerComponent extends BaseComponent {
    static SELECTORS = {
        item: '[role="listitem"]',
        image: 'img._bannerImage_wa18z_170'
    };

    constructor(root, page) {
        super(root, page);
        // Scoped to the [data-testid="mini-banner"] container
        this.itemsLocator = this.root.locator(MiniBannerComponent.SELECTORS.item);
    }

    /**
     * Because the banner is the "lazyest" element, we wait for the first 
     * item to be fully rendered and visible.
     */
    async waitForLoaded() {
        await this.root.waitFor({ state: 'visible' });
        // Wait for the first banner item to appear
        await this.itemsLocator.first().waitFor({ state: 'visible', timeout: 15000 });
        // Optional: Ensure the image inside the banner is also attached
        await this.itemsLocator.first().locator(MiniBannerComponent.SELECTORS.image).waitFor({ state: 'attached' });
    }

    async getCount() {
        return this.itemsLocator.count();
    }

    /**
     * Returns the item currently visible (translateX(0%))
     */
    getActiveItem() {
        return this.itemsLocator.filter({ hasText: '' }).filter({ 
            has: this.page.locator('[style*="translateX(0%)"]') 
        });
    }
}