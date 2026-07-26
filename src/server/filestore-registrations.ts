import {
  defineLoader,
  invalidateCacheKeys,
  invalidatePageData,
  defineMutation,
  makeCacheKey,
  type MutationResult,
  type MutationContext,
} from "@sun/ssr";
import { executeDocument } from "@sun/api";
import { tokenFrom } from "./context";
import { AUTH_COOKIE, getCookieValue } from "~/utils/auth";
import {
  AddTorrentDocument,
  CancelTorrentDocument,
  DeleteFileDocument,
  DeleteKeyDocument,
  GetPresignedDownloadUrlDocument,
  GetPresignedUploadUrlDocument,
  HealthDocument,
  ListBucketsDocument,
  ListKeysDocument,
  LocateKeyDetailDocument,
  PutKeyDocument,
  RenameKeyDocument,
  SearchTorrentsDocument,
  type PutKeyMutation,
  type DeleteFileMutation,
  type DeleteKeyMutation,
  type RenameKeyMutation,
  type AddTorrentMutation,
  type CancelTorrentMutation,
  type GetPresignedUploadUrlMutation,
  type GetPresignedDownloadUrlMutation,
  type HealthQuery,
  type ListBucketsQuery,
  type ListKeysQuery,
  type LocateKeyDetailQuery,
} from "~/generated/graphql";

/**
 * Body shape for key-list-affecting mutations: the bucket and, for nested
 * operations, the folder path used to compute the cache key to invalidate.
 */
type BucketBody = {
  bucket: string;
  key?: string | null;
  path?: string;
};

/**
 * Cache key for the keys list of a bucket, optionally at a folder path.
 */
function keysCacheKey(bucket: string, path?: string): string {
  const folderPath = path || "";
  const pattern = folderPath ? "bucket/:alias/*" : "bucket/:alias";
  const params: Record<string, unknown> = folderPath
    ? { alias: bucket, path: folderPath }
    : { alias: bucket };
  return makeCacheKey(`${pattern}:keys`, params);
}

/**
 * Puts a file or key, then invalidates the bucket's keys list.
 */
defineMutation({
  path: "filestore/put",
  async handler(
    body: BucketBody,
    context: MutationContext,
  ): Promise<MutationResult> {
    const { bucket, key, path } = body;
    if (!bucket) {
      return {
        __typename: "StandardError",
        message: "Invalid input: bucket required",
      };
    }
    if (key !== undefined && key !== null && typeof key !== "string") {
      return {
        __typename: "StandardError",
        message: "Invalid input: key must be a string or null",
      };
    }
    const result = await executeDocument<PutKeyMutation>(
      PutKeyDocument,
      { input: { bucket, key: key ?? null } },
      tokenFrom(context),
    );
    if (result.data?.filestoreMutations?.putKey) {
      const cacheKey = keysCacheKey(bucket, path);
      invalidateCacheKeys([cacheKey]);
      return {
        __typename: "QuerySuccess",
        message: "Uploaded",
        id: "",
        invalidated: [cacheKey],
      };
    }
    return { __typename: "StandardError", message: "Failed to put file/key" };
  },
});

/**
 * Returns a presigned upload URL for direct-to-storage PUT.
 */
defineMutation({
  path: "filestore/get-presigned-upload-url",
  async handler(
    body: { bucket: string; key: string; contentType?: string },
    context: MutationContext,
  ): Promise<MutationResult> {
    const result = await executeDocument<GetPresignedUploadUrlMutation>(
      GetPresignedUploadUrlDocument,
      {
        input: {
          bucket: body.bucket,
          key: body.key,
          contentType:
            typeof body.contentType === "string" ? body.contentType : null,
        },
      },
      tokenFrom(context),
    );
    const url = result.data?.filestoreMutations?.getPresignedUploadUrl as
      string | undefined;
    return url
      ? { __typename: "QuerySuccess", message: "URL generated", id: url }
      : {
          __typename: "StandardError",
          message: "Failed to generate presigned URL",
        };
  },
});

/**
 * Returns a presigned download URL for a key.
 */
defineMutation({
  path: "filestore/get-presigned-download-url",
  async handler(
    body: { bucket: string; key: string },
    context: MutationContext,
  ): Promise<MutationResult> {
    const result = await executeDocument<GetPresignedDownloadUrlMutation>(
      GetPresignedDownloadUrlDocument,
      { input: { bucket: body.bucket, key: body.key } },
      tokenFrom(context),
    );
    const url = result.data?.filestoreMutations?.getPresignedDownloadUrl as
      string | undefined;
    return url
      ? { __typename: "QuerySuccess", message: "URL generated", id: url }
      : {
          __typename: "StandardError",
          message: "Failed to generate presigned download URL",
        };
  },
});

/**
 * Invalidates the keys list after a direct presigned upload completes.
 * Also triggers transcoding for MKV/AVI files.
 */
defineMutation({
  path: "filestore/upload-complete",
  async handler(body: BucketBody & { key?: string }): Promise<MutationResult> {
    const cacheKey = keysCacheKey(body.bucket, body.path);
    invalidateCacheKeys([cacheKey]);

    const key = body.key ?? "";
    if (key.endsWith(".mkv") || key.endsWith(".avi")) {
      const backendUrl = process.env.GRAPHQL_ENDPOINT?.replace("/graphql", "") || "http://localhost:8083";
      fetch(`${backendUrl}/api/transcode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket: body.bucket, key }),
      }).catch((err) => console.error("Transcode failed:", err));
    }

    return {
      __typename: "QuerySuccess",
      message: "Uploaded successfully",
      id: "",
      invalidated: [cacheKey],
    };
  },
});

/**
 * Deletes a single file, then invalidates the keys list.
 */
defineMutation({
  path: "filestore/delete-file",
  async handler(
    body: BucketBody & { key: string },
    context: MutationContext,
  ): Promise<MutationResult> {
    const { bucket, key, path } = body;
    const cacheKey = keysCacheKey(bucket, path);
    const result = await executeDocument<DeleteFileMutation>(
      DeleteFileDocument,
      { input: { bucket, key } },
      tokenFrom(context),
    );
    if (result.data?.filestoreMutations?.deleteFile) {
      invalidateCacheKeys([cacheKey]);
      return {
        __typename: "QuerySuccess",
        message: "Deleted successfully",
        id: "",
        invalidated: [cacheKey],
      };
    }
    return { __typename: "StandardError", message: "Failed to delete file" };
  },
});

/**
 * Deletes a key (folder or file) and its contents; invalidates nested lists.
 */
defineMutation({
  path: "filestore/delete-key",
  async handler(
    body: BucketBody & { key: string },
    context: MutationContext,
  ): Promise<MutationResult> {
    const { bucket, key, path } = body;
    const cacheKey = keysCacheKey(bucket, path);
    const result = await executeDocument<DeleteKeyMutation>(
      DeleteKeyDocument,
      { input: { bucket, key } },
      tokenFrom(context),
    );
    if (result.data?.filestoreMutations?.deleteKey) {
      const cleanKey = key.endsWith("/") ? key : key + "/";
      const nestedKeys = makeCacheKey("bucket/:alias/*:keys", {
        alias: bucket,
        path: `${cleanKey}*`,
      });
      const invalidated = [nestedKeys, cacheKey];
      invalidateCacheKeys(invalidated);
      return {
        __typename: "QuerySuccess",
        message: "Deleted successfully",
        id: "",
        invalidated,
      };
    }
    return { __typename: "StandardError", message: "Failed to delete key" };
  },
});

/**
 * Renames a key, handling merges and conflicts; invalidates source + target.
 */
defineMutation({
  path: "filestore/rename-key",
  async handler(
    body: BucketBody & {
      sourceKey: string;
      targetKey: string;
      merge?: boolean;
    },
    context: MutationContext,
  ): Promise<MutationResult> {
    const { bucket, sourceKey, targetKey, path, merge } = body;
    const cacheKey = keysCacheKey(bucket, path);
    const result = await executeDocument<RenameKeyMutation>(
      RenameKeyDocument,
      { input: { bucket, sourceKey, targetKey, merge: merge ?? false } },
      tokenFrom(context),
    );
    const renameResult = result.data?.filestoreMutations?.renameKey;
    if (renameResult?.success) {
      const cleanSource = sourceKey.endsWith("/") ? sourceKey : sourceKey + "/";
      const cleanTarget = targetKey.endsWith("/") ? targetKey : targetKey + "/";
      const invalidated = [
        cacheKey,
        makeCacheKey("bucket/:alias/*:keys", {
          alias: bucket,
          path: `${cleanSource}*`,
        }),
        makeCacheKey("bucket/:alias/*:keys", {
          alias: bucket,
          path: `${cleanTarget}*`,
        }),
      ];
      invalidateCacheKeys(invalidated);
      return {
        __typename: "QuerySuccess",
        message: "Renamed successfully",
        id: "",
        invalidated,
      };
    } else if (renameResult?.hasConflicts) {
      return { __typename: "FormError", message: "Rename has conflicts" };
    }
    return { __typename: "StandardError", message: "Failed to rename key" };
  },
});

/**
 * Starts a torrent download into the bucket; invalidates the keys list so the
 * in-progress key appears immediately.
 */
defineMutation({
  path: "filestore/add-torrent",
  async handler(
    body: {
      bucket: string;
      path?: string;
      magnet?: string;
      torrentFileBase64?: string;
    },
    context: MutationContext,
  ): Promise<MutationResult> {
    const { bucket, path, magnet, torrentFileBase64 } = body;
    if (!bucket) {
      return {
        __typename: "StandardError",
        message: "Invalid input: bucket required",
      };
    }
    const result = await executeDocument<AddTorrentMutation>(
      AddTorrentDocument,
      {
        input: {
          bucket,
          path: path ?? null,
          magnet: magnet ?? null,
          torrentFileBase64: torrentFileBase64 ?? null,
        },
      },
      tokenFrom(context),
    );
    const data = result.data?.filestoreMutations?.addTorrent as
      { id: string } | undefined;
    if (data) {
      const cacheKey = keysCacheKey(bucket, path ?? "");
      invalidatePageData([cacheKey]);
      return {
        __typename: "QuerySuccess",
        message: "Torrent added",
        id: data.id,
        invalidated: [cacheKey],
      };
    }
    return { __typename: "StandardError", message: "Failed to add torrent" };
  },
});

/**
 * Cancels a torrent job and removes its scratch data.
 */
defineMutation({
  path: "filestore/cancel-torrent",
  async handler(
    body: { jobId: string; bucket: string; path?: string },
    context: MutationContext,
  ): Promise<MutationResult> {
    if (!body.jobId) {
      return { __typename: "StandardError", message: "jobId required" };
    }
    const result = await executeDocument<CancelTorrentMutation>(
      CancelTorrentDocument,
      { jobId: body.jobId },
      tokenFrom(context),
    );
    if (result.data?.filestoreMutations?.cancelTorrent) {
      const cacheKey = keysCacheKey(body.bucket, body.path);
      invalidatePageData([cacheKey]);
      return {
        __typename: "QuerySuccess",
        message: "Torrent cancelled",
        id: "",
        invalidated: [cacheKey],
      };
    }
    return { __typename: "StandardError", message: "Failed to cancel torrent" };
  },
});

/**
 * Searches Jackett for torrents matching the query.
 */
defineMutation({
  path: "filestore/search-torrents",
  async handler(body: { query: string }, context: MutationContext): Promise<MutationResult> {
    const result = await executeDocument<{
      filestoreQueries: { searchTorrents: Record<string, unknown>[] | null };
    }>(SearchTorrentsDocument, { query: body.query }, tokenFrom(context));
    const results = result.data?.filestoreQueries?.searchTorrents;
    if (results) {
      return {
        __typename: "QuerySuccess",
        message: JSON.stringify(results),
        id: "",
      };
    }
    return {
      __typename: "StandardError",
      message: result.error || "Search failed",
    };
  },
});

/**
 * Loads health data for the status page.
 */
defineLoader({
  pattern: "filestore",
  async loader() {
    const result = await executeDocument<HealthQuery>(HealthDocument, {});
    const health = result.data?.filestoreQueries?.health;
    return health ? { health } : null;
  },
});

/**
 * Loads bucket list for the home page.
 */
defineLoader({
  pattern: "filestore",
  async loader(_params, context) {
    const token = getCookieValue(context?.cookie, AUTH_COOKIE);
    const result = await executeDocument<ListBucketsQuery>(
      ListBucketsDocument,
      {},
      token,
    );
    const buckets = result.data?.filestoreQueries?.listBuckets;
    return buckets ? { buckets } : null;
  },
});

/**
 * Fetches key list and optional key detail for bucket views.
 */
async function fetchBucketData(
  alias: string,
  path: string,
  selected?: string | null,
  token?: string,
): Promise<Record<string, unknown> | null> {
  const result = await executeDocument<ListKeysQuery>(
    ListKeysDocument,
    { bucket: alias, prefix: path || undefined },
    token,
  );
  const keys = result.data?.filestoreQueries?.listKeys;
  if (!keys) return null;

  const data: Record<string, unknown> = {
    keys,
    detail: { __typename: "Placeholder", key: selected },
  };

  if (selected) {
    const detailResult = await executeDocument<LocateKeyDetailQuery>(
      LocateKeyDetailDocument,
      { bucket: alias, keyPath: selected },
      token,
    );
    const detail = detailResult.data?.filestoreQueries?.locate;
    if (detail) {
      data.detail = detail;
    }
  }

  return data;
}

/**
 * Loads key list for a bucket root (no folder path).
 */
defineLoader({
  pattern: "bucket/:alias",
  async loader(params, context) {
    const alias = params.alias as string;
    const selected = params.selected as string | null;
    const token = getCookieValue(context?.cookie, AUTH_COOKIE);
    if (!alias) return null;
    return fetchBucketData(alias, "", selected, token);
  },
});

/**
 * Loads key list for a bucket at a folder path.
 */
defineLoader({
  pattern: "bucket/:alias/*",
  async loader(params, context) {
    const alias = params.alias as string;
    const path = params.path as string;
    const selected = params.selected as string | null;
    const token = getCookieValue(context?.cookie, AUTH_COOKIE);
    if (!alias || !path) return null;
    return fetchBucketData(alias, path, selected, token);
  },
});
