// src/pages/SearchPage.js
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { SearchComponent } from '../components/SearchPage/SearchComponent.js';

export class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    this.search = new SearchComponent(page);
    this.GRID_COLS = 6; // Based on your DOM repeat(6, 181px)
  }

  async open() {
    await this.page.goto("search");
    await this.isLoaded();
  }

  async isLoaded() {
    await expect(this.search.bar.input()).toBeVisible();
    // In DOM, grid might be hidden (data-visible="false") during loading
    await expect(this.search.genres.list()).toBeAttached();
  }

  async openGenre(name) {
    const targetIdx = await this.search.genres.indexGenre(name);
    
    // Ensure focus has left the input and entered the grid
    await expect.poll(async () => await this.search.genres.focusedIndex(), {
      timeout: 5000
    }).toBeGreaterThanOrEqual(0);

    await this._moveFocusInGrid(targetIdx, this.GRID_COLS);
    await this.remote.select();
    await this.search.results.waitUntilResolved();
  }

  async _moveFocusInGrid(targetIdx, cols) {
    const currentIdx = await this.search.genres.focusedIndex();
    const rowDiff = Math.floor(targetIdx / cols) - Math.floor(currentIdx / cols);
    const colDiff = (targetIdx % cols) - (currentIdx % cols);

    if (rowDiff > 0) await this.remote.down(rowDiff);
    else if (rowDiff < 0) await this.remote.up(Math.abs(rowDiff));

    if (colDiff > 0) await this.remote.right(colDiff);
    else if (colDiff < 0) await this.remote.left(Math.abs(colDiff));

    await expect.poll(() => this.search.genres.focusedIndex()).toBe(targetIdx);
  }
}