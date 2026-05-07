import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    inventoryPage = new InventoryPage(page);
  });

  test('shows 6 products', async () => {
    const items = inventoryPage.itemNames();
    await expect(items).toHaveCount(6);
  });

  test('sort A→Z is default', async () => {
    const names = await inventoryPage.itemNames().allTextContents();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('sort Z→A reverses order', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.itemNames().allTextContents();
    const sortedDesc = [...names].sort().reverse();
    expect(names).toEqual(sortedDesc);
  });

  test('sort low→high orders by price', async () => {
    await inventoryPage.sortBy('lohi');
    const priceTexts = await inventoryPage.itemPrices().allTextContents();
    const prices = priceTexts.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sort high→low orders by price descending', async () => {
    await inventoryPage.sortBy('hilo');
    const priceTexts = await inventoryPage.itemPrices().allTextContents();
    const prices = priceTexts.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('add item updates cart badge', async () => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('remove item clears badge', async () => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.removeItemFromCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });
});
