import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly logo: Locator;
    readonly signupLoginLink: Locator;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;
    readonly loginFormHeading: Locator;
    readonly signupFormHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logo = page.getByRole('img', { name: 'Website for automation practice' });
        this.signupLoginLink = page.getByRole('link', { name: ' Signup / Login' });
        this.loginEmailInput = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');
        this.loginPasswordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.signupNameInput = page.getByPlaceholder('Name');
        this.signupEmailInput = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
        this.signupButton = page.getByRole('button', { name: 'Signup' });
        this.loginFormHeading = page.getByRole('heading', { name: 'Login to your account' });
        this.signupFormHeading = page.getByRole('heading', { name: 'New User Signup!' });
    }

    async navigate() {
        await this.page.goto('/');
    }

    async goToLoginPage() {
        await this.signupLoginLink.click();
    }

    async login(email: string, password: string) {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
    }

    async signup(name: string, email: string) {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.signupButton.click();
    }

    async verifyLogoVisible() {
        await expect(this.logo).toBeVisible();
    }

    async verifySignupLoginLinkVisible() {
        await expect(this.signupLoginLink).toBeVisible();
        await expect(this.signupLoginLink).toHaveText(/Signup \/ Login/);
    }

    async verifyLoginFormVisible() {
        await expect(this.loginFormHeading).toBeVisible();
    }

    async verifySignupFormVisible() {
        await expect(this.signupFormHeading).toBeVisible();
    }

    async verifyLoginPageLoaded() {
        await this.verifyLoginFormVisible();
        await this.verifySignupFormVisible();
    }

    async verifyLoggedInAs(displayName: string) {
        const loggedInAsText = this.page.getByText(` Logged in as ${displayName}`);
        await expect(loggedInAsText).toBeVisible();
    }
}
