import { test, expect } from "@playwright/test";

export default function createTests() {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://localhost:443/");
  });
}
