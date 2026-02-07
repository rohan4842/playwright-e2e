import { test, expect } from '@playwright/test';
import { PaymentPage } from '../pages/paymentPage';
import * as fs from 'fs';

test.describe('Payment Page Tests', () => {
    let paymentPage: PaymentPage;

    test.beforeEach(async ({ page }) => {
        paymentPage = new PaymentPage(page);
    });

    test('Verify payment page labels and complete payment', async ({ page }) => {
        // Login first
        await paymentPage.login(process.env.USERNAME!, process.env.PASSWORD!);
        
        // Navigate to payment page
        await paymentPage.navigateToPayment();
        
        // Verify Payment heading text
        await paymentPage.verifyPaymentHeading();
        
        // Verify all payment labels: Name on Card, Card Number, CVC, Expiration, Pay and Confirm Order
        await paymentPage.verifyAllPaymentLabels();
        
        // Enter payment details
        await paymentPage.enterPaymentDetails();
        
        // Click on Pay and Confirm Order
        await paymentPage.clickPayAndConfirmOrder();
        
        // Verify "Order Placed!" heading
        await paymentPage.verifyOrderPlacedHeading();
        
        // Verify "Congratulations! Your order has been confirmed!" message
        await paymentPage.verifyCongratulationsMessage();
        
        // Click on Download Invoice and save to downloads folder
        const invoicePath = await paymentPage.downloadInvoice();
        
        // Verify the file was downloaded
        expect(fs.existsSync(invoicePath)).toBeTruthy();
        console.log(`Invoice file verified at: ${invoicePath}`);
        
        // Click on Continue button
        await paymentPage.clickContinue();
    });
});
