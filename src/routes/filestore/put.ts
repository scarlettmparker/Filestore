import { mutationRegistry } from "~/utils/mutations";
import { MutationResult } from "~/server/actions/utils";
import {
  mutateDeleteFile,
  mutateDeleteKey,
  mutateGetPresignedDownloadUrl,
  mutateGetPresignedUploadUrl,
  mutatePutKey,
  mutateRenameKey,
} from "~/utils/api";
import { makeCacheKey } from "~/utils/page-data";
import { ServerRedirectError } from "~/utils/server-redirect";

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
    const folderPath = (body.path as string) || "";
    const redirectTo = folderPath
      ? `/bucket/${bucket}/${folderPath}`
      : `/bucket/${bucket}`;
    const pattern = folderPath ? `bucket/:alias/*` : `bucket/:alias`;

    const params: Record<string, unknown> = folderPath
      ? { alias: bucket, path: folderPath }
      : { alias: bucket };
    const cacheKey = makeCacheKey(`${pattern}:keys`, params);

    throw new ServerRedirectError(redirectTo, cacheKey, {
      __typename: "QuerySuccess",
      message: "Uploaded",
      id: "",
    });
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
 * Get redirect URL and cache invalidation key for a given bucket/key. Used for cache invalidation.
 * @param bucket Bucket name
 * @param path Path of the key, used to determine redirect URL and cache key pattern.
 */
const getRedirectAndCacheInfo = (bucket: string, path?: string) => {
  const folderPath = path || "";
  const redirectTo = folderPath
    ? `/bucket/${bucket}/${folderPath}`
    : `/bucket/${bucket}`;
  const pattern = folderPath ? `bucket/:alias/*` : `bucket/:alias`;

  const params: Record<string, unknown> = folderPath
    ? { alias: bucket, path: folderPath }
    : { alias: bucket };
  const cacheKey = makeCacheKey(`${pattern}:keys`, params);

  return { redirectTo, cacheKey };
};

/**
 * Handle post-upload redirect + cache invalidation after a direct presigned upload.
 */
async function handleUploadComplete(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, path } = body;
  const { redirectTo, cacheKey } = getRedirectAndCacheInfo(
    bucket as string,
    path as string,
  );

  throw new ServerRedirectError(redirectTo, cacheKey, {
    __typename: "QuerySuccess",
    message: "Uploaded successfully",
    id: "",
  });
}

/**
 * Delete a file.
 */
async function handleDeleteFile(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, key, path } = body;
  const { redirectTo, cacheKey } = getRedirectAndCacheInfo(
    bucket as string,
    path as string,
  );

  const result = await mutateDeleteFile(bucket as string, key as string);

  if (result?.data?.filestoreMutations?.deleteFile) {
    throw new ServerRedirectError(redirectTo, cacheKey, {
      __typename: "QuerySuccess",
      message: "Deleted successfully",
      id: "",
    });
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
  const { redirectTo, cacheKey } = getRedirectAndCacheInfo(
    bucket as string,
    path as string,
  );

  const result = await mutateDeleteKey(bucket as string, key as string);

  if (result?.data?.filestoreMutations?.deleteKey) {
    // Need to invalidate for all nested paths (as otherwise it'll show files that no longer exist in keys)
    const cleanKey = (key as string).endsWith("/") ? key : key + "/";
    const deleteKeys = makeCacheKey("bucket/:alias/*:keys", {
      alias: bucket,
      path: `${cleanKey}*`,
    });

    throw new ServerRedirectError(redirectTo, [deleteKeys, cacheKey], {
      __typename: "QuerySuccess",
      message: "Deleted successfully",
      id: "",
    });
  }

  return {
    __typename: "StandardError",
    message: "Failed to delete key",
  };
}

/**
 * Rename a key (file or directory). This will rename all nested files and subdirs as well if it's a directory.
 * We have to handle merges and conflicts here, hence why the possible FormError return type instead of just
 * invalidating on success. We need the user to confirm if there are any conflicts.
 */
async function handleRenameKey(
  body: Record<string, unknown>,
): Promise<MutationResult> {
  const { bucket, sourceKey, targetKey, path, merge } = body;
  const { redirectTo, cacheKey } = getRedirectAndCacheInfo(
    bucket as string,
    path as string,
  );

  const result = await mutateRenameKey(
    bucket as string,
    sourceKey as string,
    targetKey as string,
    merge as boolean,
  );

  if (result?.data?.filestoreMutations?.renameKey) {
    const renameResult = result.data.filestoreMutations.renameKey;
    if (renameResult.success) {
      // Need to invalidate for all nested paths of the renamed key AND all nested paths of the merged key
      const cleanSource = (sourceKey as string).endsWith("/")
        ? sourceKey
        : sourceKey + "/";
      const cleanTarget = (targetKey as string).endsWith("/")
        ? targetKey
        : targetKey + "/";

      const renameKeys = [
        makeCacheKey("bucket/:alias/*:keys", {
          alias: bucket,
          path: `${cleanSource}*`,
        }),

        makeCacheKey("bucket/:alias/*:keys", {
          alias: bucket,
          path: `${cleanTarget}*`,
        }),
      ];

      throw new ServerRedirectError(redirectTo, [cacheKey, ...renameKeys], {
        __typename: "QuerySuccess",
        message: "Renamed successfully",
        id: "",
      });
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
