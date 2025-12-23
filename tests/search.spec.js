import { test } from '../src/fixtures/fixtures.js';

test('search: typing query updates URL and renders results or empty state', async ({ searchPage }) => {
    await searchPage.openSearch();
    await searchPage.search('sport');
    await searchPage.expectSearchToRenderSomething('sport');
});