import { test, expect } from '@playwright/test';

test.describe('BMI App Basic Tests', () => {

  // Case 1: Homepage Loads and displays correct branding
  test('should display homepage with correct branding', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/BMI Web App/);
    await expect(page.locator('text=BMITracker').first()).toBeVisible();
  });

  // Case 2: Navigation to Login Page
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h1')).toContainText('Login');
  });

  // Case 3: Navigation to Register Page
  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Register');
    await expect(page).toHaveURL(/.*\/register/);
    await expect(page.locator('h1')).toContainText('Register');
  });

  // Case 4: Protected Route Redirection
  test('should redirect unauthenticated user from dashboard to login', async ({ page }) => {
    await page.goto('/dashboard');
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login/);
  });

  // Case 5: Login Form Elements Presence
  test('should display login form inputs', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

});
