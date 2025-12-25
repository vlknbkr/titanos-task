// src/components/SearchPage/SearchComponent.js
import { SearchBarComponent } from './SearchBarComponent.js';
import { GenresGridComponent } from './GenresGridComponent.js';
import { SearchResultsComponent } from './SearchResultsComponent.js';

export class SearchComponent {
  constructor(page) {
    this.page = page;
    // Page-level root for search
    this.root = this.page.locator('._search_1nsw1_1');

    this.bar = new SearchBarComponent(this.root, page);
    this.genres = new GenresGridComponent(this.root, page);
    this.results = new SearchResultsComponent(this.root, page);
  }
}