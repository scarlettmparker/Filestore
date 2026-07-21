import {
  defineLoader,
  invalidateCacheKeys,
  invalidatePageData,
  defineMutation,
  makeCacheKey,
  type MutationResult,
} from "@sun/ssr";
import {
  fetchHealth,
  fetchListBuckets,
  fetchListKeys,
  fetchLocateKeyDetail,
  mutateAddTorrent,
  mutateCancelTorrent,
  mutateDeleteFile,
  mutateDeleteKey,
  mutateGetPresignedDownloadUrl,
  mutateGetPresignedUploadUrl,
  mutatePutKey,
  mutateRenameKey,
} from "~/utils/api";
import type {
  ListKeysQuery,
  ListBucketsQuery,
  HealthQuery,
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
  async handler(body: BucketBody): Promise<MutationResult> {
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
    const result = await mutatePutKey(bucket, key ?? null);
    if (result?.data) {
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
  async handler(body: {
    bucket: string;
    key: string;
    contentType?: string;
  }): Promise<MutationResult> {
    const url = await mutateGetPresignedUploadUrl(
      body.bucket,
      body.key,
      typeof body.contentType === "string" ? body.contentType : undefined,
    );
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
  async handler(body: {
    bucket: string;
    key: string;
  }): Promise<MutationResult> {
    const url = await mutateGetPresignedDownloadUrl(body.bucket, body.key);
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
 */
defineMutation({
  path: "filestore/upload-complete",
  async handler(body: BucketBody): Promise<MutationResult> {
    const cacheKey = keysCacheKey(body.bucket, body.path);
    invalidateCacheKeys([cacheKey]);
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
  async handler(body: BucketBody & { key: string }): Promise<MutationResult> {
    const { bucket, key, path } = body;
    const cacheKey = keysCacheKey(bucket, path);
    const result = await mutateDeleteFile(bucket, key);
    if (result?.data?.filestoreMutations?.deleteFile) {
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
  async handler(body: BucketBody & { key: string }): Promise<MutationResult> {
    const { bucket, key, path } = body;
    const cacheKey = keysCacheKey(bucket, path);
    const result = await mutateDeleteKey(bucket, key);
    if (result?.data?.filestoreMutations?.deleteKey) {
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
  ): Promise<MutationResult> {
    const { bucket, sourceKey, targetKey, path, merge } = body;
    const cacheKey = keysCacheKey(bucket, path);
    const result = await mutateRenameKey(
      bucket,
      sourceKey,
      targetKey,
      merge ?? false,
    );
    if (result?.data?.filestoreMutations?.renameKey) {
      const renameResult = result.data.filestoreMutations.renameKey;
      if (renameResult.success) {
        const cleanSource = sourceKey.endsWith("/")
          ? sourceKey
          : sourceKey + "/";
        const cleanTarget = targetKey.endsWith("/")
          ? targetKey
          : targetKey + "/";
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
      } else if (renameResult.hasConflicts) {
        return {
          __typename: "FormError",
          message: `Rename has conflicts: ${JSON.stringify(renameResult.conflicts)}`,
        };
      }
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
  async handler(body: {
    bucket: string;
    path?: string;
    magnet?: string;
    torrentFileBase64?: string;
  }): Promise<MutationResult> {
    const { bucket, path, magnet, torrentFileBase64 } = body;
    if (!bucket) {
      return {
        __typename: "StandardError",
        message: "Invalid input: bucket required",
      };
    }
    const result = await mutateAddTorrent(
      bucket,
      path ?? null,
      magnet ?? null,
      torrentFileBase64 ?? null,
    );
    if (result) {
      const cacheKey = keysCacheKey(bucket, path ?? "");
      invalidatePageData([cacheKey]);
      return {
        __typename: "QuerySuccess",
        message: "Torrent added",
        id: result.id,
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
  async handler(body: {
    jobId: string;
    bucket: string;
    path?: string;
  }): Promise<MutationResult> {
    if (!body.jobId) {
      return { __typename: "StandardError", message: "jobId required" };
    }
    const result = await mutateCancelTorrent(body.jobId);
    if (result) {
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
 * Loads health data for the status page.
 */
defineLoader({
  pattern: "filestore",
  async loader() {
    const result = await fetchHealth();
    if (!result?.data || !result?.success) return null;
    const health = (result.data as HealthQuery).filestoreQueries.health;
    return health ? { health } : null;
  },
});

/**
 * Loads bucket list for the home page.
 */
defineLoader({
  pattern: "filestore",
  async loader() {
    const result = await fetchListBuckets();
    if (!result?.data || !result?.success) return null;
    const buckets = (result.data as ListBucketsQuery).filestoreQueries
      .listBuckets;
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
): Promise<Record<string, unknown> | null> {
  const result = await fetchListKeys(alias, path || undefined);
  if (!result?.data || !result?.success) return null;
  const keys = (result.data as ListKeysQuery).filestoreQueries.listKeys;
  if (!keys) return null;

  const data: Record<string, unknown> = { keys, detail: null };

  if (selected) {
    const detailResult = await fetchLocateKeyDetail(alias, selected);
    if (detailResult) {
      data.detail = detailResult;
    }
  }

  return data;
}

/**
 * Loads key list for a bucket root (no folder path).
 */
defineLoader({
  pattern: "bucket/:alias",
  async loader(params) {
    const alias = params.alias as string;
    const selected = params.selected as string | null;
    if (!alias) return null;
    return fetchBucketData(alias, "", selected);
  },
});

/**
 * Loads key list for a bucket at a folder path.
 */
defineLoader({
  pattern: "bucket/:alias/*",
  async loader(params) {
    const alias = params.alias as string;
    const path = params.path as string;
    const selected = params.selected as string | null;
    if (!alias || !path) return null;
    return fetchBucketData(alias, path, selected);
  },
});
