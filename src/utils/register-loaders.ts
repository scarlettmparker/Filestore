/**
 * Registers all page data loaders.
 */

import "~/utils/configure-framework";
import { registerBucketLayoutDataLoader } from "~/routes/bucket/bucket-layout";
import { registerBucketsDataLoader } from "~/routes";
import { registerStatusDataLoader } from "~/routes/status/status";

// Register all loaders
registerStatusDataLoader();
registerBucketsDataLoader();
registerBucketLayoutDataLoader();
