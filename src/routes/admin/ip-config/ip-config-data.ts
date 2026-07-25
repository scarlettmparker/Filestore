import { defineLoader } from "@sun/ssr";
import { executeDocument } from "@sun/api";
import { AUTH_COOKIE, getCookieValue } from "~/utils/auth";
import {
  IpWhitelistEntriesDocument,
  type IpWhitelistEntriesQuery,
} from "~/generated/graphql";

/**
 * Loads all IP whitelist entries for the admin IP config page.
 */
defineLoader({
  pattern: "ipEntries",
  async loader(_params, context) {
    const token = getCookieValue(context?.cookie, AUTH_COOKIE);
    if (!token) return { ipEntries: [] };
    try {
      const result = await executeDocument<IpWhitelistEntriesQuery>(
        IpWhitelistEntriesDocument,
        {},
        token,
      );
      const data = result.data?.gaiaQueries?.ipWhitelistEntries;
      return { ipEntries: data ?? [] };
    } catch {
      return { ipEntries: [] };
    }
  },
});
