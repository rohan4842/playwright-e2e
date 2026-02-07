import { test, expect } from '@playwright/test';
import { ViewCartPage } from '../pages/viewcartPage';
import { LoginPage } from '../pages/loginPags';
import { SearchProductsPage } from '../pages/searchProductsPage';

test.describe('View Cart Page', () => {
    test('Verify cart table headers and proceed to checkout', async ({ page }) => {
        // Get credentials from .env
        const username = process.env.USERNAME!;
        const password = process.env.PASSWORD!;
        const userDisplayName = process.env.USER_DISPLAY_NAME!;

        const loginPage = new LoginPage(page);
        const viewCartPage = new ViewCartPage(page);
        const searchProductsPage = new SearchProductsPage(page);

        // Navigate to home page
        await loginPage.navigate();

        // Click on SignUp/Login
        await loginPage.goToLoginPage();

        // Login with credentials
        await loginPage.login(username, password);

        // Verify user is logged in
        await loginPage.verifyLoggedInAs(userDisplayName);

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
