import { defineMutation, makeCacheKey } from "@sun/ssr";
import { executeDocument } from "~/utils/api";
import { tokenFrom } from "./context";
import {
  SuspendAccountDocument,
  UnsuspendAccountDocument,
  CreateIpWhitelistEntryDocument,
  UpdateIpWhitelistEntryDocument,
  DeleteIpWhitelistEntryDocument,
  type SuspendAccountMutation,
  type SuspendAccountMutationVariables,
  type UnsuspendAccountMutation,
  type UnsuspendAccountMutationVariables,
  type CreateIpWhitelistEntryMutation,
  type CreateIpWhitelistEntryMutationVariables,
  type UpdateIpWhitelistEntryMutation,
  type UpdateIpWhitelistEntryMutationVariables,
  type DeleteIpWhitelistEntryMutation,
  type DeleteIpWhitelistEntryMutationVariables,
} from "~/generated/graphql";

/**
 * Suspends an account, revoking all active sessions.
 */
defineMutation({
  path: "gaia/suspendAccount",
  async handler(body: SuspendAccountMutationVariables, context) {
    const result = await executeDocument<
      SuspendAccountMutation,
      SuspendAccountMutationVariables
    >(SuspendAccountDocument, { id: body.id }, tokenFrom(context));
    const data = result.data?.gaiaMutations?.suspendAccount;
    return {
      ...(data ?? {
        __typename: "StandardError" as const,
        message: result.error || "Failed to suspend account.",
      }),
      invalidated: [
        makeCacheKey("accounts:accounts", { page: "*" }),
        makeCacheKey("admin/:id:account", { id: body.id }),
      ],
    };
  },
});

/**
 * Creates an IP whitelist entry.
 */
defineMutation({
  path: "gaia/createIpWhitelistEntry",
  async handler(body: CreateIpWhitelistEntryMutationVariables, context) {
    const result = await executeDocument<
      CreateIpWhitelistEntryMutation,
      CreateIpWhitelistEntryMutationVariables
    >(CreateIpWhitelistEntryDocument, { pattern: body.pattern, description: body.description, immutable: body.immutable }, tokenFrom(context));
    const data = result.data?.gaiaMutations?.createIpWhitelistEntry;
    return {
      ...(data ?? {
        __typename: "StandardError" as const,
        message: result.error || "Failed to create IP whitelist entry.",
      }),
      invalidated: [
        makeCacheKey("ipEntries:ipEntries", {}),
      ],
    };
  },
});

/**
 * Updates an IP whitelist entry.
 */
defineMutation({
  path: "gaia/updateIpWhitelistEntry",
  async handler(body: UpdateIpWhitelistEntryMutationVariables, context) {
    const result = await executeDocument<
      UpdateIpWhitelistEntryMutation,
      UpdateIpWhitelistEntryMutationVariables
    >(UpdateIpWhitelistEntryDocument, { id: body.id, pattern: body.pattern, description: body.description, enabled: body.enabled }, tokenFrom(context));
    const data = result.data?.gaiaMutations?.updateIpWhitelistEntry;
    return {
      ...(data ?? {
        __typename: "StandardError" as const,
        message: result.error || "Failed to update IP whitelist entry.",
      }),
      invalidated: [
        makeCacheKey("ipEntries:ipEntries", {}),
      ],
    };
  },
});

/**
 * Deletes an IP whitelist entry.
 */
defineMutation({
  path: "gaia/deleteIpWhitelistEntry",
  async handler(body: DeleteIpWhitelistEntryMutationVariables, context) {
    const result = await executeDocument<
      DeleteIpWhitelistEntryMutation,
      DeleteIpWhitelistEntryMutationVariables
    >(DeleteIpWhitelistEntryDocument, { id: body.id }, tokenFrom(context));
    const data = result.data?.gaiaMutations?.deleteIpWhitelistEntry;
    return {
      ...(data ?? {
        __typename: "StandardError" as const,
        message: result.error || "Failed to delete IP whitelist entry.",
      }),
      invalidated: [
        makeCacheKey("ipEntries:ipEntries", {}),
      ],
    };
  },
});

/**
 * Re-activates a suspended account.
 */
defineMutation({
  path: "gaia/unsuspendAccount",
  async handler(body: UnsuspendAccountMutationVariables, context) {
    const result = await executeDocument<
      UnsuspendAccountMutation,
      UnsuspendAccountMutationVariables
    >(UnsuspendAccountDocument, { id: body.id }, tokenFrom(context));
    const data = result.data?.gaiaMutations?.unsuspendAccount;
    return {
      ...(data ?? {
        __typename: "StandardError" as const,
        message: result.error || "Failed to unsuspend account.",
      }),
      invalidated: [
        makeCacheKey("accounts:accounts", { page: "*" }),
        makeCacheKey("admin/:id:account", { id: body.id }),
      ],
    };
  },
});
