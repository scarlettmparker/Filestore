/**
 * Registers all page data loaders.
 * TODO: Have this as a point of registering data loaders and have specific
 * stem-player etc. data loaders registered here.
 */

import { registerBucketsDataLoader } from "~/routes";
import { registerFolderOverviewDataLoader } from "~/routes/bucket/[alias]/[...path]/folder";
import { registerBucketOverviewDataLoader } from "~/routes/bucket/[alias]/bucket";
import { registerStatusDataLoader } from "~/routes/status/status";

// // Register all loaders
registerStatusDataLoader();
registerBucketsDataLoader();
registerBucketOverviewDataLoader();
registerFolderOverviewDataLoader();
