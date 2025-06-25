import { expect, Page } from "@playwright/test";

const createTestDatapoint = async (page : Page) => {
  await page.goto("https://localhost:443/");
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
};

export { createTestDatapoint };
