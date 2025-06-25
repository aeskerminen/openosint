import { test } from "@playwright/test";
import featureATests from "./tests/openosint-datapoint-handling.spec.ts";
import featureBTests from "./tests/openosint-datapoint-editing.spec.ts";
import featureCTests from "./tests/openosint-map.spec.ts";

//test.describe("Datapoint Handling Tests", featureATests);
//test.describe("Editing a datapoint's", featureBTests);
test.describe("Datapoint map", featureCTests);
