import { test, expect } from '@playwright/test'

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Create Next App/)
  
  // Check for key content on the homepage
  await expect(page.getByText('To get started, edit the page.tsx file.')).toBeVisible()
  await expect(page.getByText('Deploy Now')).toBeVisible()
  await expect(page.getByText('Documentation')).toBeVisible()
})
