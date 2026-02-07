import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/checkoutPage';

test.describe('Checkout Page Tests', () => {
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        checkoutPage = new CheckoutPage(page);
    });

    test('Verify checkout page address details and place order', async ({ page }) => {
        // Login first
        await checkoutPage.login(process.env.USERNAME!, process.env.PASSWORD!);
        
        // Navigate to checkout page
        await checkoutPage.navigateToCheckout();
        
        // Verify Address Details text, Delivery Address and Billing Address headings
        await checkoutPage.verifyAllAddressDetails();
        
        // Verify total amount text and value
        await checkoutPage.verifyTotalAmountTextAndValue();
        
        // Click on Place Order
        await checkoutPage.clickPlaceOrder();
    });
});
