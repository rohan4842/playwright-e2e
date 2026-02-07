import { Page, Locator, expect } from '@playwright/test';
import { paymentConfig, paymentExpectedTexts } from '../configs/payment.config';
import * as path from 'path';
import * as fs from 'fs';

export class PaymentPage {
    readonly page: Page;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    readonly paymentHeading: Locator;
    readonly nameOnCardLabel: Locator;
    readonly cardNumberLabel: Locator;
    readonly cvcLabel: Locator;
    readonly expirationLabel: Locator;
    readonly payAndConfirmButton: Locator;
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expirationMonthInput: Locator;
    readonly expirationYearInput: Locator;
    readonly orderSuccessMessage: Locator;
    readonly orderPlacedHeading: Locator;
    readonly congratulationsMessage: Locator;
    readonly downloadInvoiceButton: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginEmailInput = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');
        this.loginPasswordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.paymentHeading = page.locator('.heading').filter({ hasText: 'Payment' });
        this.nameOnCardLabel = page.locator('label').filter({ hasText: 'Name on Card' });
        this.cardNumberLabel = page.locator('label').filter({ hasText: 'Card Number' });
        this.cvcLabel = page.locator('label').filter({ hasText: 'CVC' });
        this.expirationLabel = page.locator('label').filter({ hasText: 'Expiration' });
        this.payAndConfirmButton = page.getByRole('button', { name: 'Pay and Confirm Order' });
        this.nameOnCardInput = page.locator('input[name="name_on_card"]');
        this.cardNumberInput = page.locator('input[name="card_number"]');
        this.cvcInput = page.locator('input[name="cvc"]');
        this.expirationMonthInput = page.locator('input[name="expiry_month"]');
        this.expirationYearInput = page.locator('input[name="expiry_year"]');
        this.orderSuccessMessage = page.getByText('Your order has been placed successfully!');
        this.orderPlacedHeading = page.getByText('Order Placed!');
        this.congratulationsMessage = page.getByText('Congratulations! Your order has been confirmed!');
        this.downloadInvoiceButton = page.getByRole('link', { name: 'Download Invoice' });
        this.continueButton = page.getByRole('link', { name: 'Continue' });
    }

    async login(email: string, password: string) {
        await this.page.goto('/login');
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
    }

    async navigateToPayment() {
        const paymentUrl = process.env.PAYMENT_URL!;
        await this.page.goto(paymentUrl);
    }

    async verifyPaymentHeading() {
        await expect(this.paymentHeading).toBeVisible();
        await expect(this.paymentHeading).toContainText(paymentExpectedTexts.paymentHeading);
    }

    async verifyNameOnCardLabel() {
        await expect(this.nameOnCardLabel).toBeVisible();
        await expect(this.nameOnCardLabel).toContainText(paymentExpectedTexts.nameOnCard);
    }

    async verifyCardNumberLabel() {
        await expect(this.cardNumberLabel).toBeVisible();
        await expect(this.cardNumberLabel).toContainText(paymentExpectedTexts.cardNumber);
    }

    async verifyCvcLabel() {
        await expect(this.cvcLabel).toBeVisible();
        await expect(this.cvcLabel).toContainText(paymentExpectedTexts.cvc);
    }

    async verifyExpirationLabel() {
        await expect(this.expirationLabel).toBeVisible();
        await expect(this.expirationLabel).toContainText(paymentExpectedTexts.expiration);
    }

    async verifyPayAndConfirmButton() {
        await expect(this.payAndConfirmButton).toBeVisible();
        await expect(this.payAndConfirmButton).toContainText(paymentExpectedTexts.payAndConfirmOrder);
    }

    async verifyAllPaymentLabels() {
        await this.verifyPaymentHeading();
        await this.verifyNameOnCardLabel();
        await this.verifyCardNumberLabel();
        await this.verifyCvcLabel();
        await this.verifyExpirationLabel();
        await this.verifyPayAndConfirmButton();
    }

    async enterPaymentDetails() {
        await this.nameOnCardInput.fill(paymentConfig.nameOnCard);
        await this.cardNumberInput.fill(paymentConfig.cardNumber);
        await this.cvcInput.fill(paymentConfig.cvc);
        await this.expirationMonthInput.fill(paymentConfig.expirationMonth);
        await this.expirationYearInput.fill(paymentConfig.expirationYear);
    }

    async clickPayAndConfirmOrder() {
        await this.payAndConfirmButton.click();
    }

    async verifyOrderPlacedSuccessfully() {
        await expect(this.orderSuccessMessage).toBeVisible();
        console.log('Order placed successfully message is visible');
    }

    async verifyOrderPlacedHeading() {
        await expect(this.orderPlacedHeading).toBeVisible();
        console.log('Order Placed! heading is visible');
    }

    async verifyCongratulationsMessage() {
        await expect(this.congratulationsMessage).toBeVisible();
        console.log('Congratulations message is visible');
    }

    async verifyOrderConfirmation() {
        await this.verifyOrderPlacedHeading();
        await this.verifyCongratulationsMessage();
    }

    async downloadInvoice(): Promise<string> {
        // Create downloads folder if it doesn't exist
        const downloadsFolder = path.join(process.cwd(), 'downloads');
        if (!fs.existsSync(downloadsFolder)) {
            fs.mkdirSync(downloadsFolder, { recursive: true });
        }

        // Wait for the download to start when clicking the button
        const downloadPromise = this.page.waitForEvent('download');
        await this.downloadInvoiceButton.click();
        const download = await downloadPromise;

        // Save the file to the downloads folder
        const fileName = download.suggestedFilename();
        const filePath = path.join(downloadsFolder, fileName);
        await download.saveAs(filePath);

        console.log(`Invoice downloaded successfully to: ${filePath}`);
        return filePath;
    }

    async clickContinue() {
        await this.continueButton.click();
        console.log('Clicked on Continue button');
    }
}
