import { test, expect } from '@playwright/test';

test('should verify all archive links return status 200', async ({ page, request }) => {
	await page.goto('/archives');
	// Get all links on archives page
	const links = await page.$$eval('a', elements => elements.map(el => el.href));
	// Loop through each link and check if response is 200
	for (const link of links) {
	  const response = await request.get(link);
	  expect(response.status(), `Check failed for ${link}`).toBe(200);
	}
});