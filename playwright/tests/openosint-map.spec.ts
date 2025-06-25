import { test, expect, Page } from "@playwright/test";
import { createTestDatapoint } from "../utils/testUtils";

export default function createTests() {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    await createTestDatapoint(page);
    await createTestDatapoint(page);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("https://localhost:443/");
  });

  test.afterAll(async () => {
   await page.getByTestId("datapoint-list-remove-button").first().click();
   await page.getByTestId("datapoint-list-remove-button").nth(1).click();

    await page.close();
  });

  test("Clicking DatapointMap opens the map view", async () => {
    await page.getByTestId("toolbar-DatapointMap-button").click();
    await expect(page.getByTestId("datapoint-map-container")).toBeVisible();
  });
}
