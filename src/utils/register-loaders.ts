/**
 * Registers all page data loaders.
 * TODO: Have this as a point of registering data loaders and have specific
 * stem-player etc. data loaders registered here.
 */

import { registerStatusDataLoader } from "~/routes/status/status";

// // Register all loaders
registerStatusDataLoader();
