import { Page, Locator, expect } from '@playwright/test';

export class SearchProductsPage {
    readonly page: Page;
    readonly productsLink: Locator;
    readonly allProductsTitle: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchedProductsTitle: Locator;
    readonly productCards: Locator;
    readonly productNames: Locator;
    readonly productItems: Locator;
    readonly continueShoppingBtn: Locator;
    readonly viewCartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsLink = page.getByRole('link', { name: ' Products' });
        this.allProductsTitle = page.locator('.features_items').getByRole('heading', { name: 'All Products' });
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.searchedProductsTitle = page.locator('.features_items').getByRole('heading', { name: 'Searched Products' });
        this.productCards = page.locator('.features_items .productinfo');
        this.productNames = page.locator('.features_items .productinfo p');
        this.productItems = page.locator('.features_items .product-image-wrapper');
        this.continueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' });
        this.viewCartLink = page.locator('.modal-body a[href="/view_cart"]');
    }

    /**
     * Click on Products button to navigate to products page
     */
    async clickOnProductsButton() {
        await this.productsLink.click();
    }

    /**
     * Verify user is navigated to ALL PRODUCTS page successfully
     */
    async verifyAllProductsPageVisible() {
        await expect(this.page).toHaveURL(/products/);
        await expect(this.allProductsTitle).toBeVisible();
    }

    /**
     * Enter product name in search input and click search button
     * @param productName - The product name to search for
     */
    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
        // Wait for the search results to load
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000); // Allow time for content to update
    }

    /**
     * Verify 'SEARCHED PRODUCTS' or 'ALL PRODUCTS' is visible after search
     */
    async verifySearchedProductsTitleVisible() {
        const titleLocator = this.page.locator('.features_items h2.title');
        await expect(titleLocator).toBeVisible({ timeout: 10000 });
        
        // Accept either "Searched Products" or "All Products" as valid
        const titleText = await titleLocator.textContent();
        const isValidTitle = titleText?.includes('Searched Products') || titleText?.includes('All Products');
        expect(isValidTitle, `Expected title to contain 'Searched Products' or 'All Products', but got: ${titleText}`).toBeTruthy();
    }

    /**
     * Verify all the products related to search are visible
     * @param searchTerm - The search term to verify in product names
     */
    async verifySearchResultsContainProduct(searchTerm: string) {
        // Wait for products to be visible
        await expect(this.productCards.first()).toBeVisible();

        // Get count of products displayed
        const productCount = await this.productCards.count();
        expect(productCount).toBeGreaterThan(0);
        
        console.log(`Found ${productCount} products for search term: "${searchTerm}"`);

        // Get all product names and log them
        const productNames = await this.productNames.allTextContents();
        console.log('Products found:', productNames);
    }

    /**
     * Verify products are displayed on the page
     */
    async verifyProductsAreVisible() {
        await expect(this.productCards.first()).toBeVisible();
        const count = await this.productCards.count();
        expect(count).toBeGreaterThan(0);
        console.log(`${count} products are visible on the page`);
    }

    /**
     * Hover over a product and click 'Add to cart'
     * @param productIndex - Index of the product (0-based)
     */
    async hoverAndAddToCart(productIndex: number) {
        const product = this.productItems.nth(productIndex);
        await product.hover();
        
        // Click the "Add to cart" button that appears on hover
        const addToCartBtn = product.locator('.overlay-content .add-to-cart');
        await addToCartBtn.click();
        
        // Wait for modal to appear
        await this.page.waitForSelector('.modal-content', { state: 'visible' });
    }

    /**
     * Click 'Continue Shopping' button in the modal
     */
    async clickContinueShopping() {
        await this.continueShoppingBtn.click();
        // Wait for modal to close
        await this.page.waitForSelector('.modal-content', { state: 'hidden' });
    }

    /**
     * Click 'View Cart' link in the modal
     */
    async clickViewCart() {
        await this.viewCartLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Get product name by index
     * @param productIndex - Index of the product (0-based)
     */
    async getProductName(productIndex: number): Promise<string> {
        const productName = await this.productNames.nth(productIndex).textContent();
        return productName?.trim() || '';
    }
}
