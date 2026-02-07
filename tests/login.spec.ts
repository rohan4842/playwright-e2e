import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPags';

test('Login with valid credentials', async ({ page }) => {
  // Get credentials from .env.qa
  const username = process.env.USERNAME!;
  const password = process.env.PASSWORD!;
  const userDisplayName = process.env.USER_DISPLAY_NAME!;

  const loginPage = new LoginPage(page);

  // Navigate to BASE_URL from .env.qa
  await loginPage.navigate();

  // Verify the logo is visible
  await loginPage.verifyLogoVisible();

  // Verify "Signup / Login" link text is visible
  await loginPage.verifySignupLoginLinkVisible();

  // Click on SignUp/Login
  await loginPage.goToLoginPage();

  // Verify login page is loaded (both forms visible - active tab validation)
  await loginPage.verifyLoginPageLoaded();

  // Enter username and password from .env.qa and click Login
  await loginPage.login(username, password);

  // Verify user is logged in with display name from .env.qa
  await loginPage.verifyLoggedInAs(userDisplayName);
});
