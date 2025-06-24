import { test, expect } from "@playwright/test";
import { beforeEach, describe } from "node:test";

export default function createTests() {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://172.19.0.6:5173/");
  });

  test("name works correctly.", async ({ page }) => {
    await page.getByRole("button", { name: "Choose File" }).click();
    await page
      .getByRole("button", { name: "Choose File" })
      .setInputFiles("./test-input-files/leopard2_test.png");
    await page.getByRole("button", { name: "Upload Datapoint" }).click();
    await expect(page.getByTestId("upload-status-container")).toHaveText(
      /Status:\s*done/i,
      {
        timeout: 10000,
      }
    );

    await page.getByTestId("datapoint-list-entry").first().click();
    await page.getByRole("button", { name: "Edit" }).click();
    await page.getByTestId("datapoint-viewer-attribute-name-edit").dblclick();
    await page
      .getByTestId("datapoint-viewer-attribute-name-edit")
      .fill("test_change_name");
    await page.getByTestId("datapoint-viewer-save-button").click();
    await expect(
      page.getByTestId("datapoint-viewer-attribute-name")
    ).toHaveText("test_change_name");
  }),
    test("description works correctly.", async ({ page }) => {
      await page.getByTestId("datapoint-list-entry").first().click();
      await page.getByRole("button", { name: "Edit" }).click();
      await page
        .getByTestId("datapoint-viewer-attribute-description-edit")
        .click();
      await page
        .getByTestId("datapoint-viewer-attribute-description-edit")
        .fill("test_change_description");
      await page.getByTestId("datapoint-viewer-save-button").click();

      await expect(
        page.getByTestId("datapoint-viewer-attribute-description")
      ).toHaveText("test_change_description");
    }),
    test("event time works correctly.", async ({ page }) => {
      await page.getByTestId("datapoint-list-entry").first().click();
      await page.getByRole("button", { name: "Edit" }).click();
      await page
        .getByTestId("datapoint-viewer-attribute-eventtime-edit")
        .click();
      await page
        .getByTestId("datapoint-viewer-attribute-eventtime-edit")
        .fill("2023-01-22T05:40");
      await page.getByTestId("datapoint-viewer-save-button").click();

      await expect(
        page.getByTestId("datapoint-viewer-attribute-eventtime")
      ).toHaveText("1/22/2023, 5:40:00 AM");
    }),
    test("GPS location works correctly.", async ({ page }) => {
      await page.getByTestId("datapoint-list-entry").first().click();
      await page.getByRole("button", { name: "Edit" }).click();
      await page
        .getByTestId("datapoint-viewer-attribute-longitude-edit")
        .click();
      await page
        .getByTestId("datapoint-viewer-attribute-longitude-edit")
        .fill("22");
      await page
        .getByTestId("datapoint-viewer-attribute-longitude-edit")
        .press("Tab");
      await page
        .getByTestId("datapoint-viewer-attribute-latitude-edit")
        .fill("13");
      await page.getByTestId("datapoint-viewer-save-button").click();

      await expect(
        page.getByTestId("datapoint-viewer-attribute-longitude")
      ).toHaveText("22");
      await expect(
        page.getByTestId("datapoint-viewer-attribute-latitude")
      ).toHaveText("13");
    });
}
