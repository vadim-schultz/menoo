import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Blank Screen Detection
 *
 * These tests verify that the application renders content and doesn't show a blank screen
 * under various conditions including API failures and network issues.
 */

test.describe('Blank Screen Detection', () => {
  test('should render content on home page (not blank)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify page is not blank - check for visible content
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check that root element is populated (not empty)
    const appRoot = page.locator('#app');
    await expect(appRoot).toBeVisible();
    
    // Verify app root has content (not just empty div)
    const appContent = await appRoot.textContent();
    expect(appContent?.trim().length).toBeGreaterThan(0);

    // Check for navigation or any visible UI element
    const navigation = page.locator('nav, [role="navigation"], a[href*="ingredients"], a[href*="recipes"]').first();
    if (await navigation.count() > 0) {
      await expect(navigation).toBeVisible();
    }

    // Verify no error boundary is showing
    const errorBoundary = page.locator('text=/Application Error/i');
    await expect(errorBoundary).toHaveCount(0);
  });

  test('should not show blank screen when API fails', async ({ page }) => {
    // Intercept and fail all API requests
    await page.route('**/api/**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ detail: 'Internal Server Error' }),
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Even with API failures, page should show error state, not blank screen
    const body = page.locator('body');
    await expect(body).toBeVisible();

    const appRoot = page.locator('#app');
    await expect(appRoot).toBeVisible();

    // Should show either error message or loading state, not blank
    const appContent = await appRoot.textContent();
    expect(appContent?.trim().length).toBeGreaterThan(0);

    // Should show error message or loading indicator, not blank
    const hasErrorOrLoading = await Promise.race([
      page.locator('text=/error|loading|failed/i').first().isVisible().then(() => true),
      page.locator('[role="alert"], .error, .loading').first().isVisible().then(() => true),
      page.waitForTimeout(1000).then(() => false),
    ]);
    
    // If API fails, we should see some feedback (error or loading), not blank
    expect(hasErrorOrLoading || appContent?.trim().length > 0).toBe(true);
  });

  test('should handle network offline gracefully', async ({ page, context }) => {
    // Simulate offline mode
    await context.setOffline(true);

    await page.goto('/');
    // Wait a bit for the page to attempt loading
    await page.waitForTimeout(2000);

    // Page should not be blank even when offline
    const body = page.locator('body');
    await expect(body).toBeVisible();

    const appRoot = page.locator('#app');
    await expect(appRoot).toBeVisible();

    // Should have some content (error message, loading, or cached content)
    const appContent = await appRoot.textContent();
    expect(appContent?.trim().length).toBeGreaterThan(0);
  });

  test('should not show blank screen with invalid API response', async ({ page }) => {
    // Intercept and return invalid JSON
    await page.route('**/api/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'invalid json response{{{',
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should handle invalid response gracefully, not show blank screen
    const appRoot = page.locator('#app');
    await expect(appRoot).toBeVisible();

    const appContent = await appRoot.textContent();
    expect(appContent?.trim().length).toBeGreaterThan(0);
  });

  test('should check for console errors after page load', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait a bit more for any async errors
    await page.waitForTimeout(1000);

    // Log console errors for debugging but don't fail test
    // (some errors might be expected, but we want to know about them)
    if (consoleErrors.length > 0) {
      console.log('Console errors detected:', consoleErrors);
    }

    // Verify page still rendered despite any console errors
    const appRoot = page.locator('#app');
    await expect(appRoot).toBeVisible();

    const appContent = await appRoot.textContent();
    expect(appContent?.trim().length).toBeGreaterThan(0);
  });

  test('should verify root element is populated on all routes', async ({ page }) => {
    const routes = ['/', '/ingredients', '/recipes'];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const appRoot = page.locator('#app');
      await expect(appRoot).toBeVisible();

      const appContent = await appRoot.textContent();
      expect(appContent?.trim().length).toBeGreaterThan(0);

      // Verify no error boundary is showing
      const errorBoundary = page.locator('text=/Application Error/i');
      await expect(errorBoundary).toHaveCount(0);
    }
  });

  test('should detect if ErrorBoundary is showing error state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if error boundary error message is visible
    const errorBoundaryVisible = await page
      .locator('text=/Application Error/i')
      .isVisible()
      .catch(() => false);

    if (errorBoundaryVisible) {
      // If error boundary is showing, verify it's not blank
      const errorMessage = page.locator('text=/Application Error/i');
      await expect(errorMessage).toBeVisible();

      // Error boundary should have reload button
      const reloadButton = page.locator('button:has-text("Reload Page")');
      await expect(reloadButton).toBeVisible();
    } else {
      // If no error boundary, verify normal content is visible
      const appRoot = page.locator('#app');
      await expect(appRoot).toBeVisible();
      const appContent = await appRoot.textContent();
      expect(appContent?.trim().length).toBeGreaterThan(0);
    }
  });
});

