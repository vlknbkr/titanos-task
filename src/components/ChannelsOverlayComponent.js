// src/components/ChannelsOverlayComponent.js
import { ChannelInfoComponent } from './ChannelInfoComponent.js';
import { ChannelsMenuComponent } from './ChannelsMenuComponent.js';

export class ChannelsOverlayComponent {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this._root = this.page.locator('[data-testid="player-overlay"]');

    this.channelInfo = new ChannelInfoComponent(this._root, this.page);
    this.menu = new ChannelsMenuComponent(this._root, this.page);
  }

  root() {
    return this._root;
  }
}