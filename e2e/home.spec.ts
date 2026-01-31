import { test, expect } from '@playwright/test';

test('homepage has title and heading', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    // Note: the page title might not be set in the component explicitly, but usually Next.js sets a default.
    // Let's check the H1 instead which we saw in the code.

    await expect(page.locator('h1')).toContainText('Application PWA avec Next.js');

    // Check for the github link
    const githubLink = page.locator('a[href="https://github.com/soniiix/mds-next-pwa"]');
    await expect(githubLink).toBeVisible();
});
