import { mutationRegistry, invalidateCacheKeys, makeCacheKey } from "@sun/ssr";
import type { MutationResult } from "@sun/ssr";
import {
  mutateDeleteFile,
  mutateDeleteKey,
  mutateGetPresignedDownloadUrl,
  mutateGetPresignedUploadUrl,
  mutatePutKey,
  mutateRenameKey,
} from "~/utils/api";

/**
 * Cache key for the keys list of a bucket (optionally at a folder path).
 * Matches what getPageData("keys", pattern, params) reads on both server and
 * client, so invalidating it refreshes the list via /__page-data.
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
 * Handler for putting a file or key via server mutation.
 */
async function handlePutKey(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key } = body;

  if (typeof bucket !== "string") {
    return {
      __typename: "StandardError" as const,
      message: "Invalid input: bucket required",
    };
  }

  if (key !== undefined && key !== null && typeof key !== "string") {
    return {
      __typename: "StandardError" as const,
      message: "Invalid input: key must be a string or null",
    };
  }

  const result = await mutatePutKey(bucket, key ?? null);

  if (result?.data) {
    const cacheKey = keysCacheKey(bucket, body.path as string);
    invalidateCacheKeys([cacheKey]);
    return {
      __typename: "QuerySuccess" as const,
      message: "Uploaded",
      id: "",
      invalidated: [cacheKey],
    };
  }

  return {
    __typename: "StandardError",
    message: "Failed to put file/key",
  } as const;
}

/**
 * Handle getting a presigned upload URL
 */
async function handleGetPresignedUploadUrl(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key, contentType } = body;
  const url = await mutateGetPresignedUploadUrl(
    bucket as string,
    key as string,
    typeof contentType === "string" ? contentType : undefined,
  );

  if (url) {
    return { __typename: "QuerySuccess", message: "URL generated", id: url };
  }

  return {
    __typename: "StandardError",
    message: "Failed to generate presigned URL",
  };
}

/**
 * Handle getting a presigned download URL
 */
async function handleGetPresignedDownloadUrl(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key } = body;
  const url = await mutateGetPresignedDownloadUrl(
    bucket as string,
    key as string,
  );

  if (url) {
    return { __typename: "QuerySuccess", message: "URL generated", id: url };
  }

  return {
    __typename: "StandardError",
    message: "Failed to generate presigned download URL",
  };
}

/**
 * Invalidate the cache after a direct presigned upload completes.
 */
async function handleUploadComplete(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, path } = body;
  const cacheKey = keysCacheKey(bucket as string, path as string);
  invalidateCacheKeys([cacheKey]);
  return {
    __typename: "QuerySuccess" as const,
    message: "Uploaded successfully",
    id: "",
    invalidated: [cacheKey],
  };
}

/**
 * Delete a file.
 */
async function handleDeleteFile(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key, path } = body;
  const cacheKey = keysCacheKey(bucket as string, path as string);

  const result = await mutateDeleteFile(bucket as string, key as string);

  if (result?.data?.filestoreMutations?.deleteFile) {
    invalidateCacheKeys([cacheKey]);
    return {
      __typename: "QuerySuccess" as const,
      message: "Deleted successfully",
      id: "",
      invalidated: [cacheKey],
    };
  }

  return {
    __typename: "StandardError",
    message: "Failed to delete file",
  };
}

/**
 * Delete a key (directory). This will delete ALL files and subdirs in the key!
 */
async function handleDeleteKey(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key, path } = body;
  const cacheKey = keysCacheKey(bucket as string, path as string);

  const result = await mutateDeleteKey(bucket as string, key as string);

  if (result?.data?.filestoreMutations?.deleteKey) {
    // Invalidate nested paths too, otherwise deleted files would still show up.
    const cleanKey = (key as string).endsWith("/") ? key : key + "/";
    const nestedKeys = makeCacheKey("bucket/:alias/*:keys", {
      alias: bucket,
      path: `${cleanKey}*`,
    });
    const invalidated = [nestedKeys, cacheKey];
    invalidateCacheKeys(invalidated);
    return {
      __typename: "QuerySuccess" as const,
      message: "Deleted successfully",
      id: "",
      invalidated,
    };
  }

  return {
    __typename: "StandardError",
    message: "Failed to delete key",
  };
}

/**
 * Rename a key (file or directory). This will rename all nested files and
 * subdirs as well if it's a directory. We have to handle merges and conflicts
 * here, hence the possible FormError return instead of just invalidating.
 */
async function handleRenameKey(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, sourceKey, targetKey, path } = body;
  const cacheKey = keysCacheKey(bucket as string, path as string);

  const result = await mutateRenameKey(
    bucket as string,
    sourceKey as string,
    targetKey as string,
    body.merge as boolean,
  );

  if (result?.data?.filestoreMutations?.renameKey) {
    const renameResult = result.data.filestoreMutations.renameKey;
    if (renameResult.success) {
      // Invalidate nested paths of both the source and (merged) target.
      const cleanSource = (sourceKey as string).endsWith("/")
        ? sourceKey
        : sourceKey + "/";
      const cleanTarget = (targetKey as string).endsWith("/")
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
        __typename: "QuerySuccess" as const,
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

  return {
    __typename: "StandardError",
    message: "Failed to rename key",
  };
}

/**
 * Register the mutation handler for filestore put operations.
 */
export function registerFilestorePutMutations(): void {
  mutationRegistry.registerMutationHandler("filestore/put", handlePutKey);
  mutationRegistry.registerMutationHandler(
    "filestore/get-presigned-upload-url",
    handleGetPresignedUploadUrl,
  );
  mutationRegistry.registerMutationHandler(
    "filestore/get-presigned-download-url",
    handleGetPresignedDownloadUrl,
  );
  mutationRegistry.registerMutationHandler(
    "filestore/upload-complete",
    handleUploadComplete,
  );
  mutationRegistry.registerMutationHandler(
    "filestore/delete-file",
    handleDeleteFile,
  );
  mutationRegistry.registerMutationHandler(
    "filestore/delete-key",
    handleDeleteKey,
  );
  mutationRegistry.registerMutationHandler(
    "filestore/rename-key",
    handleRenameKey,
  );
}
