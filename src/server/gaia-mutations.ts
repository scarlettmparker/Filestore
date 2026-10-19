import { defineMutation, MutationError, type MutationContext } from "@sun/ssr";
import { executeDocument } from "@sun/api";
import { tokenFrom } from "./context";
import { clientId, clientSecret } from "../../config.js";
import {
  ExpireTailscaleDeviceDocument,
  type ExpireTailscaleDeviceResponse,
  type ExpireTailscaleDeviceMutation,
} from "~/generated/graphql";
import {
  SuspendAccountDocument,
  UnsuspendAccountDocument,
  CreateIpWhitelistEntryDocument,
  UpdateIpWhitelistEntryDocument,
  DeleteIpWhitelistEntryDocument,
  type SuspendAccountResponse,
  type UnsuspendAccountResponse,
  type CreateIpWhitelistEntryResponse,
  type UpdateIpWhitelistEntryResponse,
  type DeleteIpWhitelistEntryResponse,
  type SuspendAccountMutation,
  type CreateIpWhitelistEntryMutation,
  type UpdateIpWhitelistEntryMutation,
  type DeleteIpWhitelistEntryMutation,
  type UnsuspendAccountMutation,
} from "~/generated/graphql";

/**
 * Suspends an account, revoking all active sessions.
 */
defineMutation({
  path: "gaia/suspendAccount",
  async handler(body: { id: string }, context: MutationContext): Promise<SuspendAccountResponse> {
    const result = await executeDocument<SuspendAccountMutation>(
      SuspendAccountDocument,
      { id: body.id },
      tokenFrom(context),
    );
    const response = result.data?.gaiaMutations?.suspendAccount;
    if (response == null) {
      throw new MutationError(result.error || "Failed to suspend account.");
    }
    return response;
  },
});

/**
 * Creates an IP whitelist entry.
 */
defineMutation({
  path: "gaia/createIpWhitelistEntry",
  async handler(
    body: {
      pattern: string;
      description?: string | null;
      immutable?: boolean;
      enabled?: boolean;
    },
    context: MutationContext,
  ): Promise<CreateIpWhitelistEntryResponse> {
    const result = await executeDocument<CreateIpWhitelistEntryMutation>(
      CreateIpWhitelistEntryDocument,
      {
        input: {
          pattern: body.pattern,
          description: body.description,
          immutable: body.immutable,
          enabled: body.enabled,
        },
      },
      tokenFrom(context),
    );
    const response = result.data?.gaiaMutations?.createIpWhitelistEntry;
    if (response == null) {
      throw new MutationError(result.error || "Failed to create IP whitelist entry.");
    }
    return response;
  },
});

/**
 * Updates an IP whitelist entry.
 */
defineMutation({
  path: "gaia/updateIpWhitelistEntry",
  async handler(
    body: {
      id: string;
      pattern: string;
      description?: string | null;
      enabled?: boolean;
    },
    context: MutationContext,
  ): Promise<UpdateIpWhitelistEntryResponse> {
    const { id, ...input } = body;
    const result = await executeDocument<UpdateIpWhitelistEntryMutation>(
      UpdateIpWhitelistEntryDocument,
      { id, input },
      tokenFrom(context),
    );
    const response = result.data?.gaiaMutations?.updateIpWhitelistEntry;
    if (response == null) {
      throw new MutationError(result.error || "Failed to update IP whitelist entry.");
    }
    return response;
  },
});

/**
 * Deletes an IP whitelist entry.
 */
defineMutation({
  path: "gaia/deleteIpWhitelistEntry",
  async handler(
    body: { id: string },
    context: MutationContext,
  ): Promise<DeleteIpWhitelistEntryResponse> {
    const result = await executeDocument<DeleteIpWhitelistEntryMutation>(
      DeleteIpWhitelistEntryDocument,
      { id: body.id },
      tokenFrom(context),
    );
    const response = result.data?.gaiaMutations?.deleteIpWhitelistEntry;
    if (response == null) {
      throw new MutationError(result.error || "Failed to delete IP whitelist entry.");
    }
    return response;
  },
});

/**
 * Re-activates a suspended account.
 */
defineMutation({
  path: "gaia/unsuspendAccount",
  async handler(body: { id: string }, context: MutationContext): Promise<UnsuspendAccountResponse> {
    const result = await executeDocument<UnsuspendAccountMutation>(
      UnsuspendAccountDocument,
      { id: body.id },
      tokenFrom(context),
    );
    const response = result.data?.gaiaMutations?.unsuspendAccount;
    if (response == null) {
      throw new MutationError(result.error || "Failed to unsuspend account.");
    }
    return response;
  },
});

/**
 * Generates a pre-auth key via Headscale and returns the QR code
 * as a base64 data URL along with the raw key text.
 */
defineMutation({
  path: "headscale/generate-key",
  async handler(body: { expiry: string }): Promise<{ qrDataUrl: string; keyText: string }> {
    const backendUrl =
      process.env.GRAPHQL_ENDPOINT?.replace("/graphql", "") || "http://localhost:8083";
    const res = await fetch(
      `${backendUrl}/api/headscale/preauth-key?expiry=${encodeURIComponent(body.expiry)}`,
      {
        headers: { "X-Client-Id": clientId, "X-Client-Secret": clientSecret },
      },
    );
    if (!res.ok) {
      throw new MutationError(`Backend returned ${res.status}`);
    }
    const keyText = res.headers.get("X-Preauth-Key") || "";
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return { qrDataUrl: `data:image/png;base64,${base64}`, keyText };
  },
});

/**
 * Expires a Tailscale node via Headscale.
 */
defineMutation({
  path: "headscale/expire-node",
  async handler(body: { id: number }): Promise<{ message: string }> {
    const backendUrl =
      process.env.GRAPHQL_ENDPOINT?.replace("/graphql", "") || "http://localhost:8083";
    const headers = {
      "X-Client-Id": clientId,
      "X-Client-Secret": clientSecret,
    };
    const res = await fetch(`${backendUrl}/api/headscale/nodes/${body.id}/expire`, {
      method: "POST",
      headers,
    });
    if (!res.ok) {
      throw new MutationError(`Backend returned ${res.status}`);
    }
    return { message: "Node expired" };
  },
});

/**
 * Marks a Tailscale device as expired in Gaia.
 */
defineMutation({
  path: "gaia/expireTailscaleDevice",
  async handler(
    body: { id: string },
    context: MutationContext,
  ): Promise<ExpireTailscaleDeviceResponse> {
    const result = await executeDocument<ExpireTailscaleDeviceMutation>(
      ExpireTailscaleDeviceDocument,
      { id: body.id },
      tokenFrom(context),
    );
    const response = result.data?.gaiaMutations?.expireTailscaleDevice;
    if (response == null) {
      throw new MutationError(result.error || "Failed to expire Tailscale device.");
    }
    return response;
  },
});
