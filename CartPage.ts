import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton        = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartItems             = page.locator('.cart_item');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
