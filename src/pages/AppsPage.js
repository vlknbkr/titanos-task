import { BasePage } from '../core/BasePage.js';
import { getAppCoordinates } from "../utils/AppUtils.js";
import { TITAN_OS_LOCATORS } from '../locators/locators.js';

class AppsPage extends BasePage {
    constructor(page) {
        super(page);
        this.list_selector = this.page.locator(TITAN_OS_LOCATORS.LIST_SELECTOR);
    }

    async open() {
        await this.goto('page/499', {waitUntil: 'networkidle'});
    }

    async goToApp(featureName, itemName) {
        const coordinates = await getAppCoordinates(this.list_selector, featureName, itemName);
        if (!coordinates) {
            throw new Error(`App not found: ${featureName} - ${itemName}`);
        }
        let { rowIndex, colIndex } = coordinates;
        rowIndex += 2;
        await this.remote.down(rowIndex);
        await this.remote.right(colIndex);
        await this.remote.select();
    }
}

module.exports = { AppsPage };
