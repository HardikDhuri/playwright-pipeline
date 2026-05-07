import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout flow', () => {
  test('complete purchase end-to-end', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();

    // Add item
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart('sauce-labs-backpack');

    // Go to cart
    const cartPage = new CartPage(page);
    await inventoryPage.cartIcon.click();
    await expect(cartPage.cartItems).toHaveCount(1);
    await cartPage.proceedToCheckout();

    // Fill shipping info
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillShippingInfo('Jane', 'Doe', '12345');

    // Overview page
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.locator('.summary_info')).toBeVisible();

    // Finish
    await checkoutPage.finish();
    await expect(checkoutPage.confirmationMessage).toHaveText('Thank you for your order!');
  });

  test('checkout missing first name shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.cartIcon.click();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillShippingInfo('', 'Doe', '12345');

    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });
});
