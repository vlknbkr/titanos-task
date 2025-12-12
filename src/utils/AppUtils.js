
/**
 * Finds the coordinates (row and column index) of an app within a specific category.
 * Performs a case-insensitive search for both category and app name.
 * 
 * @param {string} categoryName - The name of the category (e.g., "Sports").
 * @param {string} appName - The name of the app (e.g., "Red Bull TV").
 * @returns {{rowIndex: number, colIndex: number} | null} The coordinates or null if not found.
 */
function getAppCoordinates(categoryName, appName) {
    const listContainer = document.querySelector('[data-testid="lists-container"]');
    if (!listContainer) return null;

    const lists = listContainer.querySelectorAll('[data-testid^="list-item-app_list-"]');

    const targetCategory = categoryName.trim().toLowerCase();
    const targetApp = appName.trim().toLowerCase();

    for (let rIndex = 0; rIndex < lists.length; rIndex++) {
        const list = lists[rIndex];
        const label = list.getAttribute('aria-label');

        // Check if this is the correct category
        if (label && label.trim().toLowerCase() === targetCategory) {
            const items = list.querySelectorAll('div[role="listitem"]');

            for (let cIndex = 0; cIndex < items.length; cIndex++) {
                const item = items[cIndex];
                const testId = item.getAttribute('data-testid');

                // Check if this is the correct app
                if (testId && testId.trim().toLowerCase() === targetApp) {
                    return { rowIndex: rIndex, colIndex: cIndex };
                }
            }
        }
    }

    return null;
}

module.exports = { getAppsFromContainer, getAppCoordinates };
