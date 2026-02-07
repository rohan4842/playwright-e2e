import { test as base, expect } from '@playwright/test';

/**
 * Custom fixture that handles authentication via API
 * This avoids repeating the login UI flow for each test
 */
export const test = base.extend<{ authenticatedPage: typeof base }>({
    page: async ({ page, context }, use) => {
        const username = process.env.USERNAME!;
        const password = process.env.PASSWORD!;

        // Login via API call
        const response = await page.request.post('https://automationexercise.com/api/verifyLogin', {
            form: {
                email: username,
                password: password
            }
        });

        // Verify API login was successful
        const responseBody = await response.json();
        expect(responseBody.responseCode).toBe(200);

        // Now set authentication cookies by doing a quick UI login
        // This is needed because the API doesn't return session cookies directly
        await page.goto('/login');
        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(username);
        await page.getByPlaceholder('Password').fill(password);
        await page.getByRole('button', { name: 'Login' }).click();

        // Wait for login to complete
        await expect(page.getByText(` Logged in as ${process.env.USER_DISPLAY_NAME}`)).toBeVisible();

        // Store the authentication state
        await context.storageState({ path: '.auth/user.json' });

        await use(page);
    }
});

export { expect } from '@playwright/test';
