import { Page, expect } from '@playwright/test';

/**
 * Login credentials interface
 */
export interface LoginCredentials {
    username: string;
    password: string;
    userDisplayName: string;
}

/**
 * Get login credentials from environment variables
 */
export function getCredentials(): LoginCredentials {
    return {
        username: process.env.USERNAME!,
        password: process.env.PASSWORD!,
        userDisplayName: process.env.USER_DISPLAY_NAME!
    };
}

/**
 * Perform UI login with verification
 * @param page - Playwright page object
 * @param credentials - Optional credentials, defaults to env variables
 */
export async function loginViaUI(page: Page, credentials?: Partial<LoginCredentials>): Promise<void> {
    const creds = { ...getCredentials(), ...credentials };
    
    // Navigate to login page
    await page.goto('/login');
    
    // Fill login form
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(creds.username);
    await page.getByPlaceholder('Password').fill(creds.password);
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify user is logged in
    await expect(page.getByText(` Logged in as ${creds.userDisplayName}`)).toBeVisible();
    
    console.log(`Logged in as: ${creds.userDisplayName}`);
}

/**
 * Verify login credentials via API and then perform UI login
 * @param page - Playwright page object
 * @param credentials - Optional credentials, defaults to env variables
 */
export async function loginWithApiVerification(page: Page, credentials?: Partial<LoginCredentials>): Promise<void> {
    const creds = { ...getCredentials(), ...credentials };
    
    // Verify credentials via API first
    const apiResponse = await page.request.post('https://automationexercise.com/api/verifyLogin', {
        form: {
            email: creds.username,
            password: creds.password
        }
    });

    const responseBody = await apiResponse.json();
    expect(responseBody.responseCode).toBe(200);
    
    // Perform UI login (API doesn't set session cookies)
    await loginViaUI(page, creds);
}

/**
 * Quick login - navigates to home, clicks login link, and logs in
 * @param page - Playwright page object
 * @param credentials - Optional credentials, defaults to env variables
 */
export async function quickLogin(page: Page, credentials?: Partial<LoginCredentials>): Promise<void> {
    const creds = { ...getCredentials(), ...credentials };
    
    // Navigate to home page
    await page.goto('/');
    
    // Click on Signup/Login link
    await page.getByRole('link', { name: ' Signup / Login' }).click();
    
    // Fill login form
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(creds.username);
    await page.getByPlaceholder('Password').fill(creds.password);
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify user is logged in
    await expect(page.getByText(` Logged in as ${creds.userDisplayName}`)).toBeVisible();
    
    console.log(`Logged in as: ${creds.userDisplayName}`);
}
