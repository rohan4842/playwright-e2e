import { Page, Locator, expect } from '@playwright/test';
import { addressConfig, expectedTexts } from '../configs/address.config';

export class CheckoutPage {
    readonly page: Page;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    readonly addressDetailsHeading: Locator;
    readonly deliveryAddressHeading: Locator;
    readonly billingAddressHeading: Locator;
    readonly deliveryAddressDetails: Locator;
    readonly billingAddressDetails: Locator;
    readonly totalAmountText: Locator;
    readonly totalAmountValue: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginEmailInput = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');
        this.loginPasswordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.addressDetailsHeading = page.locator('h2').filter({ hasText: 'Address Details' });
        this.deliveryAddressHeading = page.locator('h3').filter({ hasText: 'Your delivery address' });
        this.billingAddressHeading = page.locator('h3').filter({ hasText: 'Your billing address' });
        this.deliveryAddressDetails = page.locator('#address_delivery');
        this.billingAddressDetails = page.locator('#address_invoice');
        this.totalAmountText = page.locator('h4').filter({ hasText: 'Total Amount' });
        this.totalAmountValue = page.locator('td > p.cart_total_price');
        this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    }

    async navigateToCheckout() {
        const checkoutUrl = process.env.CHECKOUT_URL!;
        await this.page.goto(checkoutUrl);
    }

    async login(email: string, password: string) {
        await this.page.goto('/login');
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyAddressDetailsText() {
        await expect(this.addressDetailsHeading).toBeVisible();
        await expect(this.addressDetailsHeading).toHaveText(expectedTexts.addressDetails);
    }

    async verifyDeliveryAddressHeading() {
        await expect(this.deliveryAddressHeading).toBeVisible();
        await expect(this.deliveryAddressHeading).toContainText(expectedTexts.deliveryAddress);
    }

    async verifyBillingAddressHeading() {
        await expect(this.billingAddressHeading).toBeVisible();
        await expect(this.billingAddressHeading).toContainText(expectedTexts.billingAddress);
    }

    async verifyDeliveryAddressDetails() {
        await expect(this.deliveryAddressDetails).toContainText(addressConfig.fullName);
        await expect(this.deliveryAddressDetails).toContainText(addressConfig.company);
        await expect(this.deliveryAddressDetails).toContainText(addressConfig.address1);
        await expect(this.deliveryAddressDetails).toContainText(addressConfig.cityStateZip);
        await expect(this.deliveryAddressDetails).toContainText(addressConfig.country);
        await expect(this.deliveryAddressDetails).toContainText(addressConfig.phone);
    }

    async verifyBillingAddressDetails() {
        await expect(this.billingAddressDetails).toContainText(addressConfig.fullName);
        await expect(this.billingAddressDetails).toContainText(addressConfig.company);
        await expect(this.billingAddressDetails).toContainText(addressConfig.address1);
        await expect(this.billingAddressDetails).toContainText(addressConfig.cityStateZip);
        await expect(this.billingAddressDetails).toContainText(addressConfig.country);
        await expect(this.billingAddressDetails).toContainText(addressConfig.phone);
    }

    async verifyAllAddressDetails() {
        await this.verifyAddressDetailsText();
        await this.verifyDeliveryAddressHeading();
        await this.verifyBillingAddressHeading();
        await this.verifyDeliveryAddressDetails();
        await this.verifyBillingAddressDetails();
    }

    async verifyTotalAmountTextAndValue() {
        await expect(this.totalAmountText).toBeVisible();
        const totalAmountValues = await this.totalAmountValue.all();
        expect(totalAmountValues.length).toBeGreaterThan(0);
        for (const amount of totalAmountValues) {
            const text = await amount.textContent();
            expect(text).toMatch(/Rs\.\s*\d+/);
        }
    }

    async clickPlaceOrder() {
        await this.placeOrderButton.click();
    }
}
