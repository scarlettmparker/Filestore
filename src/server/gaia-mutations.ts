import {
  defineMutation,
  makeCacheKey,
  type MutationContext,
  type MutationResult,
} from "@sun/ssr";
import { executeDocument } from "@sun/api";
import { tokenFrom } from "./context";
import {
  SuspendAccountDocument,
  UnsuspendAccountDocument,
  CreateIpWhitelistEntryDocument,
  UpdateIpWhitelistEntryDocument,
  DeleteIpWhitelistEntryDocument,
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
  async handler(
    body: { id: string },
    context: MutationContext,
  ): Promise<MutationResult> {
    const result = await executeDocument<SuspendAccountMutation>(
      SuspendAccountDocument,
      { id: body.id },
      tokenFrom(context),
    );
    const data = result.data?.gaiaMutations?.suspendAccount as
      MutationResult | undefined;
    return {
      ...(data ?? {
        __typename: "StandardError",
        message: result.error || "Failed to suspend account.",
      }),
      invalidated: [
        makeCacheKey("accounts:accounts", { page: "*" }),
        makeCacheKey("admin/:id:account", { id: body.id }),
      ],
    } as MutationResult;
  },
});

/**
 * Creates an IP whitelist entry.
 */
defineMutation({
  path: "gaia/createIpWhitelistEntry",
  async handler(
    body: { pattern: string; description?: string | null; immutable?: boolean; enabled?: boolean },
    context: MutationContext,
  ): Promise<MutationResult> {
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
    const data = result.data?.gaiaMutations?.createIpWhitelistEntry as
      MutationResult | undefined;
    return {
      ...(data ?? {
        __typename: "StandardError",
        message: result.error || "Failed to create IP whitelist entry.",
      }),
      invalidated: [makeCacheKey("ipEntries:ipEntries", {})],
    } as MutationResult;
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
  ): Promise<MutationResult> {
    const { id, ...input } = body;
    const result = await executeDocument<UpdateIpWhitelistEntryMutation>(
      UpdateIpWhitelistEntryDocument,
      { id, input },
      tokenFrom(context),
    );
    const data = result.data?.gaiaMutations?.updateIpWhitelistEntry as
      MutationResult | undefined;
    return {
      ...(data ?? {
        __typename: "StandardError",
        message: result.error || "Failed to update IP whitelist entry.",
      }),
      invalidated: [makeCacheKey("ipEntries:ipEntries", {})],
    } as MutationResult;
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
  ): Promise<MutationResult> {
    const result = await executeDocument<DeleteIpWhitelistEntryMutation>(
      DeleteIpWhitelistEntryDocument,
      { id: body.id },
      tokenFrom(context),
    );
    const data = result.data?.gaiaMutations?.deleteIpWhitelistEntry as
      MutationResult | undefined;
    return {
      ...(data ?? {
        __typename: "StandardError",
        message: result.error || "Failed to delete IP whitelist entry.",
      }),
      invalidated: [makeCacheKey("ipEntries:ipEntries", {})],
    } as MutationResult;
  },
});

/**
 * Re-activates a suspended account.
 */
defineMutation({
  path: "gaia/unsuspendAccount",
  async handler(
    body: { id: string },
    context: MutationContext,
  ): Promise<MutationResult> {
    const result = await executeDocument<UnsuspendAccountMutation>(
      UnsuspendAccountDocument,
      { id: body.id },
      tokenFrom(context),
    );
    const data = result.data?.gaiaMutations?.unsuspendAccount as
      MutationResult | undefined;
    return {
      ...(data ?? {
        __typename: "StandardError",
        message: result.error || "Failed to unsuspend account.",
      }),
      invalidated: [
        makeCacheKey("accounts:accounts", { page: "*" }),
        makeCacheKey("admin/:id:account", { id: body.id }),
      ],
    } as MutationResult;
  },
});

/**
 * Generates a pre-auth key via Headscale and returns the QR code
 * as a base64 data URL along with the raw key text.
 */
defineMutation({
  path: "headscale/generate-key",
  async handler(
    body: { expiry: string },
  ): Promise<MutationResult> {
    try {
      const backendUrl =
        process.env.GRAPHQL_ENDPOINT?.replace("/graphql", "") ||
        "http://localhost:8083";
      const res = await fetch(
        `${backendUrl}/api/headscale/preauth-key?expiry=${encodeURIComponent(body.expiry)}`,
      );
      if (!res.ok) {
        return { __typename: "StandardError", message: `Backend returned ${res.status}` };
      }
      const keyText = res.headers.get("X-Preauth-Key") || "";
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      return {
        __typename: "QuerySuccess",
        message: keyText,
        id: `data:image/png;base64,${base64}`,
      };
    } catch (e) {
      return { __typename: "StandardError", message: String(e) };
    }
  },
});

/**
 * Expires a Tailscale node via Headscale.
 */
defineMutation({
  path: "headscale/expire-node",
  async handler(body: { id: number }): Promise<MutationResult> {
    try {
      const backendUrl =
        process.env.GRAPHQL_ENDPOINT?.replace("/graphql", "") ||
        "http://localhost:8083";
      const res = await fetch(
        `${backendUrl}/api/headscale/nodes/${body.id}/expire`,
        { method: "POST" },
      );
      if (!res.ok) {
        return { __typename: "StandardError", message: `Backend returned ${res.status}` };
      }
      return {
        __typename: "QuerySuccess",
        message: "Node expired",
        id: "",
        invalidated: [makeCacheKey("tailscaleNodes:tailscaleNodes", {})],
      };
    } catch (e) {
      return { __typename: "StandardError", message: String(e) };
    }
  },
});
