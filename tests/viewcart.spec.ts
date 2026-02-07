import { test, expect } from '@playwright/test';
import { ViewCartPage } from '../pages/viewcartPage';
import { LoginPage } from '../pages/loginPags';

test.describe('View Cart Page', () => {
    test('Verify cart table headers and proceed to checkout', async ({ page }) => {
        // Get credentials from .env
        const username = process.env.USERNAME!;
        const password = process.env.PASSWORD!;
        const userDisplayName = process.env.USER_DISPLAY_NAME!;

        const loginPage = new LoginPage(page);
        const viewCartPage = new ViewCartPage(page);

        // Navigate to home page
        await loginPage.navigate();

        // Click on SignUp/Login
        await loginPage.goToLoginPage();

        // Login with credentials
        await loginPage.login(username, password);

        // Verify user is logged in
        await loginPage.verifyLoggedInAs(userDisplayName);

        // Navigate to view cart page using BASE_URL from .env.qa
        await page.goto(`${process.env.BASE_URL}view_cart`);

        // Verify cart table headers (Item, Description, Price, Quantity, Total)
        await viewCartPage.verifyCartTableHeaders();

        // Click on Proceed To Checkout button
        await viewCartPage.clickProceedToCheckout();
    });
});
