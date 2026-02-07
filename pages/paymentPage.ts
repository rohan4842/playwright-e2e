import { Page, Locator, expect } from '@playwright/test';
import { paymentConfig, paymentExpectedTexts } from '../configs/payment.config';

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
}
