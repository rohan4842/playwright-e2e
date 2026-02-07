import { test, expect } from '@playwright/test';
import { SearchProductsPage } from '../pages/searchProductsPage';

test.describe('Search Products', () => {
    let searchProductsPage: SearchProductsPage;

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
    });

    test('Search for products and verify results', async ({ page }) => {
        const searchTerm = 'Tops';

        // Step 4: Click on 'Products' button
        await searchProductsPage.clickOnProductsButton();

        // Step 5: Verify user is navigated to ALL PRODUCTS page successfully
        await searchProductsPage.verifyAllProductsPageVisible();

        // Step 6: Enter product name in search input and click search button
        await searchProductsPage.searchProduct(searchTerm);

        // Step 7: Verify 'SEARCHED PRODUCTS' is visible
        await searchProductsPage.verifySearchedProductsTitleVisible();

        // Step 8: Verify all the products related to search are visible
        await searchProductsPage.verifySearchResultsContainProduct(searchTerm);
    });
});
