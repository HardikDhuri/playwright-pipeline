import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title       = page.locator('.title');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge   = page.locator('.shopping_cart_badge');
    this.cartIcon    = page.locator('.shopping_cart_link');
  }

  async addItemToCart(itemName: string) {
    const testId = `add-to-cart-${itemName.toLowerCase().replace(/ /g, '-')}`;
    await this.page.locator(`[data-test="${testId}"]`).click();
  }

  async removeItemFromCart(itemName: string) {
    const testId = `remove-${itemName.toLowerCase().replace(/ /g, '-')}`;
    await this.page.locator(`[data-test="${testId}"]`).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  itemNames() {
    return this.page.locator('.inventory_item_name');
  }

  itemPrices() {
    return this.page.locator('.inventory_item_price');
  }
}
