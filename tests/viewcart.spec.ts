import { test, expect } from '@playwright/test';
import { ViewCartPage } from '../pages/viewcartPage';
import { SearchProductsPage } from '../pages/searchProductsPage';
import { quickLogin } from '../utils/loginHelper';

test.describe('View Cart Page', () => {
    test('Verify cart table headers and proceed to checkout', async ({ page }) => {
        const viewCartPage = new ViewCartPage(page);
        const searchProductsPage = new SearchProductsPage(page);

        // Login using centralized helper
        await quickLogin(page);

        // Add a product to cart first to ensure cart is not empty
        await searchProductsPage.clickOnProductsButton();
        await searchProductsPage.searchProduct('Top');
        await searchProductsPage.hoverAndAddToCart(0);
        await searchProductsPage.clickViewCartLink();

        // Verify cart table headers (Item, Description, Price, Quantity, Total)
        await viewCartPage.verifyCartTableHeaders();

        // Click on Proceed To Checkout button
        await viewCartPage.clickProceedToCheckout();
    });
});
