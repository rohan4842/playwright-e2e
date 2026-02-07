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
        this.itemHeader = page.locator('#cart_info_table td.cart_menu', { hasText: 'Item' });
        this.descriptionHeader = page.locator('#cart_info_table td.cart_description', { hasText: 'Description' });
        this.priceHeader = page.locator('#cart_info_table td.cart_menu', { hasText: 'Price' });
        this.quantityHeader = page.locator('#cart_info_table td.cart_menu', { hasText: 'Quantity' });
        this.totalHeader = page.locator('#cart_info_table td.cart_menu', { hasText: 'Total' });
        this.proceedToCheckoutBtn = page.getByText('Proceed To Checkout');
    }

    /**
     * Verify cart table headers are visible (Item, Description, Price, Quantity, Total)
     */
    async verifyCartTableHeaders() {
        // Wait for the cart table to be visible first
        await expect(this.cartInfoTable).toBeVisible();
        
        // Verify headers using text content on the page
        await expect(this.page.getByRole('row').first()).toContainText('Item');
        console.log('Item header is visible');

        await expect(this.page.getByRole('row').first()).toContainText('Description');
        console.log('Description header is visible');

        await expect(this.page.getByRole('row').first()).toContainText('Price');
        console.log('Price header is visible');

        await expect(this.page.getByRole('row').first()).toContainText('Quantity');
        console.log('Quantity header is visible');

        await expect(this.page.getByRole('row').first()).toContainText('Total');
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
