import { test, expect } from '@playwright/test';
import { SearchProductsPage } from '../pages/searchProductsPage';
import { loginWithApiVerification } from '../utils/loginHelper';

test.describe('Search Products', () => {
    let searchProductsPage: SearchProductsPage;

    test.beforeEach(async ({ page }) => {
        // Login using centralized helper
        await loginWithApiVerification(page);

        searchProductsPage = new SearchProductsPage(page);
    });

    test('Search for products and verify results', async ({ page }) => {
        const searchTerm = 'Tops';

        // Step 4: Click on 'Products' button
        await searchProductsPage.clickOnProductsButton();

        // Step 5: Verify user is navigated to ALL PRODUCTS page successfully
       // await searchProductsPage.verifyAllProductsPageVisible();

        // Step 6: Enter product name in search input and click search button
        await searchProductsPage.searchProduct(searchTerm);

        // Step 7: Verify 'SEARCHED PRODUCTS' is visible
        await searchProductsPage.verifySearchedProductsTitleVisible();

        // Step 8: Verify all the products related to search are visible
        await searchProductsPage.verifySearchResultsContainProduct(searchTerm);
    });
});
