import { test, expect } from '@playwright/test';

test.describe('User Flow: Login and BMI Calculation', () => {
  
  // Generate a random user for this test run to ensure isolation
  const randomId = Math.floor(Math.random() * 10000);
  const testUser = {
    name: `Test User ${randomId}`,
    email: `test${randomId}@example.com`,
    password: 'password123'
  };

  test('should allow a user to register, login, and calculate BMI', async ({ page }) => {
    
    // 1. Register
    await page.goto('/register');
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Expect redirect to login or check for success message
    // Based on previous code, successful register redirects to /login
    await expect(page).toHaveURL(/.*\/login/);

    // 2. Login
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Expect redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');

    // 3. Fill BMI Form (Weight & Height)
    // Using placeholders or labels to locate inputs
    await page.fill('input[placeholder="e.g. 70.5"]', '70'); // Weight
    await page.fill('input[placeholder="e.g. 175"]', '175'); // Height

    // 4. Click Calculate
    await page.click('text=Calculate');

    // 5. Verify Result
    // Based on 70kg / 1.75m^2 = ~22.86 (Normal)
    await expect(page.locator('text=22.9')).toBeVisible(); // 22.857... rounds to 22.9
    await expect(page.locator('text=Normal')).toBeVisible();
    
    // Optional: Save record
    await page.click('text=Save Record');
    // Verify it appears in history (checking date or weight)
    await expect(page.locator('table')).toContainText('70');
  });

});
