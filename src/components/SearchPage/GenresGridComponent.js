// src/components/SearchPage/GenresGridComponent.js
import { expect } from '@playwright/test';
import { BaseComponent } from '../BasePage/BaseComponent.js';

export class GenresGridComponent extends BaseComponent {
  static SELECTORS = {
    list: '#search-genres[role="list"]',
    tile: '[role="listitem"]',
    card: '._mediaCard_10koe_1', // Focus target in DOM
    focused: '[data-focused="focused"]'
  };

  constructor(root, page) {
    super(root, page);
  }

  list() { return this.root.locator(GenresGridComponent.SELECTORS.list); }
  tiles() { return this.list().locator(GenresGridComponent.SELECTORS.tile); }
  
  tileByName(name) {
    return this.list().locator(`[role="listitem"][aria-label="${name}"]`).first();
  }

  // Returns the index of the genre that currently has focus
  async focusedIndex() {
    return this.tiles().evaluateAll((els, sel) => 
      els.findIndex(tile => !!tile.querySelector(sel)), 
      GenresGridComponent.SELECTORS.focused
    );
  }

  async indexGenre(name) {
    await expect(this.list()).toBeVisible();
    const labels = await this.tiles().evaluateAll(els => 
      els.map(el => (el.getAttribute('aria-label') || '').trim())
    );
    const idx = labels.indexOf(name);
    if (idx === -1) throw new Error(`Genre "${name}" not found. Found: ${labels.join(', ')}`);
    return idx;
  }
}