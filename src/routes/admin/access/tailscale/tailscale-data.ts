import { defineLoader } from "@sun/ssr";
import { executeDocument } from "@sun/api";
import { AUTH_COOKIE, getCookieValue } from "~/utils/auth";
import {
  TailscaleDevicesDocument,
  TailscaleDeviceDocument,
  type TailscaleDevicesQuery,
  type TailscaleDeviceQuery,
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

/**
 * Loads a single Tailscale device by id for the detail panel.
 */
defineLoader({
  pattern: "tailscaleDevice/:id",
  async loader(params, context) {
    const id = params.id as string;
    if (!id) return { tailscaleDevice: null };
    const token = getCookieValue(context?.cookie, AUTH_COOKIE);
    if (!token) return { tailscaleDevice: null };
    try {
      const result = await executeDocument<TailscaleDeviceQuery>(
        TailscaleDeviceDocument,
        { id },
        token,
      );
      return {
        tailscaleDevice: result.data?.gaiaQueries?.tailscaleDevice ?? null,
      };
    } catch {
      return { tailscaleDevice: null };
    }
  },
});
