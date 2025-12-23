import { test } from '../src/fixtures/fixtures.js';

test('favorites: add an app to favorites', async ({ favoritesFlow }) => {
  await favoritesFlow.addAppToFavorites('Entertainment', 'YouTube');
});

test('favorites: protected app cannot be deleted (Watch TV)', async ({ favoritesFlow }) => {
  await favoritesFlow.expectAppNotDeletable('Watch TV');
});

test('favorites: delete an app from favorites', async ({ favoritesFlow }) => {
  // Assumption: YouTube was added (or exists). Flow is robust either way.
  await favoritesFlow.removeAppFromFavorites('YouTube');
});