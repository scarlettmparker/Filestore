import { defineLoader } from "@sun/ssr";
import { executeDocument } from "@sun/api";
import { AUTH_COOKIE, getCookieValue } from "~/utils/auth";
import {
  TailscaleDevicesDocument,
  type TailscaleDevicesQuery,
} from "~/generated/graphql";

/**
 * Loads all Tailscale devices from Gaia for the admin page list.
 */
defineLoader({
  pattern: "tailscaleDevices",
  async loader(_params, context) {
    const token = getCookieValue(context?.cookie, AUTH_COOKIE);
    if (!token) return { tailscaleDevices: [] };
    try {
      const result = await executeDocument<TailscaleDevicesQuery>(
        TailscaleDevicesDocument,
        {},
        token,
      );
      const data = result.data?.gaiaQueries?.tailscaleDevices;
      return { tailscaleDevices: data ?? [] };
    } catch {
      return { tailscaleDevices: [] };
    }
  },
});
