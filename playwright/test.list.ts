import { test } from "@playwright/test";
import featureATests from "./tests/openosint-datapoint-handling.spec.ts";
import featureBTests from "./tests/openosint-datapoint-editing.spec.ts";

test.describe("Datapoint Handling Tests", featureATests);
test.describe("Editing a datapoint's", featureBTests);
