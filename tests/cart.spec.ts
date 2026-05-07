import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('empty cart shows no items', async () => {
    await cartPage.goto();
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('added item appears in cart', async () => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await cartPage.goto();
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems.first()).toContainText('Sauce Labs Backpack');
  });

  test('multiple items appear in cart', async () => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await cartPage.goto();
    await expect(cartPage.cartItems).toHaveCount(2);
  });

  test('checkout button is present', async () => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await cartPage.goto();
    await expect(cartPage.checkoutButton).toBeEnabled();
  });
});
