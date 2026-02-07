import { Page, Locator, expect } from '@playwright/test';

export class ViewCartPage {
    readonly page: Page;
    readonly cartInfoTable: Locator;
    readonly itemHeader: Locator;
    readonly descriptionHeader: Locator;
    readonly priceHeader: Locator;
    readonly quantityHeader: Locator;
    readonly totalHeader: Locator;
    readonly proceedToCheckoutBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartInfoTable = page.locator('#cart_info_table');
        this.itemHeader = page.locator('#cart_info_table thead tr td').filter({ hasText: 'Item' });
        this.descriptionHeader = page.locator('#cart_info_table thead tr td').filter({ hasText: 'Description' });
        this.priceHeader = page.locator('#cart_info_table thead tr td').filter({ hasText: 'Price' });
        this.quantityHeader = page.locator('#cart_info_table thead tr td').filter({ hasText: 'Quantity' });
        this.totalHeader = page.locator('#cart_info_table thead tr td').filter({ hasText: 'Total' });
        this.proceedToCheckoutBtn = page.getByText('Proceed To Checkout');
    }

    /**
     * Verify cart table headers are visible (Item, Description, Price, Quantity, Total)
     */
    async verifyCartTableHeaders() {
        await expect(this.itemHeader).toBeVisible();
        console.log('Item header is visible');

        await expect(this.descriptionHeader).toBeVisible();
        console.log('Description header is visible');

        await expect(this.priceHeader).toBeVisible();
        console.log('Price header is visible');

        await expect(this.quantityHeader).toBeVisible();
        console.log('Quantity header is visible');

        await expect(this.totalHeader).toBeVisible();
        console.log('Total header is visible');
    }

    /**
     * Click on Proceed To Checkout button
     */
    async clickProceedToCheckout() {
        await this.proceedToCheckoutBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
        console.log('Clicked on Proceed To Checkout button');
    }
}
