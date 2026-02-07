import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartLink: Locator;
    readonly cartProducts: Locator;
    readonly cartProductNames: Locator;
    readonly cartProductPrices: Locator;
    readonly cartProductQuantities: Locator;
    readonly cartProductTotals: Locator;
    readonly emptyCartMessage: Locator;
    readonly deleteButtons: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.getByRole('link', { name: ' Cart' });
        this.cartProducts = page.locator('#cart_info_table tbody tr');
        this.cartProductNames = page.locator('#cart_info_table tbody tr .cart_description h4 a');
        this.cartProductPrices = page.locator('#cart_info_table tbody tr .cart_price p');
        this.cartProductQuantities = page.locator('#cart_info_table tbody tr .cart_quantity button');
        this.cartProductTotals = page.locator('#cart_info_table tbody tr .cart_total p');
        this.emptyCartMessage = page.locator('#empty_cart');
        this.deleteButtons = page.locator('.cart_quantity_delete');
    }

    /**
     * Clear all products from cart via UI
     * Note: No API endpoint available for cart operations
     */
    async clearCart() {
        // Navigate to cart page
        await this.page.goto('/view_cart');
        await this.page.waitForLoadState('domcontentloaded');

        // Check if cart has items
        const productCount = await this.cartProducts.count();
        
        if (productCount === 0) {
            console.log('Cart is already empty');
            return;
        }

        console.log(`Clearing ${productCount} products from cart...`);

        // Delete all products one by one (always click first delete button as items shift up)
        for (let i = 0; i < productCount; i++) {
            await this.deleteButtons.first().click();
            // Wait for item to be removed
            await this.page.waitForLoadState('domcontentloaded');
        }

        console.log('Cart cleared successfully');
    }

    /**
     * Click on Cart button to navigate to cart page
     */
    async clickOnCartButton() {
        await this.cartLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Verify user is navigated to Cart page
     */
    async verifyCartPageVisible() {
        await expect(this.page).toHaveURL(/view_cart/);
    }

    /**
     * Verify the number of products in the cart
     * @param expectedCount - Expected number of products in cart
     */
    async verifyProductCountInCart(expectedCount: number) {
        await expect(this.cartProducts).toHaveCount(expectedCount);
        console.log(`Verified ${expectedCount} products in cart`);
    }

    /**
     * Verify both products are added to cart
     * @param productNames - Array of expected product names
     */
    async verifyProductsInCart(productNames: string[]) {
        const cartProductNamesList = await this.cartProductNames.allTextContents();
        console.log('Products in cart:', cartProductNamesList);
        
        for (const name of productNames) {
            const found = cartProductNamesList.some(cartName => 
                cartName.toLowerCase().includes(name.toLowerCase())
            );
            expect(found, `Product "${name}" should be in cart`).toBeTruthy();
        }
    }

    /**
     * Get cart product details (name, price, quantity, total)
     */
    async getCartProductDetails() {
        const names = await this.cartProductNames.allTextContents();
        const prices = await this.cartProductPrices.allTextContents();
        const quantities = await this.cartProductQuantities.allTextContents();
        const totals = await this.cartProductTotals.allTextContents();

        const products = names.map((name, index) => ({
            name: name.trim(),
            price: prices[index]?.trim() || '',
            quantity: quantities[index]?.trim() || '',
            total: totals[index]?.trim() || ''
        }));

        console.log('Cart product details:', products);
        return products;
    }

    /**
     * Verify product prices, quantities, and totals
     */
    async verifyCartProductDetails() {
        const products = await this.getCartProductDetails();
        
        for (const product of products) {
            // Verify price is displayed
            expect(product.price).toBeTruthy();
            // Verify quantity is displayed
            expect(product.quantity).toBeTruthy();
            // Verify total is displayed
            expect(product.total).toBeTruthy();
            
            console.log(`Product: ${product.name}, Price: ${product.price}, Qty: ${product.quantity}, Total: ${product.total}`);
        }
    }
}
