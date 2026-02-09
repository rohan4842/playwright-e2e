import { test, expect } from '@playwright/test';
import { SearchProductsPage } from '../pages/searchProductsPage';
import { CartPage } from '../pages/cartPage';
import { loginWithApiVerification } from '../utils/loginHelper';

test.describe('Add Products to Cart', () => {
    let searchProductsPage: SearchProductsPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        // Login using centralized helper
        await loginWithApiVerification(page);

        searchProductsPage = new SearchProductsPage(page);
        cartPage = new CartPage(page);
    });

    test('Add products to cart and verify', async ({ page }) => {
        const searchTerm = 'Top';

        // Step 1: Clear cart before adding new products (via UI - no API available)
        await cartPage.clearCart();

        // Step 4: Click on 'Products' button
        await searchProductsPage.clickOnProductsButton();

        // Verify user is navigated to ALL PRODUCTS page successfully
       //   await searchProductsPage.verifyAllProductsPageVisible();

        // Search for products
        await searchProductsPage.searchProduct(searchTerm);

        // Verify products are visible
        await searchProductsPage.verifySearchedProductsTitleVisible();
        await searchProductsPage.verifySearchResultsContainProduct(searchTerm);

        // Get product names before adding to cart
        const firstProductName = await searchProductsPage.getProductName(0);
        const secondProductName = await searchProductsPage.getProductName(1);
        console.log(`First product: ${firstProductName}`);
        console.log(`Second product: ${secondProductName}`);

        // Step 5: Hover over first product and click 'Add to cart'
        await searchProductsPage.hoverAndAddToCart(0);

        // Step 6: Click 'Continue Shopping' button
        await searchProductsPage.clickContinueShopping();

        // Step 7: Hover over second product and click 'Add to cart'
        await searchProductsPage.hoverAndAddToCart(1);

        // Step 8: Click 'View Cart' link in modal to navigate to cart page
        await searchProductsPage.clickViewCartLink();

        // Step 9: Verify both products are added to Cart
        await cartPage.verifyCartPageVisible();
        await cartPage.verifyProductCountInCart(2);
        await cartPage.verifyProductsInCart([firstProductName, secondProductName]);

        // Verify product details (prices, quantities, totals)
        await cartPage.verifyCartProductDetails();
    });
});
