import { configurePageData } from "@sun/ssr";

configurePageData({
  perPatternTtl: {
    "/bucket/:alias": 30000,
    "/bucket/:alias/*": 30000,
    "/currentRoles": Infinity,
  },
});
