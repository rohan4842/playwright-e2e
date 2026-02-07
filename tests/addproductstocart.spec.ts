import { test, expect } from '@playwright/test';
import { SearchProductsPage } from '../pages/searchProductsPage';
import { CartPage } from '../pages/cartPage';

test.describe('Add Products to Cart', () => {
    let searchProductsPage: SearchProductsPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        const username = process.env.USERNAME!;
        const password = process.env.PASSWORD!;
        const userDisplayName = process.env.USER_DISPLAY_NAME!;

        // Login via API to verify credentials are valid
        const apiResponse = await page.request.post('https://automationexercise.com/api/verifyLogin', {
            form: {
                email: username,
                password: password
            }
        });

        const responseBody = await apiResponse.json();
        expect(responseBody.responseCode).toBe(200);

        // Perform UI login once (API doesn't set session cookies)
        await page.goto('/login');
        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(username);
        await page.getByPlaceholder('Password').fill(password);
        await page.getByRole('button', { name: 'Login' }).click();

        // Verify user is logged in
        await expect(page.getByText(` Logged in as ${userDisplayName}`)).toBeVisible();

        searchProductsPage = new SearchProductsPage(page);
        cartPage = new CartPage(page);
    });

    test('Add products to cart and verify', async ({ page }) => {
        const searchTerm = 'Top';

        // Step 4: Click on 'Products' button
        await searchProductsPage.clickOnProductsButton();

        // Verify user is navigated to ALL PRODUCTS page successfully
        await searchProductsPage.verifyAllProductsPageVisible();

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

        // Step 8: Click 'View Cart' button
        await searchProductsPage.clickViewCart();

        // Step 9: Verify both products are added to Cart
        await cartPage.verifyCartPageVisible();
        await cartPage.verifyProductCountInCart(2);
        await cartPage.verifyProductsInCart([firstProductName, secondProductName]);

        // Verify product details (prices, quantities, totals)
        await cartPage.verifyCartProductDetails();
    });
});
