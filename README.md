# Playwright E2E Test Automation Framework

A comprehensive end-to-end test automation framework built with **Playwright** and **TypeScript** using the **Page Object Model (POM)** design pattern.

## 🚀 Features

- ✅ Page Object Model (POM) architecture
- ✅ TypeScript support
- ✅ Environment-based configuration (.env files)
- ✅ Multiple reporters (HTML, Allure, List)
- ✅ Centralized login utility
- ✅ Reusable test fixtures
- ✅ CI/CD ready with GitHub Actions

---

## 📁 Project Structure

```
playwright-e2e/
├── configs/                    # Test data configurations
│   ├── address.config.ts       # Address test data
│   └── payment.config.ts       # Payment test data
├── fixtures/                   # Custom Playwright fixtures
│   └── auth.fixture.ts         # Authentication fixture
├── pages/                      # Page Object classes
│   ├── cartPage.ts             # Cart page actions & locators
│   ├── checkoutPage.ts         # Checkout page actions & locators
│   ├── loginPags.ts            # Login page actions & locators
│   ├── paymentPage.ts          # Payment page actions & locators
│   ├── searchProductsPage.ts   # Search products page actions & locators
│   └── viewcartPage.ts         # View cart page actions & locators
├── tests/                      # Test specifications
│   ├── addproductstocart.spec.ts
│   ├── checkout.spec.ts
│   ├── login.spec.ts
│   ├── payment.spec.ts
│   ├── searchproducts.spec.ts
│   └── viewcart.spec.ts
├── utils/                      # Utility functions
│   └── loginHelper.ts          # Centralized login helper
├── downloads/                  # Downloaded files during tests
├── screenshots/                # Test screenshots
├── allure-results/             # Allure report data
├── allure-report/              # Generated Allure report
├── playwright-report/          # Playwright HTML report
├── test-results/               # Test artifacts
├── .env.qa                     # QA environment variables
├── playwright.config.ts        # Playwright configuration
└── package.json                # Project dependencies
```

---

## 🛠️ Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rohan4842/playwright-e2e.git
   cd playwright-e2e
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

---

## ⚙️ Configuration

Create a `.env.qa` file in the root directory with the following variables:

```env
NODE_ENV=qa
BASE_URL=https://automationexercise.com/
CHECKOUT_URL=https://automationexercise.com/checkout
PAYMENT_URL=https://automationexercise.com/payment
USERNAME=your-email@example.com
PASSWORD=your-password
USER_DISPLAY_NAME=your-display-name
```

---

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (with browser visible)
```bash
npm run test:headed
```

### Run tests with QA environment
```bash
npm run test:qa
```

### Run a specific test file
```bash
npx playwright test tests/login.spec.ts
```

### Run tests with specific tag
```bash
npx playwright test --grep "@smoke"
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run tests with UI mode
```bash
npx playwright test --ui
```

---

## 📊 Reports

### Playwright HTML Report
After test execution, open the HTML report:
```bash
npx playwright show-report
```

### Allure Report
Generate and open Allure report:
```bash
npm run allure:report
```

Or separately:
```bash
# Generate report
npm run allure:generate

# Open report
npm run allure:open
```

### Run tests and generate Allure report
```bash
npm run test:qa:allure
```

---

## 📜 Available NPM Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests with QA environment |
| `npm run test:headed` | Run tests with browser visible |
| `npm run test:qa` | Run tests with QA environment |
| `npm run test:qa:allure` | Run tests and generate Allure report |
| `npm run allure:generate` | Generate Allure report from results |
| `npm run allure:open` | Open Allure report in browser |
| `npm run allure:report` | Generate and open Allure report |

---

## 🏗️ Project Architecture

### Page Object Model (POM)
Each page has a dedicated class containing:
- **Locators**: Element selectors
- **Actions**: Methods to interact with elements
- **Verifications**: Assertion methods

### Centralized Login Helper
Located in `utils/loginHelper.ts`, provides reusable login functions:
- `loginViaUI(page)` - Direct UI login
- `loginWithApiVerification(page)` - API verification + UI login
- `quickLogin(page)` - Quick login from home page

---

## 🔧 Playwright Configuration

Key configurations in `playwright.config.ts`:
- **Timeout**: 60 seconds per test
- **Retries**: 1 (local), 2 (CI)
- **Reporters**: List, HTML, Allure
- **Browser**: Chromium (default)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📝 License

ISC License
